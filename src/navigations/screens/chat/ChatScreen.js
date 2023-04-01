import {StyleSheet, Platform, FlatList, Alert} from 'react-native';
import React from 'react';
import {commonStyles, dimensions} from '../../../styles/commonStyles';
import {useEffect} from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {storeMessage} from '../../../../redux/chats/ChatSlice';
import {sendMessageToFirestore} from '../../../../api/chat/firebaseSdkRequests';
import {useNetInfo} from '@react-native-community/netinfo';
import {KeyboardAvoidingView} from 'react-native';
import ChatScreenHeaderComponent from './ChatScreenHeaderComponent';
import ChatMessageComponent from './ChatMessageComponent';
import NoChatAnimatedCompoenet from './NoChatAnimatedComponent';
import FileSharingTrayComponent from './FileSharingTrayComponent';
import ChatTextInputContainer from './ChatTextInputContainer';

export default ChatScreen = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      paddingHorizontal: 0,
      paddingTop: hp(0.5),
    },
    chatListWrapperContainer: {
      flex: 1,
      marginTop: hp(1),
    },
    chatList: {
      flex: 1,
      marginBottom: hp(1),
    },
    chatListContainer: {
      marginHorizontal: wp(4),
    },
  });

  const route = useRoute();
  const userInfo = !!route.params && route.params.userInfo;
  const chatName =
    !!route.params && !!route.params.chatName
      ? route.params.chatName
      : 'Unknown';

  const dispatch = useDispatch();
  const chatSliceRef = useSelector(state => state.chatSlice);
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );
  const currentUserInfo = authenticationSliceRef.user;
  const connectionInfo = useNetInfo();

  const [displayChatName, setDisplayChatName] = useState(
    chatName.length > 20 ? chatName.slice(0, 20) + ' ..' : chatName,
  );
  const [userChatMessage, setUserChatMessage] = useState('');
  const [chatContent, setChatContent] = useState([]);

  const [isFileSendingTrayOpen, setIsFileSendingTrayOpen] = useState(false);

  useEffect(() => {
    !!chatSliceRef.individualChats[userInfo.username] &&
    chatSliceRef.individualChats[userInfo.username].length != 0
      ? setChatContent([...chatSliceRef.individualChats[userInfo.username]])
      : setChatContent([]);
  }, [chatSliceRef.individualChats[userInfo.username]]);

  useEffect(() => {
    const checkAndDeleteMessage = async () => {
      let {unseenChats} = chatSliceRef;
      // unseenChats = unseenChats.filter(
      //   item => item.otherUser == userInfo.username,
      // );
      console.log({unseenChatsInChatScreen: unseenChats});
    };
    checkAndDeleteMessage();
  }, [chatSliceRef.unseenChats]);

  const sendMessage = async message => {
    if (!message) {
      Alert.alert('Oops', 'Write something to send ..');
      return;
    }
    if (!connectionInfo.isConnected) {
      Alert.alert('Oops', 'You are not connected to internet ..');
      return;
    }
    setUserChatMessage('');

    let objToGenID = {
      su: currentUserInfo.username,
      ru: userInfo.username,
      m: message.length > 10 ? message.slice(0, 10) : message,
      t: new Date().toString(),
    };
    let id = JSON.stringify(objToGenID);

    let chatObject = {
      from: currentUserInfo.username,
      date: new Date().toString(),
      message,
      isSending: true,
      id,
    };
    let receiverObject = {otherUser: userInfo.username};
    // console.log({chatObject});
    dispatch(storeMessage({chatObject, receiverObject}));
    const response = await sendMessageToFirestore(
      currentUserInfo.username,
      userInfo.username,
      {...chatObject},
    );
    // console.log({response});
  };

  const RenderChatComp = ({item, index, chatArray}) => (
    <ChatMessageComponent
      {...{item, index, chatArray, currentUserInfo, themeRef, isGroup: false}}
    />
  );

  return (
    <SafeAreaView style={[commonStyles.screenStyle, styles.mainDiv]}>
      <ChatScreenHeaderComponent
        displayChatName={displayChatName}
        onInfoPress={() => {}}
        onOptionPress={() => {}}
        chatProfilePhoto={{}}
      />
      <NoChatAnimatedCompoenet
        visibility={chatContent.length == 0}
        themeRef={themeRef}
      />

      <KeyboardAvoidingView
        style={[styles.chatListWrapperContainer]}
        behavior={Platform.OS == 'android' ? 'height' : 'padding'}>
        <FlatList
          data={[...chatContent]}
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

        <FileSharingTrayComponent
          visibility={isFileSendingTrayOpen}
          setterFunc={setIsFileSendingTrayOpen}
        />

        <ChatTextInputContainer
          userChatMessage={userChatMessage}
          setUserChatMessage={setUserChatMessage}
          toggleFileTray={() => setIsFileSendingTrayOpen(pre => !pre)}
          isFileSendingTrayOpen={isFileSendingTrayOpen}
          sendMessage={sendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
