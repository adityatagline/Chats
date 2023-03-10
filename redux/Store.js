import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AuthenticationSlice from './authentication/AuthenticationSlice';
import ChatSlice from './chats/ChatSlice';
import LoadingSlice from './loading/LoadingSlice';
import ThemeSlice from './theme/ThemeSlice';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDefaultMiddleware} from '@reduxjs/toolkit';

const persistThemeSlice = persistReducer(
  {
    key: 'themeSlice',
    storage: AsyncStorage,
  },
  ThemeSlice,
);
const persistAuthenticationSlice = persistReducer(
  {
    key: 'authenticationSlice',
    storage: AsyncStorage,
  },
  AuthenticationSlice,
);
const persistChatSlice = persistReducer(
  {
    key: 'chatSlice',
    storage: AsyncStorage,
  },
  ChatSlice,
);

// const rootReducer = combineReducers({
//   themeSlice: persistThemeSlice,
//   authenticationSlice: persistAuthenticationSlice,
//   loadingSlice: LoadingSlice,
//   chatSlice: persistChatSlice,
// });

const Store = configureStore({
  reducer: {
    themeSlice: persistThemeSlice,
    authenticationSlice: persistAuthenticationSlice,
    loadingSlice: LoadingSlice,
    chatSlice: persistChatSlice,
    // rootReducer,
  },
  middleware: [thunk],
});

export default Store;

export const PersistStore = persistStore(Store);
