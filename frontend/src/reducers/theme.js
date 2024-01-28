import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      console.log('mode', state.mode);
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
