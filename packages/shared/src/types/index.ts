export * from './address';
export * from './auth';
export * from './cart';
export * from './checkout';
export * from './grocery';
export * from './razorpay';
export * from './user';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Anything =
  | string
  | number
  | boolean
  | Date
  | JsonObject
  | Anything[]
  | (() => Anything);

export interface JsonObject {
  [key: string]: Anything;
}
