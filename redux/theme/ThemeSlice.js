import {createSlice} from '@reduxjs/toolkit';

const ThemeSlice = createSlice({
  name: 'theme',
  initialState: 'light',
  reducers: {
    toggleTheme: (state, action) => {
      return action.payload;
    },
  },
});

export const {toggleTheme} = ThemeSlice.actions;
export default ThemeSlice.reducer;
