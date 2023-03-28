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
import {setLoadingState} from '../../redux/loading/LoadingSlice';
import {toggleTheme} from '../../redux/theme/ThemeSlice';
import ChatScreen from './screens/chat/ChatScreen';
import ProfileSettings from './screens/settings/ProfileSettings';

export default StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const themeRef = useSelector(state => state.themeSlice);
  const loadingRef = useSelector(state => state.loadingSlice);
  const authRef = useSelector(state => state.authenticationSlice);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState({
    colors: {...colorStrings.lightThemeColors},
    dark: false,
  });

  useEffect(() => {
    if (!!themeRef.themeMode) {
      // setLoadingState(pre => {
      //   return {
      //     ...pre,
      //     loading: false,
      //   };
      // });
      // console.log({themeRef});
      setTheme({
        colors:
          themeRef.themeMode == 'light'
            ? {...colorStrings.lightThemeColors}
            : {...colorStrings.darkThemeColors},
        dark: themeRef.themeMode == 'dark',
      });
    }
  }, [themeRef]);

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
    </Stack.Navigator>
  );

  // if (loadingRef.loading && !theme) {
  //   return <Text>loading</Text>;
  // } else if (!!theme) {
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
  // }
};
