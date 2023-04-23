import {StyleSheet, ScrollView, View} from 'react-native';
import React from 'react';
import {commonStyles} from '../../../styles/commonStyles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import {useDispatch} from 'react-redux';
import {toggleTheme} from '../../../../redux/theme/ThemeSlice';
import ScreenNames from '../../../strings/ScreenNames';

export default AppearenceSettings = () => {
  const themeRef = useTheme();
  const dispath = useDispatch();

  const changeTheme = () => {
    dispath(toggleTheme({themeMode: themeRef.dark ? 'light' : 'dark'}));
  };

  return (
    <View style={[commonStyles.topSpacer]}>
      <PageHeading
        middleComponenet={<PageName name={'Appearence'} />}
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.secondaryColor,
          backScreen: ScreenNames.TopTabScreens.ProfileScreen,
        }}
        backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
      />
      <ScrollView style={commonSettingsStyles.listDiv}>
        <SettingItem
          title={`Apply ${themeRef.dark ? 'light' : 'dark'} theme`}
          itemIcon={'contrast'}
          onPress={changeTheme}
        />
        {/* <SettingItem title={'Wallpaper'} itemIcon={'image-outline'} /> */}
      </ScrollView>
    </View>
  );
};

export const commonSettingsStyles = StyleSheet.create({
  listDiv: {
    marginTop: hp(2),
  },
});
