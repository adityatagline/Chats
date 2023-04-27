import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Text,
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
import {useTheme} from '@react-navigation/native';
import {PageHeading, PageName, SettingItem} from './CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {commonSettingsStyles} from './AppearenceSettings';
import {changePassword} from '../../../../api/authentication/AuthenticationRequests';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import BaseModal from '../../../components/BaseModal';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import {useEffect} from 'react';
import BaseText from '../../../components/BaseText';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import ChatAvatar from '../../../components/ChatAvatar';
import IconButton from '../../../components/IconButton';

const BlockedContacts = () => {
  const themeRef = useTheme();
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const chatSliceRef = useSelector(state => state.chatSlice);

  const [isLoading, setIsLoading] = useState('');

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
    let photoUri = !!userInfo?.profilePhoto
      ? {uri: userInfo.profilePhoto}
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
        {!!userInfo?.profilePhoto ? (
          <ImageCompWithLoader
            // source={!!photoUri ? photoUri : imageUrlStrings.profileSelected}
            source={imageUrlStrings.banana}
            ImageStyles={[styles.chatAvatar, !photoUri && styles.noPhotoStyle]}
            containerStyles={{
              marginRight: !!photoUri.uri ? wp(1) : wp(0.5),
              marginLeft: !!photoUri.uri ? wp(0) : wp(0.4),
            }}
          />
        ) : (
          <ChatAvatar
            size={hp(6)}
            isCircle
            color={themeRef.colors.appThemeColor}
          />
        )}
        <View
          style={{
            width: wp(50),
            marginHorizontal: wp(2),
            marginVertical: hp(0.5),
            // backgroundColor: 'yellow',
            flex: 1,
          }}>
          <BaseText
            weight={fontWeights.semiBold}
            color={themeRef.colors.appThemeColor}
            size={fontSize.big}>
            {displayName}
          </BaseText>
          {role !== 'groups' && <BaseText>{userInfo.phone}</BaseText>}
        </View>
        <IconButton
          name={'person-add-sharp'}
          color={themeRef.colors.appThemeColor}
          size={27}
          containerStyle={{
            marginHorizontal: wp(2),
          }}
        />
      </View>
    );
  };

  return (
    <>
      <View style={commonStyles.topSpacer}>
        <PageHeading
          middleComponenet={<PageName name={'Blocked contacts'} />}
          backButtonProps={{
            name: 'chevron-back',
            size: 30,
            color: themeRef.colors.secondaryColor,
            backScreen: 'Privacy and Security',
          }}
          backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
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
          />
        )}
      </View>
    </>
  );
};

export default BlockedContacts;
