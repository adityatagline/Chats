import {
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeModules,
  Appearance,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {fontSize, StatusBarHeight} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import {useDispatch} from 'react-redux';
import {toggleTheme} from '../../../../redux/theme/ThemeSlice';
import CommonStyle from './CommonStyle';

export default AppearenceSettings = () => {
  const themeRef = useTheme();
  const dispath = useDispatch();

  const changeTheme = () => {
    // console.log('running');
    dispath(toggleTheme({themeMode: themeRef.dark ? 'light' : 'dark'}));
  };

  const styles = StyleSheet.create({
    mainDiv: {
      marginTop: StatusBarHeight,
    },
    pageHeading: {
      // backgroundColor: "yellow",
      // flex: 1,
      // textAlign: "center",
      marginLeft: wp(10),
      fontSize: fontSize.heading,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.appThemeColor,
    },
    settingItem: {
      // backgroundColor: "yellow",
      flexDirection: 'row',
      marginVertical: hp(1),
      paddingVertical: hp(1),
      borderRadius: 15,
      paddingHorizontal: wp(8),
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: wp(5),
    },
    settingItemLabel: {
      // fontWeight: "bold",
      fontSize: fontSize.large,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
    },
    listDiv: {
      marginTop: hp(2),
    },
  });

  return (
    <View style={[styles.mainDiv]}>
      <PageHeading
        middleComponenet={<PageName name={'Appearence'} />}
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.secondaryColor,
          backScreen: 'Settings',
        }}
        backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
      />
      <ScrollView style={styles.listDiv}>
        <SettingItem
          title={'Theme'}
          itemIcon={'contrast'}
          onPress={changeTheme}
        />
        <SettingItem title={'Wallpaper'} itemIcon={'image-outline'} />
      </ScrollView>
    </View>
  );
};
