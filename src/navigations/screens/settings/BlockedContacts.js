import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  commonStyles,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames, {
  fontWeights,
} from '../../../strings/FontfamiliesNames';
import {useNavigation, useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {commonSettingsStyles} from './AppearenceSettings';
import {changePassword} from '../../../../api/authentication/AuthenticationRequests';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import BaseModal from '../../../components/BaseModal';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import {useEffect} from 'react';
import BaseText from '../../../components/BaseText';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import ChatAvatar from '../../../components/ChatAvatar';
import IconButton from '../../../components/IconButton';
import {unBlockUsersInDB} from '../../../../api/chat/ChatRequests';
import {changeUserDetails} from '../../../../redux/authentication/AuthenticationSlice';

const BlockedContacts = () => {
  const themeRef = useTheme();
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const chatSliceRef = useSelector(state => state.chatSlice);
  console.log({currentUser});
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    chatAvatar: {
      height: hp(6),
      width: hp(6),
      borderRadius: 500,
      backgroundColor: themeRef.colors.primaryColor,
    },
    noPhotoStyle: {
      height: hp(5),
      width: hp(5),
    },
  });
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState('');

  const unBlockUser = async user => {
    console.log({user});
    setIsLoading('Please wait ..');
    const response = await unBlockUsersInDB(currentUser.username, user);
    if (!!response.isError && response.error != 'noData') {
      setIsLoading('');
      return;
    }
    console.log({unBlockUser: response});
    dispatch(
      changeUserDetails({
        userDetails: {
          blocked: response?.data?.length != 0 ? response?.data : [],
        },
      }),
    );
    setIsLoading('');
  };

  const showConfirm = user => {
    Alert.alert('Are you sure ?', 'Want to unblock user', [
      {
        text: 'Yes, Unblock',
        style: 'destructive',
        onPress: unBlockUser.bind(this, user),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const navigateInfoScreen = item => {
    console.log({item});
    // return;
    if (!!item?.id) {
      navigation.navigate(ScreenNames.GroupChatInfoScreen, {
        groupId: item.id,
      });
    } else {
      navigation.navigate(ScreenNames.ChatInfoScreen, {
        username: item.username,
      });
    }
  };

  const RenderBlockedUser = ({item}) => {
    let userInfo;
    let role;
    if (!!chatSliceRef?.friends?.[item]) {
      userInfo = chatSliceRef?.friends?.[item];
      role = 'friends';
    }
    if (!!chatSliceRef?.strangers?.[item]) {
      userInfo = chatSliceRef?.strangers?.[item];
      role = 'strangers';
    }
    if (!!chatSliceRef?.groups?.[item]) {
      userInfo = chatSliceRef?.groups?.[item];
      role = 'groups';
    }
    let displayName =
      role == 'friends'
        ? userInfo.contactName
        : role == 'strangers'
        ? userInfo.username
        : role === 'groups'
        ? userInfo.name
        : '';
    console.log({userInfo});
    if (!userInfo || !role) {
      return null;
    }
    let photoUri =
      role == 'groups'
        ? !!userInfo?.profilePhotoObject?.uri
          ? {
              uri: userInfo?.profilePhotoObject?.uri,
            }
          : undefined
        : !!userInfo?.profilePhoto
        ? {
            uri: userInfo.profilePhoto,
          }
        : undefined;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: hp(0.5),
          marginHorizontal: wp(5),
          paddingVertical: hp(0.5),
          flexDirection: 'row',
          paddingHorizontal: wp(3),
          alignItems: 'center',
          borderRadius: hp(2.5),
          overflow: 'hidden',
        }}>
        {!!photoUri ? (
          <ImageCompWithLoader
            source={!!photoUri ? photoUri : imageUrlStrings.profileSelected}
            // source={imageUrlStrings.banana}
            ImageStyles={[styles.chatAvatar, !photoUri && styles.noPhotoStyle]}
            containerStyles={{
              marginRight: !!photoUri ? wp(1) : wp(0.5),
              marginLeft: !!photoUri ? wp(0) : wp(0.4),
            }}
          />
        ) : (
          <ChatAvatar
            size={hp(7)}
            isCircle
            color={themeRef.colors.appThemeColor}
          />
        )}
        <TouchableOpacity
          onPress={navigateInfoScreen.bind(this, userInfo)}
          style={{
            width: wp(50),
            marginHorizontal: wp(2),
            marginVertical: hp(0.5),
            // backgroundColor: 'yellow',
            flex: 1,
          }}>
          <BaseText
            weight={fontWeights.bold}
            color={themeRef.colors.appThemeColor}
            size={fontSize.big}>
            {displayName}
          </BaseText>
          {role !== 'groups' && (
            <BaseText
              weight={fontWeights.semiBold}
              color={themeRef.colors.appThemeColor}
              size={fontSize.medium}>
              {userInfo.phone}
            </BaseText>
          )}
        </TouchableOpacity>
        <IconButton
          name={'person-add-sharp'}
          color={themeRef.colors.appThemeColor}
          size={27}
          containerStyle={{
            marginHorizontal: wp(2),
          }}
          onPress={showConfirm.bind(this, item)}
        />
      </View>
    );
  };

  return (
    <>
      <View style={commonStyles.topSpacer}>
        <PageHeading
          middleComponenet={
            <PageName
              name={`${
                !!currentUser?.blocked?.length
                  ? currentUser?.blocked?.length
                  : 0
              } Blocked contact${currentUser?.blocked?.length < 2 ? '' : 's'}`}
            />
          }
          backButtonProps={{
            name: 'chevron-back',
            size: 30,
            color: themeRef.colors.secondaryColor,
            backScreen: 'Privacy and Security',
          }}
          backNavigationScreen={ScreenNames.TopTabInnerScreens.PrivacyNSecurity}
        />
        {isLoading && (
          <BaseLoader
            loadingText="please wait .."
            containerStyle={{
              paddingVertical: hp(5),
            }}
          />
        )}
        {!isLoading && (
          <FlatList
            data={currentUser.blocked}
            renderItem={RenderBlockedUser}
            keyExtractor={(item, index) => item}
            style={{
              // backgroundColor: 'red',
              marginTop: hp(2),
            }}
          />
        )}
      </View>
    </>
  );
};

export default BlockedContacts;
