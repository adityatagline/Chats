import {View, StyleSheet, ScrollView} from 'react-native';
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
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {commonSettingsStyles} from './AppearenceSettings';

export default PrivacySettings = () => {
  const themeRef = useTheme();

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
        />
        <SettingItem title={'Status settings'} itemIcon={'eye'} />

        <PageHeading
          middleComponenet={
            <PageName name={'Security'} customStyle={{marginTop: hp(4)}} />
          }
          disableBackButton
        />

        <SettingItem title={'Change password'} itemIcon={'sync'} />
        <SettingItem title={'Change Phone number'} itemIcon={'sync'} />
      </ScrollView>
    </View>
  );
};
