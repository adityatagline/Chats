import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  commonStyles,
  dimensions,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {useEffect} from 'react';
import {useState} from 'react';
import {animateNoChat, removeNoChat} from './ChatPageAnimationFuncs';
import {useRef} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {SafeAreaView} from 'react-native-safe-area-context';
import IconButton from '../../../components/IconButton';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {useDispatch, useSelector} from 'react-redux';
import {storeMessage} from '../../../../redux/chats/ChatSlice';

let dummyChats = [
  {
    message: 'HI',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Hie',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'how are you ?',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'fine',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'what about you ?',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'amazing\nmeet me at the office today',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Okay',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Sure',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: "I'll meet you at office.",
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'HI',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Hie',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'how are you ?',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'fine',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'what about you ?',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'amazing\nmeet me at the office today',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Okay',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Sure',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: "I'll meet you at office.",
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'HI',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Hie',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'how are you ?',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'fine',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'what about you ?',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'amazing\nmeet me at the office today',
    from: 'askldmasdiaodmjkssds',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Okay',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: 'Sure',
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
  {
    message: "I'll meet you at office.",
    from: 'aditya',
    date: new Date('2023-02-26T08:59:58.946Z'),
  },
].reverse();

export default ChatScreen = ({
  isGroup = false,
  // chatName = 'askldmasdiaodmjkssds',
  chatObject,
  backScreen,
  // userInfo = {
  //   username: 'aditya',
  // },
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      // backgroundColor: 'red',
      paddingHorizontal: 0,
      paddingTop: hp(0.5),
    },
    backButton: {
      //   backgroundColor: "red",
      paddingHorizontal: wp(1.5),
      marginHorizontal: wp(1),
    },
    pageHeadingContainer: {
      //   backgroundColor: "yellow",
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatName: {
      flex: 1,
      color: themeRef.colors.appThemeColor,
      fontFamily: FontfamiliesNames.primaryFontBold,
      fontSize: fontSize.big,
    },
    chatImage: {
      height: hp(5),
      width: hp(5),
      marginRight: wp(3),
      borderRadius: 17,
    },
    userTextInputContainer: {
      position: 'absolute',
      backgroundColor: themeRef.colors.primaryColor,
      // backgroundColor: 'red',
      flexDirection: 'row',
      left: 0,
      marginHorizontal: '2%',
      paddingVertical: '2%',
      paddingBottom: '4%',
      bottom: Platform.OS == 'ios' ? hp(1) : 0,
    },
    chatInput: {
      backgroundColor: '#F0F0F0',
      // backgroundColor: 'yellow',
      flex: 1,
      marginHorizontal: hp(2),
      paddingVertical: hp(1),
      paddingHorizontal: wp(3),
      borderRadius: 15,
      fontSize: !!userChatMessage ? 16 : 14,
      maxHeight: dimensions.height * 0.2,
      textAlignVertical: 'center',
      justifyContent: 'center',
      lineHeight: hp(2.7),
      // alignItems: 'center',
      alignSelf: 'center',
    },
    inputButton: {
      marginHorizontal: '1%',
      alignSelf: 'flex-end',
      paddingVertical: '2%',
    },
    noChatText: {
      fontSize: 14,
      textAlign: 'center',
      // opacity: 0.5,
      backgroundColor: '#F0F0F0',
      color: 'black',
      position: 'absolute',
      alignSelf: 'center',
      paddingVertical: '2%',
      paddingHorizontal: '4%',
      borderRadius: 22,
    },
    chatList: {
      // flex: 1,
      marginVertical: '2%',
      marginBottom: '20%',
    },
    chatListContainer: {
      // backgroundColor: 'yellow',
      marginHorizontal: '4%',
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    chatItemContainer: {
      // backgroundColor: "yellow",
      paddingHorizontal: '2%',
      borderRadius: 10,
      justifyContent: 'center',
    },
    message: {
      // backgroundColor: themeRef.colors.,
      paddingVertical: '2%',
      paddingHorizontal: '3%',
      maxWidth: '85%',
      borderRadius: 10,
      overflow: 'hidden',
    },
    senderName: {
      fontSize: 10,
      marginHorizontal: '2%',
      marginVertical: '1%',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      color: themeRef.colors.secondaryColor,
    },
  });
  const navigation = useNavigation();
  const route = useRoute();

  const userInfo = !!route.params && route.params.userInfo;
  console.log({userInfo});
  const username = !!route.params && route.params.username;
  const chatName = !!userInfo.contactName
    ? userInfo.contactName
    : userInfo.firstName + userInfo.lastName;

  const chatSliceRef = useSelector(state => state.chatSlice);
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );
  const dispatch = useDispatch();

  const currentUserInfo = authenticationSliceRef.user;

  const [orientation, setOrientation] = useState(
    dimensions.height > dimensions.width ? 'portrait' : 'landscape',
  );
  // console.log({ orientation });
  const [displayChatName, setDisplayChatName] = useState(chatName);
  const [userChatMessage, setUserChatMessage] = useState('');
  const [chatContent, setChatContent] = useState([]);

  const [isFileSendingTrayOpen, setIsFileSendingTrayOpen] = useState(false);
  // console.log({ chatContent });
  const noChatRef = useRef(
    new Animated.ValueXY({x: 0, y: dimensions.height * 0.15}),
  ).current;
  const chatListRef = useRef();
  const fileSendingTray = useRef(
    new Animated.ValueXY({
      x: hp(0),
      y: wp(0),
    }),
  ).current;
  const fileSendingTrayScaleAndOpacity = useRef(
    new Animated.ValueXY({
      x: 0.5,
      y: 0,
    }),
  ).current;
  const [noChatRefValue, setNoChatRefValue] = useState();
  const [isLoading, setIsLoading] = useState(true);
  console.log({username, chats: chatSliceRef.individualChats});

  useEffect(() => {
    const rotateListenre = Dimensions.addEventListener('change', ({screen}) => {
      if (screen.height > screen.width) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    });
    let chats = chatSliceRef.individualChats[username];

    if (!chats || (!!chats && chats.length == 0)) {
      setNoChatRefValue(
        animateNoChat(noChatRef, {x: 0.6, y: dimensions.height * 0.16}, 500),
      );
    } else {
      setChatContent([...chats]);
    }

    return () => {
      rotateListenre.remove();
    };
  }, []);

  useEffect(() => {
    if (chatName.length <= 20) {
      return;
    }
    let chat = chatName;
    if (orientation == 'portrait') {
      chat = chat.slice(0, 20) + ' ...';
      setDisplayChatName(chat);
    } else {
      if (chatName.length > 55) {
        chat = chat.slice(0, 55) + ' ...';
      }
      setDisplayChatName(chat);
    }
  }, [orientation]);

  useEffect(() => {
    if (!!noChatRefValue && chatContent.length != 0) {
      clearInterval(noChatRefValue);
      removeNoChat(noChatRef, {x: 0, y: dimensions.height * 0.1}, 700);
    }
    if (chatContent.length != 0) {
      // !!chatListRef && chatListRef.current.scrollToEnd({animate: true});
    }
  }, [noChatRefValue, chatContent, chatListRef]);

  const sendMessage = async message => {
    if (!message) {
      Alert.alert('Oops', 'Write something to send ..');
      return;
    }
    let chatObject = {
      from: currentUserInfo.username,
      date: new Date(),
      message,
      isSending: true,
    };
    let receiverObject = {chatName, username};
    console.log({chatObject});
    setChatContent(pre => [{...chatObject}, ...pre]);
    dispatch(storeMessage({chatObject, receiverObject}));
  };

  const RenderChatComp = ({item, index, chatArray}) => {
    let position;

    switch (index) {
      case 0:
        if (chatArray.length == 1) {
          position = 'alone';
        } else if (item.from == chatArray[1].from) {
          position = 'Top';
        } else {
          position = 'alone';
        }
        break;
      case chatArray.length - 1:
        if (item.from == chatArray[index - 1].from) {
          position = 'Bottom';
        } else {
          position = 'alone';
        }
        break;
      default:
        if (
          item.from == chatArray[index - 1].from &&
          item.from == chatArray[index + 1].from
        ) {
          position = 'center';
        } else if (item.from == chatArray[index + 1].from) {
          position = 'Top';
        } else if (item.from == chatArray[index - 1].from) {
          position = 'Bottom';
        } else {
          position = 'alone';
        }
        break;
    }
    // console.log({index, position, item});
    let borderRadiusStyle = {};
    if (position != 'center' && position != 'alone') {
      borderRadiusStyle[
        `border${position}${
          item.from == currentUserInfo.username ? 'Right' : 'Left'
        }Radius`
      ] = 0;
    } else if (position == 'center') {
      borderRadiusStyle[
        `borderTop${
          item.from == currentUserInfo.username ? 'Right' : 'Left'
        }Radius`
      ] = 0;
      borderRadiusStyle[
        `borderBottom${
          item.from == currentUserInfo.username ? 'Right' : 'Left'
        }Radius`
      ] = 0;
      // borderRadiusStyle['borderTopRightRadius'] = 0;
    }
    // borderRadiusStyle['backgroundColor'] = 'blue';

    return (
      <View
        style={[
          styles.chatItemContainer,
          {
            alignItems:
              item.from == currentUserInfo.username ? 'flex-end' : 'flex-start',
          },
          {
            marginBottom: position == 'Top' ? hp(2) : hp(0.25),
            marginTop: position == 'Bottom' ? hp(2) : hp(0.25),
            // backgroundColor: 'red',
          },
        ]}>
        {isGroup ? (
          <Text style={styles.senderName}>{item.from}</Text>
        ) : (
          item.from == currentUserInfo.username &&
          (position == 'alone' || position == 'Bottom') && (
            <Text style={styles.senderName}>you</Text>
          )
        )}

        <View
          style={[
            styles.message,
            {...borderRadiusStyle, overflow: 'hidden'},
            {
              backgroundColor:
                item.from == currentUserInfo.username
                  ? themeRef.colors.appThemeColor
                  : themeRef.colors.card,
            },
          ]}>
          <Text
            style={{
              color:
                item.from == currentUserInfo.username
                  ? themeRef.colors.primaryColor
                  : themeRef.colors.secondaryColor,
            }}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  const expandFileSendingTray = () => {
    setIsFileSendingTrayOpen(true);
    Animated.sequence([
      Animated.timing(fileSendingTray, {
        toValue: {
          x: hp(0),
          y: wp(90),
        },
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fileSendingTray, {
        toValue: {
          x: hp(10),
          y: wp(90),
        },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(fileSendingTrayScaleAndOpacity, {
        toValue: {
          x: 1,
          y: 1,
        },
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeFileSendingTray = () => {
    Animated.sequence([
      Animated.timing(fileSendingTrayScaleAndOpacity, {
        toValue: {
          x: 0.5,
          y: 0,
        },
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fileSendingTray, {
        toValue: {
          x: hp(10),
          y: wp(90),
        },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(fileSendingTray, {
        toValue: {
          x: hp(0),
          y: wp(90),
        },
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fileSendingTray, {
        toValue: {
          x: hp(0),
          y: wp(0),
        },
        duration: 10,
        useNativeDriver: false,
      }),
    ]).start();
    setTimeout(() => {
      setIsFileSendingTrayOpen(false);
    }, 650);
  };

  return (
    <SafeAreaView style={[commonStyles.screenStyle, styles.mainDiv]}>
      <View style={styles.pageHeadingContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon
            name={'chevron-back'}
            size={30}
            color={themeRef.colors.appThemeColor}
          />
        </TouchableOpacity>
        {!!userInfo.profilePhoto ? (
          <Image
            source={{uri: userInfo.profilePhoto}}
            style={styles.chatImage}
            borderRadius={17}
          />
        ) : (
          <Image
            source={imageUrlStrings.banana}
            style={styles.chatImage}
            // borderRadius={17}
          />
        )}
        <Text style={styles.chatName}>{displayChatName}</Text>
        <TouchableOpacity style={styles.backButton}>
          <Icon
            name={'information-circle-outline'}
            size={30}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton}>
          <Icon
            name={'ellipsis-vertical'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>
      <Animated.Text
        ref={noChatRef}
        style={[
          styles.noChatText,
          {
            opacity: noChatRef.x,
            top: noChatRef.y,
          },
        ]}>
        No recent chats ..
      </Animated.Text>
      <FlatList
        data={[...chatContent]}
        // data={[...chatContent]}
        ref={chatListRef}
        renderItem={({item, index}) => (
          <RenderChatComp
            item={item}
            index={index}
            chatArray={[...chatContent]}
          />
        )}
        keyExtractor={(_, index) => index}
        style={styles.chatList}
        inverted
        contentContainerStyle={styles.chatListContainer}
      />
      {isFileSendingTrayOpen && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: hp(10),
            alignSelf: 'center',
            height: fileSendingTray.x,
            width: fileSendingTray.y,
            backgroundColor: themeRef.colors.primary,
            justifyContent: 'center',
            // paddingVertical: hp(2),
            borderRadius: 20,
            elevation: 4,
            shadowColor: themeRef.colors.secondaryColor,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              opacity: fileSendingTrayScaleAndOpacity.y,
              transform: [
                {
                  scale: fileSendingTrayScaleAndOpacity.x,
                },
              ],
            }}>
            <IconButton name={'image'} color={themeRef.colors.appThemeColor} />
            <IconButton name={'film'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'document'}
              color={themeRef.colors.appThemeColor}
            />
            <IconButton name={'folder'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'location'}
              color={themeRef.colors.appThemeColor}
            />
          </Animated.View>
        </Animated.View>
      )}
      <View style={styles.userTextInputContainer}>
        <TouchableOpacity style={styles.inputButton}>
          <Icon
            name={'camera-outline'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder={'Type something ..'}
          placeholderTextColor={'black'}
          value={userChatMessage}
          multiline
          onChangeText={setUserChatMessage}
          textAlignVertical="center"
        />
        <TouchableOpacity
          style={[styles.inputButton]}
          onPress={
            isFileSendingTrayOpen ? closeFileSendingTray : expandFileSendingTray
          }>
          <Icon
            name={'attach'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inputButton, styles.sendButton]}
          onPress={sendMessage.bind(this, userChatMessage)}>
          <Icon
            name={'send'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
