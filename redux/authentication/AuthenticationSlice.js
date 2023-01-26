import {createSlice} from '@reduxjs/toolkit';

const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isAuthenticated: true,
    checkForDetails: false,
    user: {},
  },
  reducers: {
    login: (state, action) => {
      return {
        isAuthenticated: true,
        checkForDetails: true,
        user: {
          ...action.payload.userDetails,
        },
      };
    },
    logout: (state, action) => {
      return {
        isAuthenticated: false,
        checkForDetails: true,
        user: {},
      };
    },
    changeUserDetails: (state, action) => {
      return {
        ...state,
        user: {
          ...action.payload.userDetails,
        },
      };
    },
  },
});

export const {login, logout, changeUserDetails} = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
