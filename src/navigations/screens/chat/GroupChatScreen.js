import {StyleSheet, Platform, FlatList, Alert, BackHandler} from 'react-native';
import React, {useContext} from 'react';
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
import {
  changeMediaStatus,
  storeMessage,
} from '../../../../redux/chats/ChatSlice';
import {
  sendGPMessageToFB,
  sendMessageToFirestore,
  uploadFileToFirebase,
} from '../../../../api/chat/firebaseSdkRequests';
import {useNetInfo} from '@react-native-community/netinfo';
import {KeyboardAvoidingView} from 'react-native';
import ChatScreenHeaderComponent from './ChatScreenHeaderComponent';
import ChatMessageComponent from './ChatMessageComponent';
import NoChatAnimatedCompoenet from './NoChatAnimatedComponent';
import FileSharingTrayComponent from './FileSharingTrayComponent';
import ChatTextInputContainer from './ChatTextInputContainer';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import MediaPickerOptionModal, {
  openMediaPickerModal,
} from '../../../components/MediaPickerOptionModal';
import {array} from 'yup';
import IconButton from '../../../components/IconButton';
import {openPicker} from 'react-native-image-crop-picker';
import {FirebaseStreamTaskContext} from '../../../../context/FirebaseStreamTaskContext';
import UploadingTrayComponent from './UploadingTrayComponent';

const GroupChatScreen = () => {
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
  const groupId = !!route.params && route.params.groupId;
  const chatName =
    !!route.params && !!route.params.chatName
      ? route.params.chatName
      : 'Unknown';

  const dispatch = useDispatch();
  const chatSliceRef = useSelector(state => state.chatSlice);
  console.log({chatSliceRef});
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
  const [showPickerOptions, setShowPickerOptions] = useState('');
  const taskContextRef = useContext(FirebaseStreamTaskContext);
  // console.log({chatContent});
  // console.log({chats: chatSliceRef.individualChats});

  useEffect(() => {
    !!chatSliceRef.individualChats[groupId] &&
    chatSliceRef.individualChats[groupId].length != 0
      ? setChatContent([...chatSliceRef.individualChats[groupId]])
      : setChatContent([]);
    // console.log({gPChat: chatSliceRef});
  }, [chatSliceRef.individualChats[groupId]]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // console.log({showPickerOptions, isFileSendingTrayOpen});
        if (!!showPickerOptions || !!isFileSendingTrayOpen) {
          // console.log('running');
          !!showPickerOptions
            ? setShowPickerOptions('')
            : !!isFileSendingTrayOpen
            ? setIsFileSendingTrayOpen(false)
            : null;
          return true;
        } else {
          return false;
        }
      },
    );
    return () => backHandler.remove();
  }, [showPickerOptions, isFileSendingTrayOpen]);

  useEffect(() => {
    const checkAndDeleteMessage = async () => {
      let {unseenChats} = chatSliceRef;
      // unseenChats = unseenChats.filter(
      //   item => item.otherUser == userInfo.username,
      // );
      // console.log({unseenChatsInChatScreen: unseenChats});
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
      groupId,
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
      groupId,
    };
    // let receiverObject = {otherUser: userInfo.username};
    // // console.log({chatObject});
    // dispatch(storeMessage({chatObject, receiverObject}));
    const response = await sendGPMessageToFB(groupId, chatObject, false);
    // console.log({response});
  };

  const sendMedia = async (type, assetsArray) => {
    console.log({type, assetsArray});
    setIsFileSendingTrayOpen(false);
    setShowPickerOptions('');
    assetsArray.forEach(async element => {
      let {filename} = element;
      if (!filename || filename == undefined || filename == 'undefined') {
        filename = element.path.split('/').reverse()[0];
      }
      let uploadedObj = await uploadFileToFirebase(
        element,
        `chats${type}/groups/${groupId}/${element.filename}`,
        taskContextRef,
        sendMediaMessage,
        groupId,
        {
          filename,
          type,
        },
      );
    });
  };

  const sendMediaMessage = async (mediaObj, type) => {
    // console.log({mediaObj});
    const mediaName = mediaObj.path.split('/').reverse()[0];
    // console.log({mediaName});
    let objToGenID = {
      su: currentUserInfo.username,
      ru: groupId,
      m: mediaName,
      t: new Date().toString(),
    };
    let id = JSON.stringify(objToGenID);
    let chatObject = {
      from: currentUserInfo.username,
      date: new Date().toString(),
      mediaName,
      uri: mediaObj.uri,
      isSending: true,
      id,
      message: '',
      mediaType: type,
      groupId,
    };
    // let receiverObject = {otherUser: userInfo.username};
    // console.log({chatObject});
    // dispatch(storeMessage({chatObject, receiverObject}));
    const response = await sendGPMessageToFB(groupId, chatObject, false);
  };

  const openImagePicker = () => {
    setShowPickerOptions('photo');
  };

  const openVideoPicker = () => {
    setShowPickerOptions('video');
  };

  const handleDownload = (downloadObj, chatObj) => {
    // console.log({downloadObj, chatObj});
    dispatch(changeMediaStatus({downloadObj, chatObj}));
  };

  const RenderChatComp = ({item, index, chatArray}) => (
    <ChatMessageComponent
      {...{
        item,
        index,
        chatArray,
        currentUserInfo,
        themeRef,
        isGroup: true,
        handleDownload,
        chatSliceRef,
      }}
    />
  );

  // console.log({
  //   chatContent,
  // });

  return (
    <>
      <MediaPickerOptionModal
        afterChoosehandler={res => {
          sendMedia(showPickerOptions, res);
        }}
        closeActions={() => setShowPickerOptions()}
        selectionLimit={3}
        mediaType={showPickerOptions}
        visibility={!!showPickerOptions}
      />
      {/* <ReviewModal
        type={showPickerOptions}
        visibility={assetsArray.length != 0}
      /> */}
      <SafeAreaView style={[commonStyles.screenStyle, styles.mainDiv]}>
        <ChatScreenHeaderComponent
          displayChatName={displayChatName}
          onInfoPress={() => {}}
          onOptionPress={() => {}}
          chatProfilePhoto={
            // !!chatSliceRef?.friends[userInfo.username]?.profilePhoto
            //   ? {uri: chatSliceRef?.friends[userInfo.username]?.profilePhoto}
            //   : !!chatSliceRef?.strangers[userInfo.username]?.profilePhoto
            //   ? {uri: chatSliceRef?.strangers[userInfo.username]?.profilePhoto}
            //   :
            imageUrlStrings.profileSelected
          }
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
            showsVerticalScrollIndicator={false}
          />

          <UploadingTrayComponent username={groupId} />

          <FileSharingTrayComponent
            visibility={isFileSendingTrayOpen}
            setterFunc={setIsFileSendingTrayOpen}
            onImagePress={openImagePicker}
            onVideoPress={openVideoPicker}
          />

          <ChatTextInputContainer
            userChatMessage={userChatMessage}
            setUserChatMessage={setUserChatMessage}
            toggleFileTray={() => setIsFileSendingTrayOpen(pre => !pre)}
            isFileSendingTrayOpen={isFileSendingTrayOpen}
            sendMessage={sendMessage}
            onPressCamera={async () => {
              let photoObj = await openMediaPickerModal('camera', 'photo', 1);
              let upload = await sendMedia('photo', photoObj);
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default GroupChatScreen;
