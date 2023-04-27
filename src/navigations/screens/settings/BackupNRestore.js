import {Alert, ScrollView, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import {commonSettingsStyles} from './AppearenceSettings';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import {useState} from 'react';
import {BaseLoader} from '../../../components/LoadingPage';
import BaseText from '../../../components/BaseText';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getAllBackups, updateBackup} from '../../../../api/chat/ChatRequests';
import {FlatList} from 'react-native';
import BackUpComponent from '../../../components/BackUpComponent';

export default BackupNRestore = () => {
  const themeRef = useTheme();
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const chatSliceRef = useSelector(state => state.chatSlice);
  const [isLoading, setIsLoading] = useState('getting');
  const [backups, setBackups] = useState();

  const getInitialData = async () => {
    setIsLoading('getting');
    const response = await getAllBackups(currentUser.username);
    console.log({backup: response});
    if (!!response.isError) {
      setIsLoading('');
      return;
    }
    setBackups(response.data);
    let backupArr = [];
    for (const date in response.data) {
      let backup = response.data[date];
      backupArr.push({backUp, date});
    }
    backupArr.sort((a, b) => new Date(b.date) - new Date(a.date));
    setBackups(backupArr);
    setIsLoading('');
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const backUp = async () => {
    setIsLoading('Checking chats');
    setIsLoading('Uploading chats');
    const response = await updateBackup(currentUser.username, chatSliceRef);
    if (!!response.isError) {
      setIsLoading('');
      Alert.alert('Oops', 'Error while uploading backup\nPlease try again');
      return;
    }
    setIsLoading('');
    await getInitialData();
  };

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

      <SettingItem
        title={'Backup to cloud'}
        itemIcon={'cloud-upload-outline'}
        onPress={backUp}
      />
      {!!isLoading && (
        <BaseLoader
          dark={themeRef.dark}
          containerStyle={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            marginLeft: widthPercentageToDP(10),
          }}
          textStyle={{
            marginLeft: widthPercentageToDP(5),
          }}
          loadingText={
            isLoading == 'getting' ? 'Checking for last backup' : isLoading
          }
        />
      )}
      {!isLoading && !!backups && (
        <BackUpComponent themeRef={themeRef} item={backups[0]} isLast />
      )}

      {!isLoading && !backups && (
        <BaseText
          color={themeRef.colors.errorColor}
          weight={fontWeights.bold}
          otherStyles={{
            marginLeft: widthPercentageToDP(10),
            opacity: 0.8,
          }}>
          No recent backups
        </BaseText>
      )}

      {/* <SettingItem
          title={'Backup to local storage'}
          itemIcon={'log-in-outline'}
        /> */}

      <PageHeading
        middleComponenet={
          <PageName name={'Restore'} customStyle={{marginTop: hp(4)}} />
        }
        disableBackButton
        mainContainerStyle={{
          marginBottom: hp(1.5),
        }}
      />
      <SettingItem
        title={'Restore from cloud'}
        itemIcon={'cloud-download-outline'}
      />
      {isLoading == 'getting' && (
        <BaseLoader
          dark={themeRef.dark}
          containerStyle={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            marginLeft: widthPercentageToDP(10),
          }}
          textStyle={{
            marginLeft: widthPercentageToDP(5),
          }}
          loadingText={'Checking for backups to restore'}
        />
      )}
      {!isLoading && !!backups && backups?.length != 0 && (
        <FlatList
          data={[...backups, ...backups]}
          renderItem={({item}) => (
            <BackUpComponent themeRef={themeRef} item={item} />
          )}
          keyExtractor={(item, index) => index}
          style={{
            // flex: 1,
            height: hp(48),
            // backgroundColor: 'red',
          }}
          contentContainerStyle={{
            paddingVertical: hp(2),
            paddingBottom: hp(5),
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* <SettingItem
          title={'Restore from local storage'}
          itemIcon={'folder-open-outline'}
        /> */}
    </View>
  );
};
