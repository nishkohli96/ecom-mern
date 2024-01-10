import { Router, Request, Response } from 'express';
import ALGOLIA_CONFIG from 'algolia/constants';
import { validateAuthHeader, authenticateAdmin } from 'utils';
import {
  ApiRoutesConfig,
  GroceryInventory,
  CartProduct,
} from '@ecom/mern-shared';
import groceryService from './service';
import * as GroceryTypes from './types';

const groceryRouter = Router();

groceryRouter.get(
  '/records',
  (req: Request<{}, {}, {}, GroceryTypes.GetGroceryParams>, res: Response) => {
    const pageNum = req.query.page ?? 1;
    const num_entries =
      req.query.num_entries ?? ALGOLIA_CONFIG.default_records_fetch;
    return groceryService.getGroceryRecords(res, pageNum, num_entries);
  }
);

groceryRouter.get(
  `/${ApiRoutesConfig.grocery.subRoutes.randomRecords}`,
  (req: Request, res: Response) => {
    return groceryService.getRandomGroceries(res);
  }
);

groceryRouter.get(
  `/${ApiRoutesConfig.grocery.subRoutes.productById}/:id`,
  (req: Request<GroceryTypes.GroceryById>, res: Response) => {
    const groceryId = req.params.id;
    return groceryService.getGroceryById(res, groceryId);
  }
);

groceryRouter.get(
  `/${ApiRoutesConfig.grocery.subRoutes.productInfo}/:sku`,
  (req: Request<GroceryTypes.GroceryBySku>, res: Response) => {
    const groceryId = req.params.sku;
    return groceryService.getGroceryBySku(res, groceryId);
  }
);

groceryRouter.get(
  `/${ApiRoutesConfig.grocery.subRoutes.availability}`,
  (req: Request<{}, {}, {}, GroceryInventory>, res: Response) => {
    const groceryChosen = req.query;
    return groceryService.getAvailability(res, groceryChosen);
  }
);

groceryRouter.post(
  '/add',
  validateAuthHeader,
  authenticateAdmin,
  (req: Request<{}, {}, GroceryTypes.AddGroceryItem>, res: Response) => {
    const groceryItem = req.body;
    return groceryService.addGroceryItem(res, groceryItem);
  }
);

groceryRouter.put(
  '/update/:id',
  validateAuthHeader,
  authenticateAdmin,
  (
    req: Request<GroceryTypes.GroceryById, {}, GroceryTypes.AddGroceryItem>,
    res: Response
  ) => {
    const groceryId = req.params.id;
    const groceryItem = req.body;
    return groceryService.updateGroceryItem(res, groceryId, groceryItem);
  }
);

// /**
//  * Test Route to update products inStock field in both
//  * mongoDB and algolia on purchase of product.
//  */
// type UpdateProducts = { products: CartProduct[]}
// groceryRouter.put(
//   '/update-quantity',
//   (
//     req: Request<{}, {}, UpdateProducts >,
//     res: Response
//   ) => {
//     const groceryItems = req.body.products;
//     return groceryService.updateStockAfterPurchase(res, groceryItems);
//   }
// );

/**
 * Get all brands, categories and sub-categories for that
 * category alongwith their product count.
 */
groceryRouter.get(
  `/${ApiRoutesConfig.grocery.subRoutes.categorization}`,
  (req: Request, res: Response) => {
    return groceryService.getGroceryCategorization(res);
  }
);

groceryRouter.delete(
  '/delete/:id',
  validateAuthHeader,
  authenticateAdmin,
  (req: Request<GroceryTypes.GroceryById>, res: Response) => {
    const groceryId = req.params.id;
    return groceryService.deleteGroceryItem(res, groceryId);
  }
);

/**
 * Upload dataset in mongodb, one time usage only.
 */
groceryRouter.post(
  '/upload-data',
  validateAuthHeader,
  authenticateAdmin,
  (_, res: Response) => {
    return groceryService.uploadInventoryData(res);
  }
);

/**
 * Uploads all records from mongodb to algolia,
 * one time usage only.
 */
groceryRouter.post(
  '/algolia-sync',
  validateAuthHeader,
  authenticateAdmin,
  (_, res: Response) => {
    return groceryService.syncDbRecordsWithAlgolia(res);
  }
);

/**
 * Add "inStock", field to all grocery Items, one time
 * usage only.
 */
groceryRouter.put(
  '/add-fields',
  validateAuthHeader,
  authenticateAdmin,
  (_, res: Response) => {
    return groceryService.addAdditionalFieldsToEachGroceryItem(res);
  }
);

export { groceryRouter };
