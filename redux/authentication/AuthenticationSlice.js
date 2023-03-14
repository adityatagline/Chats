import {createSlice} from '@reduxjs/toolkit';
import {getUsernameFromEmail} from '../../src/components/CommonFunctions';

const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isAuthenticated: true,
    // isAuthenticated: false,
    checkForDetails: false,
    user: {
      age: '21',
      email: 'adityat.tagline@gmail.com',
      emailVerified: true,
      firstName: 'Aditya',
      isNewUser: false,
      lastName: 'Thummar',
      username: 'adityat-tagline--gmail-com',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
    // user: {},
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

export const {storeUserDataInRedux, logout, changeUserDetails} =
  AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
