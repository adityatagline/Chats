import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {toggleTheme} from '../../redux/theme/ThemeSlice';
import ScreenNames from '../strings/ScreenNames';
import LoginScreen from './screens/authentication/LoginScreen';
import Onboarding from './screens/onboarding/Onboarding';
import {colorStrings} from '../strings/ColorStrings';
import SignupScreen from './screens/authentication/SignupScreen';
import VerificationScreen from './screens/authentication/VerificationScreen';
import EnterDetails from './screens/authentication/EnterDetails';
import {useSelector} from 'react-redux';
import HomeScreen from './screens/home/HomeScreen';
import {TopTabNavigator} from './TopTabNavigator';
import {StyleSheet, View} from 'react-native';
import {commonStyles} from '../styles/commonStyles';
import LoadingPage from '../components/LoadingPage';
import NewChatPage from './screens/NewChatPage';
import AppearenceSettings from './screens/settings/AppearenceSettings';
import BackupNRestore from './screens/settings/BackupNRestore';
import PrivacySettings from './screens/settings/PrivacySettings';

export default StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const themeRef = useSelector(state => state.themeSlice);
  const authRef = useSelector(state => state.authenticationSlice);

  const theme = {
    colors:
      themeRef == 'light'
        ? {...colorStrings.lightThemeColors}
        : {...colorStrings.darkThemeColors},
    dark: themeRef == 'dark',
  };

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

  return (
    <NavigationContainer theme={theme}>
      {!authRef.isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};
