import { useAppSelector, UserSelector } from 'redux-store';

export const useCheckUserLogin = (): boolean => {
  const userInfo = useAppSelector(UserSelector);
  return Boolean(userInfo);
};
