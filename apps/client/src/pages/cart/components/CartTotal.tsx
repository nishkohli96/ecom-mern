import { GroceryItem, CartProduct } from '@ecom/mern-shared';
import { PurchaseSummary } from 'shared';
import RouteList from 'routes/route-list';
import { getCartTotal } from 'utils';
import { useCartQuantity } from 'hooks';

interface CartTotalProps {
  productsInfo: GroceryItem[];
  cartData: CartProduct[];
}

const CartTotal = ({ productsInfo, cartData }: CartTotalProps) => {
  const cartTotal = getCartTotal(productsInfo, cartData);
  const numItems = useCartQuantity();

  return (
    <PurchaseSummary
      cartTotal={cartTotal}
      numItems={numItems}
      nextBtnText="Proceed To Buy"
      nextBtnNavigateTo={RouteList.checkout.rootPath}
      navigateData={{ cartTotal, numItems, fromCart: true }}
    />
  );
};

export default CartTotal;
