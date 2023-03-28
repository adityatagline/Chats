import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  useNavigation,
  useNavigationState,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {AppStatusBar} from '../components/AppStatusBar';
import IconButton from '../components/IconButton';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import ScreenNames from '../strings/ScreenNames';
import {commonStyles, fontSize, StatusBarHeight} from '../styles/commonStyles';
import HomeScreen from './screens/home/HomeScreen';
import ProfileModal from './screens/profileModal/ProfileModal';
import {Text, Image, StyleSheet} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {imageUrlStrings} from '../strings/ImageUrlStrings';
import Settings from './screens/settings/Settings';
import {useCallback, useEffect, useState} from 'react';

export const TopTabNavigator = () => {
  const TopTab = createMaterialTopTabNavigator();
  const themeRef = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [currentScreen, setCurrentScreen] = useState('');

  const styles = StyleSheet.create({
    infoButton: {
      position: 'absolute',
      left: wp(35),
      top: hp(5.5),
    },
    ChatsHeading: {
      fontSize: fontSize.heading + 5,
      position: 'absolute',
      top: hp(0.5) + StatusBarHeight,
      fontFamily: FontfamiliesNames.primaryFontBold,
      left: wp(10),
      color: themeRef.colors.appThemeColor,
    },
    tabIcon: {
      height: hp(3.5),
      width: hp(3.5),
    },
  });

  const Home = () => <HomeScreen setterFunction={setCurrentScreen} />;
  const Status = () => <HomeScreen setterFunction={setCurrentScreen} />;
  const Profile = () => <Settings setterFunction={setCurrentScreen} />;

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: themeRef.colors.appThemeColor,
            position: 'absolute',
            bottom: hp(1),
            width: wp(90),
            height: hp(9),
            elevation: 0,
            shadowOpacity: 0.5,
            shadowColor: themeRef.colors.appThemeColor,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowRadius: 7,
            borderRadius: 40,
            alignSelf: 'center',
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontFamily: FontfamiliesNames.primaryFontSemiBold,
            fontSize: fontSize.extrasmall,
          },
          tabBarIndicatorStyle: {
            backgroundColor: themeRef.colors.primaryColor,
            height: hp(7),
            borderRadius: 40,
            top: hp(1),
            width: wp(25),
            marginHorizontal: wp(2.5),
          },
          tabBarActiveTintColor: themeRef.colors.appThemeColor,
          tabBarInactiveTintColor: themeRef.colors.primaryColor,
          tabBarPressColor: 'transparent',
          // headerShown: true,
        }}>
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.HomeScreen}
          component={Home}
          options={{
            tabBarIcon: ({focused, color}) => {
              // console.log({focused});
              return <IoniconsIcon name={'home'} size={25} color={color} />;
            },
          }}
        />
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.StatusScreen}
          component={Status}
          options={{
            tabBarIcon: ({focused, color}) => (
              <EntypoIcon name={'circular-graph'} size={24} color={color} />
            ),
          }}
        />
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.ProfileScreen}
          component={Profile}
          options={{
            tabBarIcon: ({focused, color}) => (
              <FontAwesomeIcon name={'user'} size={25} color={color} />
            ),
          }}
        />
      </TopTab.Navigator>
      {!!currentScreen && (
        <Text style={[styles.ChatsHeading]}>{currentScreen}</Text>
      )}
      {/* <ProfileModal /> */}
      <AppStatusBar dark={!!themeRef.dark} />
    </>
  );
};
