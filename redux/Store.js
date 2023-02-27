import {configureStore} from '@reduxjs/toolkit';
import AuthenticationSlice from './authentication/AuthenticationSlice';
import ChatSlice from './chats/ChatSlice';
import LoadingSlice from './loading/LoadingSlice';
import ThemeSlice from './theme/ThemeSlice';

export default configureStore({
  reducer: {
    themeSlice: ThemeSlice,
    authenticationSlice: AuthenticationSlice,
    loadingSlice: LoadingSlice,
    chatSlice: ChatSlice,
  },
});
