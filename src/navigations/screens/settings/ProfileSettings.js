import {StyleSheet, ScrollView, View, Image} from 'react-native';
import React from 'react';
import {fontSize, StatusBarHeight} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {useNavigation, useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import {useDispatch, useSelector} from 'react-redux';
import InputBox from '../../../components/InputBox';
import IconButton from '../../../components/IconButton';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';

export default ProfileSettings = () => {
  const themeRef = useTheme();
  const dispath = useDispatch();
  const user = useSelector(state => state.authenticationSlice).user;
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    mainDiv: {
      marginTop: StatusBarHeight,
    },
    pageHeading: {
      marginLeft: wp(10),
      fontSize: fontSize.heading,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.appThemeColor,
    },
    settingItem: {
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
        middleComponenet={<PageName name={'Edit Profile'} />}
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.secondaryColor,
          backScreen: 'Settings',
        }}
        backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
      />
      <ScrollView style={styles.listDiv} bounces={false}>
        <View
          style={{
            marginVertical: hp(2),
          }}>
          <Image
            source={require('../../../images/banana.png')}
            style={{
              height: hp(12),
              width: hp(12),
              borderRadius: 45,
              alignSelf: 'center',
            }}
          />
          <IconButton
            name="pencil"
            size={20}
            color={themeRef.colors.primaryColor}
            containerStyle={{
              backgroundColor: themeRef.colors.appThemeColor,
              height: hp(4),
              width: hp(4),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              position: 'absolute',
              bottom: hp(0),
              marginLeft: wp(55),
            }}
          />
        </View>
        <InputBox
          label={'First Name'}
          value={user.firstName}
          focused={!!'touched.phone'}
          focusFunction={() => {}}
          otherProps={{}}
        />
        <InputBox label={'Last Name'} value={user.lastName} />
        <InputBox label={'Email id'} value={user.email} />
        <InputBox label={'Phone Number'} value={user.phone} />
        <SimpleButton
          title={'Update Profile'}
          containerStyle={{
            marginVertical: hp(3),
          }}
        />
        <TextButton
          title={'cancel'}
          textStyle={{
            fontSize: fontSize.large,
            textTransform: 'capitalize',
            color: themeRef.colors.errorColor,
          }}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
};
