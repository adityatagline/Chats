import {configureStore} from '@reduxjs/toolkit';
import AuthenticationSlice from './authentication/AuthenticationSlice';
import ThemeSlice from './theme/ThemeSlice';

export default configureStore({
  reducer: {
    themeSlice: ThemeSlice,
    authenticationSlice: AuthenticationSlice,
  },
});
