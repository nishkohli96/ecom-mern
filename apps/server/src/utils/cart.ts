import { CartProduct } from '@ecom-mern/shared';
import { Grocery } from '@/routes/grocery/types';

/**
 * Mongo search was returning records on random order, hence
 * this sorting function, to send data in ordered format
 **/
export function rearrangeCartProducts(
  cartProducts: Grocery[],
  objectIds: string[]
): Grocery[] {
  const orderedCartProducts: Grocery[] = [];
  cartProducts.forEach((prod) => {
    const index = objectIds.indexOf(prod._id.toString());
    orderedCartProducts[index] = prod;
  });
  return orderedCartProducts;
}

export function addProductToCart(
  exisitingCart: CartProduct[],
  newProduct: CartProduct
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
        quantity: isAlreadyAdded
          ? prod.quantity + newProduct.quantity
          : prod.quantity
      };
    }
    return prod;
  });
  return newCart;
}

export function removeProductFromCart(
  exisitingCart: CartProduct[],
  productToRemoveOrUpdate: CartProduct
): CartProduct[] {
  let newCart = exisitingCart;
  newCart = newCart.map((prod) => {
    if (prod.product_id === productToRemoveOrUpdate.product_id) {
      const shouldRemove = prod.quantity === productToRemoveOrUpdate.quantity;
      prod = {
        ...prod,
        quantity: shouldRemove ? 0 : productToRemoveOrUpdate.quantity
      };
    }
    return prod;
  });
  return newCart.filter((cartItem) => cartItem.quantity !== 0);
}
