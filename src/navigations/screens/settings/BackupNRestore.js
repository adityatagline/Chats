import {ScrollView, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import {commonSettingsStyles} from './AppearenceSettings';
import {commonStyles} from '../../../styles/commonStyles';

export default BackupNRestore = () => {
  const themeRef = useTheme();

  return (
    <View style={commonStyles.topSpacer}>
      <PageHeading
        middleComponenet={<PageName name={'Backup'} />}
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
          title={'Backup to cloud'}
          itemIcon={'cloud-upload-outline'}
        />
        <SettingItem
          title={'Backup to local storage'}
          itemIcon={'log-in-outline'}
        />
      </ScrollView>
      <PageHeading
        middleComponenet={
          <PageName name={'Restore'} customStyle={{marginTop: hp(4)}} />
        }
        disableBackButton
      />
      <ScrollView style={commonSettingsStyles.listDiv} bounces={false}>
        <SettingItem
          title={'Restore from cloud'}
          itemIcon={'cloud-download-outline'}
        />
        <SettingItem
          title={'Restore from local storage'}
          itemIcon={'folder-open-outline'}
        />
      </ScrollView>
    </View>
  );
};
