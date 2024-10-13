import { Response } from 'express';
import fs from 'fs';
import { parse } from 'csv-parse';
import { GroceryInventory, GroceryItem, CartProduct } from '@ecom-mern/shared';
import { GroceryModel } from '@/models';
import { algoliaIndex } from '@/algolia/client';
import { slugifyGroceryName, printSuccessMsg, errorLogger } from '@/utils';
import * as GroceryTypes from './types';
import { Types } from 'mongoose';

class GroceryService {
  groceryItemSelectionFields = [
    '_id',
    'product_name',
    'sku',
    'handle',
    'brand',
    'price',
    'discount_price',
    'image_url',
    'quantity',
    'inStock',
    'category',
    'sub_category'
  ];

  async getGroceryRecords(res: Response, pageNum: number, num_entries: number) {
    try {
      const result = await GroceryModel.find()
        .skip((pageNum - 1) * num_entries)
        .limit(num_entries)
        .select('-__v');

      res.status(200).send(result);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getAvailability(res: Response, groceryChosen: GroceryInventory) {
    try {
      const groceryInfo = await GroceryModel.findOne({
        _id: new Types.ObjectId(groceryChosen.product_id)
      });
      if (groceryChosen.quantity_selected > (groceryInfo?.inStock ?? 0)) {
        return res.status(400).send('Insufficient stock').end();
      }
      return res.status(200).send('In stock').end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  /**
   * Show 5 random records from db in the carousel
   * of the frontend using sample method from mongodb
   * aggregation.
   */
  async getRandomGroceries(res: Response) {
    const num_entries = 5;
    try {
      const result: GroceryItem[] = await GroceryModel.aggregate([
        { $sample: { size: num_entries } }
      ]).project({
        _id: 1,
        product_name: 1,
        handle: 1,
        brand: 1,
        price: 1,
        discount_price: 1,
        image_url: 1,
        quantity: 1,
        category: 1,
        sub_category: 1,
        inStock: 1
      });
      res.status(200).send(result);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async addGroceryItem(
    res: Response,
    groceryItem: GroceryTypes.AddGroceryItem
  ) {
    const existingProduct = await GroceryModel.findOne({
      product_name: groceryItem.product_name
    });
    if (existingProduct)
      return res
        .status(400)
        .send('This product already exists in the inventory');

    try {
      const grocery = new GroceryModel(groceryItem);
      const result = await grocery.save();

      /**
       *  To prevent __v from appearing as a field in algolia object,
       *  I had to do like this.
       *
       *  Also result.toObject(), will make sure that when i use ... operator
       *  on result, it won't show me the unwanted mongoose fields.
       */
      const exclude = new Set(['createdAt', 'updatedAt', '__v']);
      const groceryFields = Object.fromEntries(
        Object.entries(result.toObject()).filter((e) => !exclude.has(e[0]))
      );

      const { objectID } = await algoliaIndex.saveObject(groceryFields, {
        autoGenerateObjectIDIfNotExist: true
      });

      res.status(200).send({
        _id: result._id,
        objectID
      });
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getGroceryById(res: Response, id: string) {
    try {
      const grocery = await GroceryModel.findOne({ _id: id }).select([
        '-createdAt',
        '-updatedAt',
        '-__v'
      ]);
      if (!grocery) {
        res.status(404).send('No product found with this id').end();
      }
      res.status(200).send(grocery);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getGroceryBySku(res: Response, sku: number) {
    try {
      const grocery = await GroceryModel.findOne({ sku }).select([
        '-createdAt',
        '-updatedAt',
        '-__v'
      ]);
      if (!grocery) {
        res.status(404).send('No product found with this id').end();
      }
      res.status(200).send(grocery);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async updateGroceryItem(
    res: Response,
    id: string,
    updatedGroceryItem: GroceryTypes.UpdateGroceryItem
  ) {
    try {
      let updatedDetails = updatedGroceryItem;
      if (updatedDetails.product_name) {
        updatedDetails = {
          ...updatedDetails,
          handle: slugifyGroceryName(updatedDetails.product_name)
        };
      }

      /* Update item data in mongodb */
      const result = await GroceryModel.findByIdAndUpdate(id, updatedDetails, {
        upsert: true,
        new: true,
        /** Run validator when updating, its off by default */
        runValidators: true
      });

      /* Sync the update on algolia */
      const groceryRecord_Algolia = await algoliaIndex.search(id, {
        disableTypoToleranceOnAttributes: ['_id'],
        /* doesn't show _highlightResult field in result */
        attributesToHighlight: []
      });

      const { objectID } = await algoliaIndex.partialUpdateObject({
        ...updatedGroceryItem,
        objectID: groceryRecord_Algolia.hits[0].objectID
      });

      res.status(200).send({
        objectID,
        ...result.toObject()
      });
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async deleteGroceryItem(res: Response, id: string) {
    try {
      /* Delete item from mongodb; returns the mongodb object */
      const result = await GroceryModel.findByIdAndDelete(id);

      /* Fetch the item from algolia */
      const groceryRecord_Algolia = await algoliaIndex.search(id, {
        disableTypoToleranceOnAttributes: ['_id'],
        /* doesn't show _highlightResult field in result */
        attributesToHighlight: []
      });
      const objectID = groceryRecord_Algolia.hits[0].objectID;

      /* Delete by objectID; returns { taskID: 20389951002 } */
      await algoliaIndex.deleteObject(objectID);

      res.status(200).send({
        objectID,
        ...result
      });
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async updateStockAfterPurchase(
    // res: Response,
    purchasedProducts: CartProduct[]
  ) {
    try {
      for (let i = 0; i < purchasedProducts.length; i++) {
        const deductedQuantity = -1 * purchasedProducts[i].quantity;
        const updatedProduct = await GroceryModel.findByIdAndUpdate(
          purchasedProducts[i].product_id,
          {
            $inc: { inStock: deductedQuantity }
          }
        );
        /* Sync the update on algolia */
        const groceryRecord_Algolia = await algoliaIndex.search<GroceryItem>(
          updatedProduct?._id.toString() ?? '',
          {
            disableTypoToleranceOnAttributes: ['_id'],
            /* doesn't show _highlightResult field in result */
            attributesToHighlight: []
          }
        );

        await algoliaIndex.partialUpdateObject({
          inStock: groceryRecord_Algolia.hits[0].inStock + deductedQuantity,
          objectID: groceryRecord_Algolia.hits[0].objectID
        });
      }
      // res.status(200).send('Updated inStock Quantity');
    } catch (err: any) {
      console.log('err', err);
      // errorLogger(res, err);
    }
  }

  async getGroceryCategorization(res: Response) {
    const categories = await GroceryModel.aggregate([
      {
        $group: {
          _id: {
            category: '$category',
            sub_category: '$sub_category'
          },
          num_products: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            category: '$_id.category'
          },
          sub_categories: {
            $addToSet: {
              name: '$_id.sub_category',
              num_products: '$num_products'
            }
          },
          total_products: { $sum: '$num_products' }
        }
      },
      {
        $sort: { total_products: -1 }
      },
      {
        $project: {
          _id: 0,
          name: '$_id.category',
          num_products: '$total_products',
          sub_categories: {
            $sortArray: {
              input: '$sub_categories',
              sortBy: { num_products: -1 }
            }
          }
        }
      }
    ]);

    const brands = await GroceryModel.aggregate([
      { $group: { _id: '$brand', num_products: { $sum: 1 } } },
      { $sort: { num_products: -1 } },
      {
        $project: {
          _id: 0,
          name: '$_id',
          num_products: '$num_products'
        }
      }
    ]);

    return res
      .status(200)
      .send({
        brands,
        categories
      })
      .end();
  }

  uploadInventoryData(res: Response) {
    const groceryRecords: GroceryTypes.Grocery[] = [];
    try {
      fs.createReadStream(`${__dirname}/BigBasket.csv`)
        .pipe(parse({ delimiter: ',', columns: true, relax_quotes: true }))
        .on('data', function (row) {
          const productSku = Math.floor(Math.random() * 1000000);
          groceryRecords.push({
            ...row,
            sku: productSku,
            handle: `${slugifyGroceryName(row?.product_name)}-${productSku}`,
            inStock: Math.floor(Math.random() * 100)
          });
        })
        .on('error', function (error) {
          console.log('err ', error.message);
          errorLogger(res, error);
        })
        .on('end', async function () {
          const successMsg = 'grocery data uploaded to db';
          printSuccessMsg(successMsg);
          try {
            await GroceryModel.insertMany(groceryRecords);
            res.status(200).send(successMsg);
          } catch (err: any) {
            errorLogger(res, err);
          }
          /**
           *  Incase writing data as a JSON file -
           *
           *  const jsonData = JSON.stringify(groceryRecords);
           *  fs.writeFileSync(`${__dirname}/BigBasket.json`, jsonData, 'utf8');
           */
        });
    } catch (err) {
      console.log(err);
    }
  }

  async syncDbRecordsWithAlgolia(res: Response) {
    const allGroceryItems = await GroceryModel.find({})
      .select(['-__v', '-updatedAt', '-createdAt'])
      .lean();

    await algoliaIndex.clearObjects();
    await algoliaIndex
      .saveObjects(allGroceryItems, { autoGenerateObjectIDIfNotExist: true })
      .then(({ objectIDs }) => {
        const successMsg = 'DB records saved to algolia index';
        printSuccessMsg(successMsg);
        res.status(200).send(objectIDs);
      })
      .catch((err) => {
        errorLogger(res, err);
      });
  }

  async addAdditionalFieldsToEachGroceryItem(res: Response) {
    try {
      await GroceryModel.aggregate([
        {
          $set: {
            inStock: {
              $floor: {
                $multiply: [{ $rand: {} }, 100]
              }
            }
          }
        }
      ]);
      res
        .status(200)
        .send(
          'Grocery handle generated and random quantity assigned to each item'
        );
    } catch (err: any) {
      errorLogger(res, err);
    }
  }
}

export default new GroceryService();
