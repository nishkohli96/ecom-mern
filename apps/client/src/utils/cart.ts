import { CartProduct, GroceryItem } from '@ecom-mern/shared';

/* Sum of quantities of all products in cart */
export function getTotalCartProducts(exisitingCart: CartProduct[]): number {
  return exisitingCart.reduce(
    (sum: number, prod: CartProduct) => sum + prod.quantity,
    0
  );
}

/* Sum of prices of all cart products times their quantity */
export function getCartTotal(
  products: GroceryItem[],
  inventory: CartProduct[]
): string {
  let cartTotal = 0;
  products.map((prod, idx) => {
    cartTotal += prod.discount_price * inventory[idx].quantity;
  });
  return cartTotal.toFixed(2);
}

export function addProductToCart(
  exisitingCart: CartProduct[],
  newProduct: CartProduct,
  isUpdate?: boolean
): CartProduct[] {
  let newCart = exisitingCart;
  const isAlreadyAdded = newCart.find(
    (prod) => prod.product_id === newProduct.product_id
  );

  if (!isAlreadyAdded) {
    newCart = [newProduct, ...newCart];
    return newCart;
  }
  newCart = newCart.map((prod) => {
    if (prod.product_id === newProduct.product_id) {
      prod = {
        ...prod,
        quantity: isUpdate
          ? prod.quantity
          : prod.quantity + newProduct.quantity,
      };
    }
    return prod;
  });
  return newCart;
}

export function removeProductFromCart(
  exisitingCart: CartProduct[],
  productId: string
): CartProduct[] {
  let newCart = exisitingCart;
  return newCart.filter((prod) => prod.product_id !== productId);
}
