import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeModules,
  Appearance,
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

export default BackupNRestore = () => {
  const styles = StyleSheet.create({
    mainDiv: {
      marginTop: StatusBarHeight,
    },
    pageHeading: {
      // backgroundColor: "yellow",
      // flex: 1,
      // textAlign: "center",
      marginLeft: '10%',
      fontSize: 25,
      fontWeight: 'bold',
    },
    settingItem: {
      // backgroundColor: "yellow",
      flexDirection: 'row',
      marginVertical: '1%',
      paddingVertical: '4%',
      marginHorizontal: '1%',
      borderRadius: 15,
      paddingHorizontal: '7%',
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: '5%',
    },
    settingItemLabel: {
      // fontWeight: "bold",
    },
    listDiv: {
      marginTop: '5%',
    },
  });

  return (
    <View style={styles.mainDiv}>
      <PageHeading
        middleComponenet={<PageName name={'Backup'} />}
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: 'black',
          backScreen: 'Settings',
        }}
        backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
      />
      <ScrollView style={styles.listDiv}>
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
      <ScrollView style={styles.listDiv}>
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
