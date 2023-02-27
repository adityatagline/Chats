import MainNavigator from './src/navigations/MainNavigator';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';
import { Platform } from "react-native";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  return <MainNavigator />;
};

export default App 
