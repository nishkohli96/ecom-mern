import { Types } from 'mongoose';
import { PurchaseOrderInfo } from '@ecom/mern-shared';

export interface PurchaseDetails extends PurchaseOrderInfo {
  customerId: Types.ObjectId;
  deliveryAddressId: Types.ObjectId;
}
