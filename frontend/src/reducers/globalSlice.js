// globalSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    mode: 'light',
  },
  reducers: {
    toggleDarkMode: (state) => {
      console.log('mode', state.mode);
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleDarkMode } = globalSlice.actions;
export default globalSlice.reducer;
