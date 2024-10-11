import { Types } from 'mongoose';
import { Response } from 'express';
import moment from 'moment';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import {
  PaymentStatus,
  OrderStatus,
  OrdersListItem,
  CompleteOrdersDetail,
} from '@ecom/mern-shared';
import { OrderModel } from '@/models';
import { errorLogger } from '@/utils';
import { UUID } from 'bson';

class OrderService {
  async getCustomerOrdersList(res: Response, customerId: string) {
    try {
      const ordersList: OrdersListItem[] = await OrderModel.aggregate([
        {
          $match: {
            customerId: new Types.ObjectId(customerId),
            $or: [
              { order_status: OrderStatus.Processing },
              { order_status: OrderStatus.InTransit },
              { order_status: OrderStatus.Delivered },
            ],
            payment_status: PaymentStatus.Paid,
          },
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'groceries',
            let: {
              productId: '$products.product_id',
              prodQuantity: '$products.quantity',
            },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
              {
                $project: {
                  _id: 0,
                  product_name: 1,
                  image_url: 1,
                },
              },
            ],
            as: 'productDetails',
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              createdAt: '$createdAt',
              order_status: '$order_status',
              payment_status: '$payment_status',
              payment: '$payment',
            },
            products: { $push: { $first: '$productDetails' } },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            createdAt: '$_id.createdAt',
            order_status: '$_id.order_status',
            payment_status: '$_id.payment_status',
            payment: '$_id.payment',
            products: '$products',
          },
        },
      ]).exec();
      res.send(ordersList);
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getOrderInfo(orderId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const orderDetails: CompleteOrdersDetail[] = await OrderModel.aggregate(
          [
            { $match: { _id: new UUID(orderId) } },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$customerId', addressId: '$deliveryAddressId' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  { $unwind: '$addresses' },
                  {
                    $match: {
                      $expr: { $eq: ['$addresses._id', '$$addressId'] },
                    },
                  },
                  {
                    $project: {
                      'addresses._id': 0,
                      'addresses.createdAt': 0,
                      'addresses.updatedAt': 0,
                      'addresses.isDefault': 0,
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      address: '$addresses',
                    },
                  },
                ],
                as: 'userDetails',
              },
            },
            { $unwind: '$products' },
            {
              $lookup: {
                from: 'groceries',
                let: {
                  productId: '$products.product_id',
                  prodQuantity: '$products.quantity',
                },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                  {
                    $project: {
                      _id: 1,
                      product_name: 1,
                      brand: 1,
                      image_url: 1,
                      discount_price: 1,
                      quantity: 1,
                      handle: 1,
                      num_items: '$$prodQuantity',
                    },
                  },
                ],
                as: 'productDetails',
              },
            },
            {
              $group: {
                _id: {
                  _id: '$_id',
                  userDetails: '$userDetails',
                  order_status: '$order_status',
                  payment_status: '$payment_status',
                  razorpay_order_id: '$razorpay_order_id',
                  createdAt: '$createdAt',
                  payment: '$payment',
                },
                products: { $push: { $first: '$productDetails' } },
              },
            },
            {
              $project: {
                _id: '$_id._id',
                createdAt: '$_id.createdAt',
                payment: '$_id.payment',
                order_status: '$_id.order_status',
                payment_status: '$_id.payment_status',
                razorpay_order_id: '$_id.razorpay_order_id',
                deliveryAddress: { $first: '$_id.userDetails.address' },
                products: '$products',
              },
            },
          ]
        );
        resolve(orderDetails[0]);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getOrderDetails(res: Response, orderId: string) {
    try {
      const result = await this.getOrderInfo(orderId);
      res.send(result);
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async downloadOrderInvoice(res: Response, orderId: string) {
    const orderInfo = (await this.getOrderInfo(
      orderId
    )) as CompleteOrdersDetail;
    // res.send(orderInfo);

    const doc = new PDFDocument({
      size: 'A4',
      // userPassword: '123@',
      // ownerPassword: '123@',
      // pdfVersion: '1.7ext3',
      // permissions: {
      //   printing: 'highResolution',
      //   modifying: false,
      //   copying: true,
      //   contentAccessibility: true,
      //   documentAssembly: true,
      // },
    });
    const fileName = `${orderId}.pdf`;
    doc.info = {
      Title: `Invoice for Order ${orderId}`,
      Author: 'Nishant',
      Subject: 'Order Invoice',
      CreationDate: new Date(),
    };

    let homeAddress = `${orderInfo.deliveryAddress.houseNo}, ${orderInfo.deliveryAddress.street}`;
    if (orderInfo.deliveryAddress.landmark) {
      homeAddress += `, ${orderInfo.deliveryAddress.landmark}`;
    }

    doc.pipe(fs.createWriteStream(fileName));

    // doc
    //   .image(`${__dirname}/dh.jpeg`)
    doc.fontSize(16).text('Order Details');
    doc.fontSize(14);
    doc.text(
      `
      ${orderInfo.deliveryAddress.recipientName}
      ${homeAddress}
      ${orderInfo.deliveryAddress.city}, ${orderInfo.deliveryAddress.state.name} - ${orderInfo.deliveryAddress.zipCode}
      ${orderInfo.deliveryAddress.country.name}
      `,
      {
        align: 'left',
      }
    );
    doc.text(
      `
      Order Number - ${orderInfo._id}
      Order Date- ${moment(orderInfo.createdAt).format('DD MMM YYYY HH:MM ')} 
      Total - ₹ ${(orderInfo.payment.amount / 100).toFixed(2)}
    `,
      {
        align: 'right',
      }
    );
    doc.end();

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/pdf');
    res.download(fileName);
  }
}

export default new OrderService();
