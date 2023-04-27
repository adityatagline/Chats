import MainNavigator from './src/navigations/MainNavigator';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging"
import { sendmsg } from './api/notification/NotificationReq';
import notifee, { EventType } from "@notifee/react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

  const configureForNotifications =async ()=>{
    const channelId = await notifee.createChannel({
      id: 'Chats',
      name: 'Chats',
    });
    console.log("running")
  

    // Create a channel (required for Android)

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // await notifee.displayNotification({
      //   android:{
      //     channelId:"Chats"
      //   },
      //   body:remoteMessage.notification?.body,
      //   data:remoteMessage.data,
      //   // subtitle:remoteMessage.s
      // })
    }); 

    messaging().onNotificationOpenedApp(async remoteMessage=>{
      console.log("oppened")
    })

    
    const token =await messaging().getToken();
    console.log({token})
    const storeToken = await AsyncStorage.setItem("chatsToken",token)
    
  }

  useEffect(() => {
    SplashScreen.hide();
    
    configureForNotifications()
    // notifee.onBackgroundEvent(async events=>{
    //   console.log({onBackgroundEvent:events})
    // })
    
  
   
   
  }, [])
  
  return <MainNavigator />;
};

export default App 
