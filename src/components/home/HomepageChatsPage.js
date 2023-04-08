import {useNavigation, useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {commonStyles, fontSize} from '../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames, {fontWeights} from '../../strings/FontfamiliesNames';
import ScreenNames from '../../strings/ScreenNames';
import TextButton from '../TextButton';
import {imageUrlStrings} from '../../strings/ImageUrlStrings';
import BaseText from '../BaseText';
import ImageCompWithLoader from '../ImageCompWithLoader';
import {useEffect} from 'react';

export default HomepageChatsPage = ({chatArray}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      borderRadius: 30,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflow: 'hidden',
    },
    flatListContainer: {
      paddingVertical: hp(1),
      paddingBottom: hp(7),
    },
    chatAvatar: {
      height: hp(6),
      width: hp(6),
      borderRadius: wp(5),
    },
    noPhotoStyle: {
      height: hp(5),
      width: hp(5),
      borderRadius: wp(4.5),
    },
    chatDiv: {
      marginVertical: hp(0.5),
      marginHorizontal: wp(5),
      paddingVertical: hp(0.5),
      flexDirection: 'row',
      paddingHorizontal: wp(3),
      alignItems: 'center',
    },
    chatDetails: {
      width: wp(50),
      marginHorizontal: wp(2),
      marginVertical: hp(0.5),
      // backgroundColor: 'yellow',
      flex: 1,
    },
    chattime: {
      fontFamily: FontfamiliesNames.primaryFontMedium,
      color: themeRef.colors.secondaryColor,
      fontSize: 12,
    },
    noChatsDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    newChatButton: {
      color: themeRef.colors.appThemeColor,
    },
    unseenMessageNumberContainer: {
      backgroundColor: themeRef.colors.appThemeColor,
      paddingVertical: hp(0.2),
      paddingHorizontal: wp(1.5),
      borderRadius: 7,
      marginHorizontal: wp(2),
    },
  });

  const chatSlice = useSelector(state => state.chatSlice);
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );
  const chatSliceRef = useSelector(state => state.chatSlice);
  const navigation = useNavigation();
  const [homepageChats, setHomepageChats] = useState([]);
  // console.log({homepageChats})

  useEffect(() => {
    if (chatSliceRef.homepageChats.length != 0) {
      setHomepageChats([...chatSliceRef.homepageChats]);
    }
  }, [chatSliceRef.homepageChats, chatSliceRef.strangers]);

  const goToNewChatPage = () => {
    navigation.navigate(ScreenNames.NewChatPage);
  };

  const goToChatScreen = item => {
    let friendObj = !!chatSlice.friends[item.otherUser];
    let chatname = item.chatName;

    navigation.navigate(ScreenNames.ChatPage, {
      userInfo: !!friendObj
        ? {...chatSliceRef.friends[item.otherUser]}
        : {username: item.otherUser},
      username: item.otherUser,
      chatName: chatname,
    });
  };

  const renderHomePageChats = ({item}) => {
    // console.log({item});
    let chatname = item.chatName;
    let isUnseenMessages = !!chatSliceRef.unseenChats[item.otherUser]
      ? chatSliceRef.unseenChats[item.otherUser].length
      : 0;

    // console.log({friend: chatSlice.friends?.[item.otherUser]});

    if (chatname.length > 20) {
      chatname = chatname.slice(0, 20);
      chatname = chatname.split(' ');
      if (chatname.length > 1) {
        let temp = '';
        for (let i = 0; i < chatname.length - 1; i++) {
          temp = temp + chatname[i] + ' ';
        }
        chatname = temp;
      }
      chatname = chatname + ' ..';
    }

    let chattime;
    let chatDate = new Date(item.date);
    if (new Date() - chatDate > 86400000) {
      chattime = chatDate.toLocaleDateString();
    } else {
      let part = 'am';

      if (chatDate.getHours() >= 12) {
        part = 'pm';
        chattime =
          chatDate.getHours() > 12
            ? chatDate.getHours() - 12
            : chatDate.getHours() == 0
            ? 12
            : chatDate.getHours();
        if (Number(chattime) < 10) {
          chattime = '0' + Number(chattime).toString();
        }
      } else {
        chattime = chatDate.getHours();
      }
      chattime = `${chattime}:${
        chatDate.getMinutes() < 10 ? '0' : ''
      }${chatDate.getMinutes()} ${part}`;
      // chattime = chattime + part;
    }

    let chatmessage = item.message;
    if (item.message.includes('\n')) {
      chatmessage = chatmessage.split('\n')[0];
    }
    let photoUri =
      !!chatSlice.friends[item.otherUser] &&
      !!chatSlice.friends[item.otherUser].profilePhoto
        ? {uri: chatSlice.friends[item.otherUser].profilePhoto}
        : undefined;

    if (!photoUri) {
      photoUri = !!chatSliceRef?.strangers?.[item.otherUser]
        ? {uri: chatSliceRef?.strangers?.[item.otherUser].profilePhoto}
        : imageUrlStrings.profileSelected;
    }

    // console.log({photoUri});

    return (
      <TouchableOpacity
        style={styles.chatDiv}
        onPress={goToChatScreen.bind(this, item)}>
        <ImageCompWithLoader
          source={!!photoUri ? photoUri : imageUrlStrings.profileSelected}
          ImageStyles={[styles.chatAvatar, !photoUri && styles.noPhotoStyle]}
          containerStyles={{
            marginRight: !!photoUri.uri ? wp(1) : wp(2),
            marginLeft: !!photoUri.uri ? wp(0) : wp(2.5),
          }}
        />
        <View style={styles.chatDetails}>
          <BaseText
            weight={fontWeights.semiBold}
            color={themeRef.colors.appThemeColor}
            size={fontSize.big}>
            {chatname}
          </BaseText>
          <BaseText
            weight={fontWeights.medium}
            color={themeRef.colors.secondaryColor}
            otherProp={{
              numberOfLines: 1,
            }}>
            {item.from == authenticationSliceRef.user.username
              ? 'You: ' + chatmessage
              : chatmessage}
          </BaseText>
        </View>
        <View style={styles.unseenMessageNumberContainer}>
          <BaseText
            color={themeRef.colors.primaryColor}
            size={fontSize.tiny}
            weight={fontWeights.semiBold}>
            {isUnseenMessages}
          </BaseText>
        </View>
        <BaseText
          color={themeRef.colors.secondaryColor}
          size={fontSize.tiny}
          weight={fontWeights.medium}>
          {chattime}
        </BaseText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainDiv}>
      {homepageChats.length != 0 && (
        <FlatList
          data={homepageChats}
          renderItem={renderHomePageChats}
          bounces={false}
          keyExtractor={(item, index) => index}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.noChatsDiv}>
        <BaseText color={themeRef.colors.secondaryColor}>
          No Recent Chats ..
        </BaseText>
        <TextButton
          title={'Start new'}
          textStyle={styles.newChatButton}
          onPress={goToNewChatPage}
        />
      </View>
      {/* )} */}
    </View>
  );
};
