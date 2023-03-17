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

export default HomepageChatsPage = ({chatArray}) => {
  const themeRef = useTheme();
  const chatSlice = useSelector(state => state.chatSlice);
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      marginTop: hp(4),
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
      paddingVertical: hp(1),
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
      // overflow: 'hidden',
      // hidden:
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
    navigation.navigate(ScreenNames.ChatPage, {
      userInfo: {...chatSlice.friends[item.username]},
      username: item.username,
    });
    console.log({item});
  };

  const renderHomePageChats = ({item}) => {
    console.log({item});
    let chatname = item.chatName;
    if (chatname.length > 15) {
      chatname = chatname.slice(0, 15);
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
    let chatmessage =
      item.message.length > 15
        ? item.message.slice(0, 15) + '...'
        : item.message;

    return (
      <TouchableOpacity
        style={styles.chatDiv}
        onPress={goToChatScreen.bind(this, item)}>
        <Image
          source={{uri: authenticationSlice.user.profilePhoto}}
          style={styles.chatAvatar}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{chatname}</Text>
          <Text style={styles.message}>
            {item.from == authenticationSlice.user.username
              ? 'You: ' + chatmessage
              : chatmessage}
          </Text>
        </View>
        <Text style={styles.chattime}>{chattime}</Text>
      </TouchableOpacity>
    );
  };

  console.log('running ------------------');
  console.log({frnds: chatSlice.friends});

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
      {/* {chatSlice.homepageChats.length == 0 && ( */}
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
