import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux-store';
import { PaletteMode } from '@mui/material';
import { ThemeMode } from 'shared/types';

interface SettingsConfig {
  mode: PaletteMode;
}

const initialState: SettingsConfig = {
  mode: ThemeMode.DARK,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode =
        state.mode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    },
  },
});

/* Actions */
export const { toggleTheme } = settingsSlice.actions;

/* Selectors */
export const ThemeSelector = (state: RootState) => state.appData.settings.mode;
