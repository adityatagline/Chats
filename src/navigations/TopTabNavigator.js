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
  // const newCode = useNavigationState(state => {
  //   console.log({state});
  //   return state.routes.length;
  // });

  // .routes[0].state;
  // setCurrentScreen(getStateObjStates.routeNames[getStateObjStates.index]);

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
            backgroundColor: themeRef.colors.primaryColor,
            position: 'absolute',
            top: StatusBarHeight,
            right: wp(10),
            width: wp(30),
            height: hp(6),
            elevation: 0,
            shadowOpacity: 0,
            // display: 'none',
            // backgroundColor: 'yellow',
          },
          tabBarLabelStyle: {
            // color:themeRef.colors.primaryColor
            display: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: themeRef.colors.appThemeColor,
            borderRadius: 500,
            width: wp(2),
            height: hp(1),
            position: 'absolute',
            left: wp(5.7),
            display: 'none',
          },
          tabBarActiveTintColor: themeRef.colors.appThemeColor,
          tabBarInactiveTintColor: themeRef.colors.card,
          tabBarPressColor: 'transparent',
          // headerShown: true,
        }}>
        <TopTab.Screen
          name={ScreenNames.TopTabScreens.HomeScreen}
          component={Home}
          options={{
            tabBarIcon: ({focused, color}) => {
              console.log({focused});
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
