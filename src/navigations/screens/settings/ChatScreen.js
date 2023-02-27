import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  Animated,
  FlatList,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {dimensions, StatusBarHeight} from '../../../styles/commonStyles';
import {useEffect} from 'react';
import {useState} from 'react';
import {animateNoChat, removeNoChat} from './ChatPageAnimationFuncs';
import {useRef} from 'react';

export default ChatScreen = ({
  isGroup = false,
  chatName = 'askldmasdiaodmjkssds',
  chatObject,
  backScreen,
  userInfo = {
    username: 'aditya',
  },
}) => {
  const [orientation, setOrientation] = useState(
    dimensions.height > dimensions.width ? 'portrait' : 'landscape',
  );
  // console.log({ orientation });
  const [displayChatName, setDisplayChatName] = useState(chatName);
  const [userChatMessage, setUserChatMessage] = useState('');
  const [chatContent, setChatContent] = useState([
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
  ]);
  // console.log({ chatContent });
  const noChatRef = useRef(
    new Animated.ValueXY({x: 0, y: dimensions.height * 0.15}),
  ).current;
  const chatListRef = useRef();
  const [noChatRefValue, setNoChatRefValue] = useState();

  useEffect(() => {
    const rotateListenre = Dimensions.addEventListener('change', ({screen}) => {
      if (screen.height > screen.width) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    });

    if (chatContent.length == 0) {
      setNoChatRefValue(
        animateNoChat(noChatRef, {x: 0.6, y: dimensions.height * 0.16}, 500),
      );
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
      !!chatListRef && chatListRef.current.scrollToEnd({animate: true});
    }
  }, [noChatRefValue, chatContent, chatListRef]);

  const sendMessage = message => {
    let chatObject = {
      from: userInfo.username,
      date: new Date(),
      message,
      isSending: true,
    };
    setChatContent(pre => [...pre, {...chatObject}]);
  };

  const renderChatItem = ({item, index}) => {
    let position;
    // console.log({ index });
    switch (index) {
      case 0:
        if (chatContent.length == 1) {
          position = 'alone';
        } else if (item.from == chatContent[index + 1]) {
          position == 'Bottom';
        } else {
          position = 'alone';
        }
        break;
      case chatContent.length - 1:
        if (item.from == chatContent[index - 1].from) {
          position = 'Top';
        } else {
          position = 'alone';
        }
        break;
      default:
        if (
          item.from == chatContent[index - 1].from &&
          item.from == chatContent[index + 1].from
        ) {
          position = 'center';
        } else if (item.from == chatContent[index + 1].from) {
          position = 'Bottom';
        } else if (item.from == chatContent[index - 1].from) {
          position = 'Top';
        } else {
          position = 'alone';
        }
        break;
    }
    let borderRadiusStyle = {};
    if (position != 'center' && position != 'alone') {
      borderRadiusStyle[
        `border${position}${
          item.from == userInfo.username ? 'Right' : 'Left'
        }Radius`
      ] = 0;
    } else if (position == 'center') {
      borderRadiusStyle[
        `borderTop${item.from == userInfo.username ? 'Right' : 'Left'}Radius`
      ] = 0;
      borderRadiusStyle[
        `borderBottom${item.from == userInfo.username ? 'Right' : 'Left'}Radius`
      ] = 0;
    }

    return (
      <View
        style={[
          styles.chatItemContainer,
          {
            alignItems:
              item.from == userInfo.username ? 'flex-end' : 'flex-start',
          },
          {
            marginVertical: position == 'center' ? '0.5%' : '2%',
            marginTop:
              position == 'center' || position == 'Top' ? '0.5%' : '2%',
            marginBottom:
              position == 'center' || position == 'Bottom' ? '0.5%' : '2%',
            // backgroundColor: "red",
          },
        ]}>
        {isGroup ? (
          <Text style={styles.senderName}>{item.from}</Text>
        ) : (
          item.from == userInfo.username &&
          (position == 'alone' || position == 'Bottom') && (
            <Text style={styles.senderName}>you</Text>
          )
        )}
        <Text style={[styles.message, {...borderRadiusStyle}]}>
          {item.message}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    mainDiv: {
      flex: 1,
    },
    backButton: {
      //   backgroundColor: "red",
      paddingHorizontal: '1%',
      marginHorizontal: '1%',
    },
    pageHeadingContainer: {
      //   backgroundColor: "yellow",
      marginTop: '10%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatName: {
      flex: 1,
    },
    chatImage: {
      height: StatusBarHeight * 1.5,
      width: StatusBarHeight * 1.5,
      marginRight: '3%',
    },
    userTextInputContainer: {
      position: 'absolute',
      backgroundColor: 'white',
      flexDirection: 'row',
      left: 0,
      marginHorizontal: '2%',
      paddingVertical: '2%',
      paddingBottom: '4%',
      bottom: '0%',
    },
    chatInput: {
      backgroundColor: '#F0F0F0',
      flex: 1,
      marginHorizontal: '2%',
      paddingVertical: '2%',
      paddingHorizontal: '3%',
      borderRadius: 15,
      fontSize: !!userChatMessage ? 16 : 14,
      // minHeight: "10%",
      maxHeight: dimensions.height * 0.2,
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
      backgroundColor: 'yellow',
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
      backgroundColor: '#F0F0F0',
      paddingVertical: '2%',
      paddingHorizontal: '3%',
      maxWidth: '85%',
      borderRadius: 10,
    },
    senderName: {
      fontSize: 10,
      marginHorizontal: '2%',
      marginVertical: '1%',
      fontWeight: 'bold',
      textTransform: 'capitalize',
    },
  });

  return (
    <View style={styles.mainDiv}>
      <View style={styles.pageHeadingContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name={'chevron-back'} size={30} color={'black'} />
        </TouchableOpacity>
        <Image
          source={require('../src/images/image.png')}
          style={styles.chatImage}
          borderRadius={22}
        />
        <Text style={styles.chatName}>{displayChatName}</Text>
        <TouchableOpacity style={styles.backButton}>
          <Icon name={'information-circle-outline'} size={30} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton}>
          <Icon name={'ellipsis-vertical'} size={25} color={'black'} />
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
        // data={[...chatContent].reverse()}
        ref={chatListRef}
        data={[...chatContent]}
        renderItem={renderChatItem}
        keyExtractor={(_, index) => index}
        style={styles.chatList}
        // inverted
        contentContainerStyle={styles.chatListContainer}
      />
      <View style={styles.userTextInputContainer}>
        <TouchableOpacity style={styles.inputButton}>
          <Icon name={'camera-outline'} size={25} color={'black'} />
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder={'Type something ..'}
          placeholderTextColor={'black'}
          value={userChatMessage}
          multiline
          onChangeText={setUserChatMessage}
        />
        <TouchableOpacity style={[styles.inputButton]}>
          <Icon name={'attach'} size={25} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inputButton, styles.sendButton]}
          onPress={sendMessage.bind(this, userChatMessage)}>
          <Icon name={'send'} size={25} color={'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
