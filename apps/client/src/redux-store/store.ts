import { configureStore, combineReducers, Store } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { settingsSlice, toastSlice, userSlice } from './reducers';
import {
  authApi,
  cartApi,
  checkoutApi,
  geoApi,
  groceryApi,
  ordersApi,
  userApi,
} from './services';

const persistConfig = {
  key: 'root',
  storage,
};

const configReducer = combineReducers({
  settings: settingsSlice.reducer,
  toast: toastSlice.reducer,
  user: userSlice.reducer,
});

const appConfigReducer = persistReducer(persistConfig, configReducer);

export const store = configureStore({
  reducer: {
    appData: appConfigReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [geoApi.reducerPath]: geoApi.reducer,
    [groceryApi.reducerPath]: groceryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      cartApi.middleware,
      checkoutApi.middleware,
      geoApi.middleware,
      groceryApi.middleware,
      ordersApi.middleware,
      userApi.middleware,
    ]),
});

/*
 * optional, but required for refetchOnFocus/refetchOnReconnect
 * behaviors see `setupListeners` docs - takes an optional
 * callback as the 2nd arg for customization
 */
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
