import {useRoute, useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import BaseText from '../../../components/BaseText';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {PageHeading} from '../settings/CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatInfoScreen = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    profilePhoto: {
      height: hp(25),
      width: hp(25),
      borderRadius: 500,
      alignSelf: 'center',
      // backgroundColor: 'red',
    },
  });
  const route = useRoute();
  const username = route?.params?.username;

  const chatSliceRef = useSelector(state => state.chatSlice);
  let user = !!chatSliceRef.friends[username]
    ? chatSliceRef.friends[username]
    : chatSliceRef.strangers[username];
  // console.log({route: route?.params, user});

  return (
    <View style={[commonStyles.screenStyle, styles.mainDiv]}>
      <PageHeading
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.secondaryColor,
          backScreen: 'Back',
        }}
        backButtonStyle={{
          marginLeft: 0,
        }}
      />
      <ImageCompWithLoader
        source={
          // !!user?.profilePhoto
          //   ? {
          //       uri: user.profilePhoto,
          //     }
          //   :
          imageUrlStrings.profileSelected
        }
        ImageStyles={styles.profilePhoto}
        resizeMode="contain"
      />
      <View
        style={{
          alignItems: 'center',
          marginVertical: hp(4),
        }}>
        <BaseText
          size={fontSize.heading}
          weight={fontWeights.bold}
          color={themeRef.colors.appThemeColor}>
          {user?.contactName ?? `${user.firstName} ${user.lastName}`}
        </BaseText>
        <BaseText
          color={themeRef.colors.secondaryColor}
          size={fontSize.medium}
          weight={fontWeights.medium}>
          chats@{username}
        </BaseText>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: hp(2),
            marginLeft: -wp(5),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="call"
            size={20}
            color={themeRef.colors.secondaryColor}
            style={{
              marginHorizontal: wp(2),
            }}
          />
          <BaseText
            color={themeRef.colors.secondaryColor}
            size={fontSize.large}
            weight={fontWeights.semiBold}>
            {user?.phone}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

export default ChatInfoScreen;
