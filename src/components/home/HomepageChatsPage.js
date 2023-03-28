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
import {commonStyles} from '../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../strings/FontfamiliesNames';
import ScreenNames from '../../strings/ScreenNames';
import TextButton from '../TextButton';
import {imageUrlStrings} from '../../strings/ImageUrlStrings';

export default HomepageChatsPage = ({chatArray}) => {
  const themeRef = useTheme();
  const chatSlice = useSelector(state => state.chatSlice);
  // console.log({chatSlice});
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );
  const chatSliceRef = useSelector(state => state.chatSlice);

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      borderRadius: 30,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      // borderRadius: 30,
      overflow: 'hidden',
    },
    flatListContainer: {
      paddingVertical: hp(1),
      paddingBottom: hp(7),
    },
    chatAvatar: {
      height: hp(7),
      width: hp(7),
      borderRadius: 20,
    },
    chatDiv: {
      // backgroundColor: 'red',
      marginVertical: hp(0.5),
      marginHorizontal: wp(5),
      paddingVertical: hp(0.5),
      flexDirection: 'row',
      paddingHorizontal: wp(3),
      alignItems: 'center',
    },
    chatDetails: {
      // backgroundColor: 'yellow',
      width: wp(50),
      marginHorizontal: wp(2),
      marginVertical: hp(0.5),
    },
    chatName: {
      fontFamily: FontfamiliesNames.primaryFontBold,
      textTransform: 'capitalize',
      color: themeRef.colors.appThemeColor,
      fontSize: 18,
      marginBottom: hp(0.2),
    },
    message: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
      fontSize: 15,
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
    noChatsText: {
      // backgroundColor: 'yellow',
      color: themeRef.colors.secondaryColor,
    },
    newChatButton: {
      color: themeRef.colors.appThemeColor,
    },
  });

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
    // console.log({item, frends: chatSlice.friends});
  };

  const renderHomePageChats = ({item}) => {
    // console.log({item});
    let chatname = item.chatName;

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

    let chattime =
      new Date() - new Date(item.date) > 86400000
        ? new Date(item.date).toLocaleDateString()
        : new Date(item.date).toLocaleTimeString();
    if (chattime.includes(':')) {
      chattime =
        (chattime.length < 11
          ? '0' + chattime.slice(0, 4)
          : chattime.slice(0, 5)) +
        ' ' +
        chattime.slice(chattime.length - 2, chattime.length);
    }
    let chatmessage = item.message.split('\n')[0];
    chatmessage =
      chatmessage.length > 15
        ? item.message.slice(0, 15) + '...'
        : item.message;
    let photoUri =
      !!chatSlice.friends[item.otherUser] &&
      !!chatSlice.friends[item.otherUser].profilePhoto
        ? {uri: chatSlice.friends[item.otherUser].profilePhoto}
        : imageUrlStrings.profileSelected;

    return (
      <TouchableOpacity
        style={styles.chatDiv}
        onPress={goToChatScreen.bind(this, item)}>
        <Image
          source={photoUri}
          style={[
            styles.chatAvatar,
            !photoUri.uri && {
              marginVertical: hp(1),
              marginHorizontal: hp(1),
              height: hp(5),
              width: hp(5),
            },
          ]}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{chatname}</Text>
          <Text style={styles.message}>
            {item.from == authenticationSliceRef.user.username
              ? 'You: ' + chatmessage
              : chatmessage}
          </Text>
        </View>
        <Text style={styles.chattime}>{chattime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainDiv}>
      {chatSlice.homepageChats.length != 0 && (
        <FlatList
          data={chatSlice.homepageChats}
          renderItem={renderHomePageChats}
          // bounces={false}
          keyExtractor={(item, index) => index}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.noChatsDiv}>
        <Text style={styles.noChatsText}>No Recent Chats ..</Text>
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
