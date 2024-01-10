import { Schema, model } from 'mongoose';
import { slugifyGroceryName } from 'utils';

const GrocerySchema = new Schema(
  {
    product_name: { type: String, required: true, index: true, unique: true },
    sku: { type: Number, required: true, unique: true },
    handle: { type: String, required: true },
    brand: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [1, 'Minimum value should be 1, got {VALUE}'],
    },
    discount_price: {
      type: Number,
      required: true,
      min: 1,
    },
    image_url: { type: String, required: true },
    quantity: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String, default: null },
    inStock: { type: Number, default: 20 },
  },
  {
    timestamps: true,
  }
);

/* index -1 -> descending, 1 -> ascending order for that field */
GrocerySchema.index({ brand: -1, sku: 1 });

GrocerySchema.pre('save', function (next) {
  this.discount_price = this.get('discount_price') ?? this.get('price');
  if (this.discount_price > this.price) {
    throw new Error('Discount_price should not be greater than price');
  }
  this.handle = slugifyGroceryName(this.product_name);
  next();
});

/**
 * Declare methods on schema before modelling.
 *
 * GrocerySchema.methods.testFn = function testFn() {}
 */

const GroceryModel = model('grocery', GrocerySchema);

GroceryModel.schema.path('discount_price').validate(function (value) {
  return value <= this.get('price');
}, 'Discount_price should not be greater than price');

export default GroceryModel;
