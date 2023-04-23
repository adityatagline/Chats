import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useEffect, React} from 'react';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import ScreenNames from '../../../strings/ScreenNames';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../../../redux/authentication/AuthenticationSlice';
import {clearAllChats} from '../../../../redux/chats/ChatSlice';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import ChatAvatar from '../../../components/ChatAvatar';
import {logoutUserFromDB} from '../../../../api/authentication/AuthenticationRequests';

export default Settings = props => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      paddingTop: hp(10),
      paddingHorizontal: wp(7),
    },
    pageHeading: {
      marginLeft: '10%',
      fontSize: 25,
      fontWeight: 'bold',
    },
    settingItem: {
      flexDirection: 'row',
      marginVertical: '1%',
      paddingVertical: hp(1),
      marginHorizontal: wp(2),
      marginTop: hp(2),
      borderRadius: 15,
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: '5%',
      alignSelf: 'center',
    },
    settingItemLabel: {
      fontSize: fontSize.large,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
      alignSelf: 'center',
    },
    listDiv: {
      marginTop: '5%',
    },
    userInfo: {
      fontSize: fontSize.big,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.secondaryColor,
    },
    fieldName: {
      fontFamily: FontfamiliesNames.primaryFontMedium,
      color: themeRef.colors.appThemeColor,
    },
  });

  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const user = useSelector(state => state.authenticationSlice).user;

  useEffect(() => {
    isFocused && props.setterFunction(route.name);
  }, [isFocused]);

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  const SettingItem = ({
    title,
    onPress,
    customContainerStyle,
    customLabelStyle,
    itemIcon,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.settingItem, customContainerStyle]}>
        <IoniconsIcon
          name={itemIcon}
          size={30}
          color={themeRef.colors.secondaryColor}
          style={styles.settingItemIcon}
        />
        <Text style={[styles.settingItemLabel, customLabelStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const logoutUser = () => {
    Alert.alert(
      'Have you backed up ?',
      'All your data will be wiped out from your local storage. \nSo double check if you have backed up or not.',
      [
        {
          text: 'yes, I backed up',
          style: 'destructive',
          onPress: async () => await showFinalPopUp(),
        },
        {
          text: 'cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const showFinalPopUp = async () => {
    Alert.alert('Are you sure ?', 'want to logout from app ?', [
      {
        text: 'yes, log out',
        style: 'destructive',
        onPress: async () => await clearChats(),
      },
      {
        text: 'cancel',
        style: 'cancel',
      },
    ]);
  };

  const clearChats = async () => {
    dispatch(clearAllChats());
    dispatch(logout());
    await logoutUserFromDB(user.username);
  };

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      <View style={[styles.settingItem]}>
        {/* <View> */}

        {!user?.profilePhotoObject?.uri ? (
          <ImageCompWithLoader
            // source={{
            //   uri: user.profilePhotoObject.uri,
            // }}
            source={imageUrlStrings.lemon}
            ImageStyles={{
              height: hp(10),
              width: hp(10),
              borderRadius: 1000,
              alignSelf: 'center',
            }}
            containerStyles={{
              // backgroundColor: 'red',
              marginRight: wp(5),
              marginLeft: -wp(1.5),
            }}
          />
        ) : (
          <ChatAvatar
            size={hp(10)}
            isCircle
            color={themeRef.colors.appThemeColor}
          />
        )}
        {/* <Image
          source={
            !!user?.profilePhotoObject?.uri
              ? {
                  uri: user.profilePhotoObject.uri,
                }
              : imageUrlStrings.profileSelected
          }
          style={}
        /> */}
        {/* <IconButton
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
              bottom: hp(2),
              // alignSelf: 'center',
              marginLeft: wp(52),
            }}
          /> */}
        {/* </View> */}
        <View>
          <Text style={[styles.userInfo, styles.fieldName]}>
            name :{' '}
            <Text style={styles.userInfo}>
              {user.firstName} {user.lastName}
            </Text>
          </Text>
          <Text style={[styles.userInfo, styles.fieldName]}>
            username : <Text style={styles.userInfo}>{user.username}</Text>
          </Text>
          <Text style={[styles.userInfo, styles.fieldName]}>
            phone : <Text style={styles.userInfo}>{user.phone}</Text>
          </Text>
        </View>
        {/* <IconButton
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
            // alignSelf: 'center',
            right: wp(2),
          }}
        /> */}
      </View>

      <SettingItem
        title={'Edit Profile'}
        itemIcon={'create-outline'}
        onPress={goToScreen.bind(
          this,
          ScreenNames.TopTabInnerScreens.ProfileSettings,
        )}
      />
      <SettingItem
        title={'Appearence'}
        itemIcon={'color-palette-outline'}
        onPress={goToScreen.bind(
          this,
          ScreenNames.TopTabInnerScreens.Appearence,
        )}
      />
      <SettingItem
        title={'Privacy and Security'}
        itemIcon={'shield-outline'}
        onPress={goToScreen.bind(
          this,
          ScreenNames.TopTabInnerScreens.PrivacyNSecurity,
        )}
      />
      <SettingItem
        title={'Backup and Restore'}
        itemIcon={'cloud-upload-outline'}
        onPress={goToScreen.bind(
          this,
          ScreenNames.TopTabInnerScreens.BackupNRestore,
        )}
      />
      <SettingItem
        title={'Log out'}
        itemIcon={'exit-outline'}
        onPress={logoutUser}
      />
    </View>
  );
};
