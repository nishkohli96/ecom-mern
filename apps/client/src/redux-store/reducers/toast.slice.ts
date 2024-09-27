import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux-store';
import { AlertColor } from '@mui/material/Alert';

interface ToastIntitialState {
  open: boolean;
  status: AlertColor;
  message: string;
}

const initialState: ToastIntitialState = {
  open: false,
  status: 'success',
  message: '',
};

export const toastSlice = createSlice({
  name: 'toastSlice',
  initialState,
  reducers: {
    openToast: state => {
      state.open = true;
    },
    closeToast: state => {
      state.open = false;
    },
    setToastStatus: (state, action: PayloadAction<AlertColor>) => {
      state.status = action.payload;
    },
    setToastMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

/* Actions */
export const { openToast, closeToast, setToastStatus, setToastMessage }
  = toastSlice.actions;

/* Selectors */
export const ToastSelector = (state: RootState) => state.appData.toast;
