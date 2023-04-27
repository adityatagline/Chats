import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import ScreenNames from '../strings/ScreenNames';
import LoginScreen from './screens/authentication/LoginScreen';
import Onboarding from './screens/onboarding/Onboarding';
import {colorStrings} from '../strings/ColorStrings';
import SignupScreen from './screens/authentication/SignupScreen';
import VerificationScreen from './screens/authentication/VerificationScreen';
import EnterDetails from './screens/authentication/EnterDetails';
import {useDispatch, useSelector} from 'react-redux';
import {TopTabNavigator} from './TopTabNavigator';
import NewChatPage from './screens/NewChatPage';
import AppearenceSettings from './screens/settings/AppearenceSettings';
import BackupNRestore from './screens/settings/BackupNRestore';
import PrivacySettings from './screens/settings/PrivacySettings';
import ChatScreen from './screens/chat/ChatScreen';
import ProfileSettings from './screens/settings/ProfileSettings';
import {clearAllChats} from '../../redux/chats/ChatSlice';
import GroupChatScreen from './screens/chat/GroupChatScreen';
import ChatInfoScreen from './screens/chat/ChatInfoScreen';
import GroupChatInfoScreen from './screens/chat/GroupChatInfoScreen';
import EditGroupScreen from './screens/chat/EditGroupScreen';
import ForgotPasswordScreen from './screens/authentication/ForgotPasswordScreen';
import BlockedContacts from './screens/settings/BlockedContacts';

export default StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const themeRef = useSelector(state => state.themeSlice);
  const authRef = useSelector(state => state.authenticationSlice);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState({
    colors: {...colorStrings.lightThemeColors},
    dark: false,
  });

  useEffect(() => {
    if (!!themeRef.themeMode) {
      setTheme({
        colors:
          themeRef.themeMode == 'light'
            ? {...colorStrings.lightThemeColors}
            : {...colorStrings.darkThemeColors},
        dark: themeRef.themeMode == 'dark',
      });
    }
  }, [themeRef]);

  useEffect(() => {
    if (!authRef.isAuthenticated) {
      dispatch(clearAllChats());
    }
  }, [authRef]);

  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={ScreenNames.LoginScreen}>
      <Stack.Screen
        name={ScreenNames.VerificationScreen}
        component={VerificationScreen}
      />
      <Stack.Screen name={ScreenNames.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={ScreenNames.EnterDetails} component={EnterDetails} />
      <Stack.Screen name={ScreenNames.SignupScreen} component={SignupScreen} />
      <Stack.Screen
        name={ScreenNames.ForgotPasswordScreen}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name={ScreenNames.Onboading} component={Onboarding} />
    </Stack.Navigator>
  );

  const MainStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={ScreenNames.TopTabNavigator}
        component={TopTabNavigator}
      />
      <Stack.Screen name={ScreenNames.NewChatPage} component={NewChatPage} />
      <Stack.Screen name={ScreenNames.ChatPage} component={ChatScreen} />
      <Stack.Screen
        name={ScreenNames.GroupChatPage}
        component={GroupChatScreen}
      />
      <Stack.Screen
        name={ScreenNames.ChatInfoScreen}
        component={ChatInfoScreen}
      />
      <Stack.Screen
        name={ScreenNames.GroupChatInfoScreen}
        component={GroupChatInfoScreen}
      />
      <Stack.Screen
        name={ScreenNames.EditGroupScreen}
        component={EditGroupScreen}
      />

      <Stack.Screen
        name={ScreenNames.TopTabInnerScreens.ProfileSettings}
        component={ProfileSettings}
      />
      <Stack.Screen
        name={ScreenNames.TopTabInnerScreens.Appearence}
        component={AppearenceSettings}
      />
      <Stack.Screen
        name={ScreenNames.TopTabInnerScreens.BackupNRestore}
        component={BackupNRestore}
      />
      <Stack.Screen
        name={ScreenNames.TopTabInnerScreens.PrivacyNSecurity}
        component={PrivacySettings}
      />
      <Stack.Screen
        name={ScreenNames.TopTabInnerScreens.BlockedContacts}
        component={BlockedContacts}
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer
      theme={
        !!theme
          ? theme
          : {colors: {...colorStrings.lightThemeColors}, dark: false}
      }>
      {!authRef.isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};
