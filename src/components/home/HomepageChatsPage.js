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
import ChatAvatar from '../ChatAvatar';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export default HomepageChatsPage = ({
  chatArray,
  onLongPress,
  isSelectionMode,
  optionUsers,
}) => {
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
      paddingBottom: hp(19),
    },
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
    chatDiv: {
      marginVertical: hp(0.5),
      marginHorizontal: wp(5),
      paddingVertical: hp(0.5),
      flexDirection: 'row',
      paddingHorizontal: wp(3),
      alignItems: 'center',
      borderRadius: hp(2.5),
      overflow: 'hidden',
      flex: 1,
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
    } else {
      setHomepageChats([]);
    }
  }, [chatSliceRef.homepageChats, chatSliceRef.strangers]);

  const goToNewChatPage = () => {
    navigation.navigate(ScreenNames.NewChatPage);
  };

  const goToChatScreen = item => {
    let chatname = item.chatName;
    if (!!item?.groupId) {
      navigation.navigate(ScreenNames.GroupChatPage, {
        groupId: item.groupId,
        chatName: chatname,
      });
    } else {
      let friendObj = !!chatSliceRef.friends[item.otherUser];
      navigation.navigate(ScreenNames.ChatPage, {
        userInfo: !!friendObj
          ? {...chatSliceRef.friends[item.otherUser]}
          : {username: item.otherUser},
        username: item.otherUser,
        chatName: chatname,
      });
    }
  };

  const renderHomePageChats = ({item}) => {
    let chatname = item.chatName;
    // item.otherUser == 'Aditya' && console.log({itemHome: item});
    let isUnseenMessages = 0;
    let isGroup = !!item?.groupId;
    if (!!item?.otherUser && !!chatSliceRef.unseenChats[item?.otherUser]) {
      isUnseenMessages = chatSliceRef.unseenChats[item.otherUser].length;
    }
    // if (!!item?.groupId && !!chatSliceRef.unseenChats[item?.groupId]) {
    //   isUnseenMessages =
    //     // !!chatSliceRef?.groupChats?.[item.groupId] &&
    //     // !!chatSliceRef?.unseenChats?.[item.groupId]
    //     //   ? chatSliceRef.groupChats[item.groupId].length -
    //     //     chatSliceRef?.unseenChats?.[item.groupId].length
    //     //   :
    //     !!chatSliceRef.unseenChats[item.groupId]
    //       ? chatSliceRef.unseenChats[item.groupId].length
    //       : 0;
    //   // console.log({
    //   //   unseenChats: chatSliceRef.unseenChats[item.groupId],
    //   //   group: item.groupId,
    //   // });
    // }
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

    let chatmessage = !!item.mediaType
      ? `sent ${item.mediaType}`
      : item.message;
    if (item.message.includes('\n')) {
      chatmessage = chatmessage.split('\n')[0];
    }
    let photoUri = !!item?.groupId
      ? chatSliceRef?.groups[item.groupId]?.profilePhotoObject?.uri
      : !!chatSliceRef?.friends[item.otherUser]?.profilePhoto
      ? chatSliceRef?.friends[item.otherUser]?.profilePhoto
      : chatSliceRef?.strangers[item.otherUser]?.profilePhoto;

    let senderName = !!chatSliceRef?.friends?.[item.from]
      ? chatSliceRef?.friends?.[item.from].contactName
      : !!chatSliceRef?.strangers?.[item.from]
      ? chatSliceRef?.strangers?.[item.from].firstName
      : item.from;
    // console.log({
    //   item,
    //   name: senderName,
    //   user: item.from,
    //   cur: authenticationSliceRef.user.username,
    // });
    senderName = senderName.split(' ')[0];
    senderName =
      senderName.length > 20 ? senderName.slice(0, 20) + ' ..' : senderName;

    // console.log({photoUri, user: chatSlice.friends[item.otherUser]});

    let isSelected =
      (!!item?.otherUser && optionUsers.includes(item?.otherUser)) ||
      (!!item?.groupId && optionUsers.includes(item?.groupId));

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={[
            styles.chatDiv,
            isSelected && {
              backgroundColor: themeRef.colors.border,
            },
            !!photoUri && {
              paddingVertical: hp(1.25),
            },
          ]}
          onLongPress={onLongPress.bind(
            this,
            isGroup ? item.groupId : item.otherUser,
          )}
          onPress={
            isSelectionMode
              ? onLongPress.bind(this, isGroup ? item.groupId : item.otherUser)
              : goToChatScreen.bind(this, item)
          }>
          {!!authenticationSliceRef?.user?.blocked &&
            authenticationSliceRef?.user?.blocked?.includes(
              isGroup ? item.groupId : item.otherUser,
            ) &&
            !isSelected && (
              <View
                style={{
                  backgroundColor: themeRef.colors.errorColor,
                  position: 'absolute',
                  flex: 1,
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  opacity: 0.2,
                  zIndex: -100,
                }}></View>
            )}
          {!!photoUri ? (
            <ImageCompWithLoader
              // source={
              //   !!photoUri ? {uri: photoUri} : imageUrlStrings.profileSelected
              // }
              source={imageUrlStrings.banana}
              ImageStyles={[
                styles.chatAvatar,
                !photoUri && styles.noPhotoStyle,
              ]}
              containerStyles={{
                marginRight: !!photoUri.uri ? wp(1) : wp(0.5),
                marginLeft: !!photoUri.uri ? wp(0) : wp(0.4),
              }}
              loaderColor={themeRef.colors.appThemeColor}
            />
          ) : (
            <ChatAvatar
              size={hp(7)}
              isCircle
              color={themeRef.colors.appThemeColor}
            />
          )}

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
              {`${
                item.from == authenticationSliceRef.user.username
                  ? !item.message
                    ? ''
                    : "'You : '"
                  : !!item?.groupId && item.messageType != 'announcement'
                  ? senderName + ' : '
                  : ''
              }${chatmessage}`}
              {/* {item.from == authenticationSliceRef.user.username
'              ? (item?.messageType == 'announcement' ? '' : 'You: ') +
'                chatmessage
              : chatmessage} */}
            </BaseText>
          </View>
          {(isUnseenMessages != 0 || isUnseenMessages != '0') && (
            <View style={styles.unseenMessageNumberContainer}>
              <BaseText
                color={themeRef.colors.primaryColor}
                size={fontSize.tiny}
                weight={fontWeights.semiBold}>
                {isUnseenMessages}
              </BaseText>
            </View>
          )}
          <BaseText
            color={themeRef.colors.secondaryColor}
            size={fontSize.tiny}
            weight={fontWeights.medium}>
            {chattime}
          </BaseText>
        </TouchableOpacity>
        {!!authenticationSliceRef?.user?.blocked?.includes(
          isGroup ? item.groupId : item.otherUser,
        ) && (
          <EntypoIcon
            name="block"
            size={25}
            color={themeRef.colors.errorColor}
            style={{
              marginRight: wp(5),
            }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainDiv}>
      {/* {console.log({homepageChats})} */}
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
      {homepageChats.length == 0 && (
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
      )}
    </View>
  );
};
