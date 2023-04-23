import {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {AppStatusBar} from '../components/AppStatusBar';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import ScreenNames from '../strings/ScreenNames';
import {fontSize, StatusBarHeight} from '../styles/commonStyles';
import HomeScreen from './screens/home/HomeScreen';
import Settings from './screens/settings/Settings';

export const TopTabNavigator = () => {
  const TopTab = createMaterialTopTabNavigator();
  const themeRef = useTheme();
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
      top: hp(1) + StatusBarHeight,
      fontFamily: FontfamiliesNames.primaryFontBold,
      left: wp(0),
      paddingLeft: wp(10),
      paddingBottom: hp(2),
      color: themeRef.colors.appThemeColor,
      backgroundColor: themeRef.colors.primaryColor,
      width: wp(60),
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
            bottom: hp(2.5),
            width: wp(60),
            elevation: 0,
            shadowOpacity: 0.4,
            shadowColor: themeRef.colors.appThemeColor,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowRadius: 5,
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
            height: '80%',
            borderRadius: 40,
            top: '10%',
            width: wp(25),
            marginHorizontal: wp(2.5),
          },
          tabBarActiveTintColor: themeRef.colors.appThemeColor,
          tabBarInactiveTintColor: themeRef.colors.primaryColor,
          tabBarPressColor: 'transparent',
        }}>
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.HomeScreen}
          component={Home}
          options={{
            tabBarIcon: ({focused, color}) => {
              return <IoniconsIcon name={'home'} size={25} color={color} />;
            },
          }}
        />
        {/* <TopTab.Screen
          name={ScreenNames.TopTabScreens.StatusScreen}
          component={Status}
          options={{
            tabBarIcon: ({focused, color}) => (
              <EntypoIcon name={'circular-graph'} size={24} color={color} />
            ),
          }}
        /> */}
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.ProfileScreen}
          component={Profile}
          options={{
            tabBarIcon: ({focused, color}) => (
              <FontAwesomeIcon
                name={'user'}
                size={25}
                color={color}
                style={{marginLeft: wp(1)}}
              />
            ),
          }}
        />
      </TopTab.Navigator>
      {!!currentScreen && (
        <Text style={[styles.ChatsHeading]}>{currentScreen}</Text>
      )}
      <AppStatusBar dark={!!themeRef.dark} />
    </>
  );
};
