import {createSlice} from '@reduxjs/toolkit';
import {getUsernameFromEmail} from '../../src/components/CommonFunctions';

const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isAuthenticated: false,
    checkForDetails: false,
    user: {},
  },
  reducers: {
    storeUserDataInRedux: (state, action) => {
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
        checkForDetails: false,
        user: {},
      };
    },
    changeUserDetails: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.userDetails,
        },
      };
    },
  },
});

export const {storeUserDataInRedux, logout, changeUserDetails} =
  AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
