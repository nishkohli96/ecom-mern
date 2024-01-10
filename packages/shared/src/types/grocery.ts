export interface GroceryItem {
  _id: string;
  product_name: string;
  sku: number;
  handle: string;
  brand: string;
  price: number;
  discount_price: number;
  image_url: string;
  quantity: string;
  category: string;
  sub_category: string;
  inStock: number;
}

export interface CartProductData extends GroceryItem {
  num_products: number;
}

export interface CategoryValue {
  name: string;
  num_products: number;
}

export interface GroceryCategory extends CategoryValue {
  sub_categories: CategoryValue[];
}

export interface GroceryCategorization {
  brands: CategoryValue[];
  categories: GroceryCategory[];
}

export interface GroceryInventory {
  product_id: string;
  quantity_selected: number;
}

export interface CartData {
  cart_id: string;
  user_id: string;
  products: CartProductData[];
}
