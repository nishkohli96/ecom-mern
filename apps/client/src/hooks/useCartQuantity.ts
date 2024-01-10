import {
  useAppSelector,
  UserSelector,
  UserCartSelector,
  GuestCartSelector,
} from 'redux-store';
import { getTotalCartProducts } from 'utils';

export const useCartQuantity = (): number => {
  const user = useAppSelector(UserSelector);
  const userCart = useAppSelector(user ? UserCartSelector : GuestCartSelector);
  const num_cart_items = getTotalCartProducts(userCart.products);
  return num_cart_items;
};
