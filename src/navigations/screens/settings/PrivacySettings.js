import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  commonStyles,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {useNavigation, useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {commonSettingsStyles} from './AppearenceSettings';
import {changePassword} from '../../../../api/authentication/AuthenticationRequests';
import {useSelector} from 'react-redux';

export default PrivacySettings = () => {
  const themeRef = useTheme();
  const navigation = useNavigation();
  const currentUser = useSelector(state => state.authenticationSlice).user;

  const shoeResetConfirm = () => {
    Alert.alert('Are you sure ?', 'Want to reset password. ?', [
      {text: 'Yes,confirm', onPress: resetPassword, style: 'destructive'},
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const resetPassword = async () => {
    const response = await changePassword(currentUser.email);
    console.log({resetREs: response});
    if (!!response.isError) {
      console.log({ErrorInReset: response});
      return;
    }
    Alert.alert(
      'Success',
      `Password reset link is sent to you email address :\n${currentUser.email}`,
    );
  };

  return (
    <View style={commonStyles.topSpacer}>
      <PageHeading
        middleComponenet={<PageName name={'Privacy'} />}
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.secondaryColor,
          backScreen: 'Settings',
        }}
        backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
      />
      <ScrollView style={commonSettingsStyles.listDiv} bounces={false}>
        <SettingItem
          title={'Blocked Contacts'}
          itemIcon={'remove-circle-outline'}
          onPress={() =>
            navigation.navigate(ScreenNames.TopTabInnerScreens.BlockedContacts)
          }
        />
        {/* <SettingItem title={'Status settings'} itemIcon={'eye'} /> */}

        <PageHeading
          middleComponenet={
            <PageName
              name={'Security'}
              customStyle={{marginTop: hp(4), marginVertical: hp(2)}}
            />
          }
          disableBackButton
        />

        <SettingItem
          onPress={shoeResetConfirm}
          title={'Change password'}
          itemIcon={'sync'}
        />
        {/* <SettingItem title={'Change Phone number'} itemIcon={'sync'} /> */}
      </ScrollView>
    </View>
  );
};
