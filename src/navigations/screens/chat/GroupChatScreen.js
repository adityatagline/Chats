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
  storeGroups,
  storeMessage,
  storeMessageToGroup,
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
import ScreenNames from '../../../strings/ScreenNames';
import {getGroupInfo, getGroupsOfUser} from '../../../../api/chat/ChatRequests';

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

  const navigation = useNavigation();
  const route = useRoute();
  const groupId = !!route.params && route.params.groupId;
  const chatName =
    !!route.params && !!route.params.chatName
      ? route.params.chatName
      : 'Unknown';

  const dispatch = useDispatch();
  const chatSliceRef = useSelector(state => state.chatSlice);
  // console.log({chatSliceRef});
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

  const [isMember, setIsMember] = useState(true);

  const getInitialData = async () => {
    let response = await getGroupsOfUser(currentUserInfo.username);
    if (!response.isError) {
      dispatch(storeGroups({groups: response.data}));
      return;
    }
    // setIsMember(false);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    if (!!chatSliceRef.groups[groupId]) {
      const groupInfo = chatSliceRef?.groups?.[groupId];
      const checkMember = !!groupInfo?.members?.[currentUserInfo.username];
      // alert(checkMember);
      setIsMember(!!checkMember);
    }
  }, [chatSliceRef.groups]);

  useEffect(() => {
    !!chatSliceRef.individualChats[groupId] &&
    chatSliceRef.individualChats[groupId].length != 0
      ? setChatContent([...chatSliceRef.individualChats[groupId]])
      : setChatContent([]);
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

    let objToGenID =
      currentUserInfo.username + groupId + message.length > 10
        ? message.slice(0, 10)
        : message + new Date().toString();
    let id = objToGenID.toString();

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
    // console.log({type, assetsArray});
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
    let mediaName = mediaObj.path.split('/').reverse()[0];
    let objToGenID =
      currentUserInfo.username +
      groupId +
      mediaName
        .replaceAll(' ', '')
        .replaceAll(':', '')
        .replaceAll('/', '')
        .replaceAll('.', '') +
      new Date().toString();
    let id = objToGenID.toString();
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
    dispatch(
      storeMessageToGroup({
        message: chatObject,
        groupInfo: chatSliceRef.groups[groupId],
        userInfo: authenticationSliceRef.user,
      }),
    );
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
    Alert.alert('In Progress');
    // dispatch(changeMediaStatus({downloadObj, chatObj}));
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

  const goToInfo = () => {
    navigation.navigate(ScreenNames.GroupChatInfoScreen, {
      groupId,
    });
  };

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
          displayChatName={chatSliceRef.groups[groupId].name}
          onChatNamePress={goToInfo}
          onInfoPress={() => {}}
          onOptionPress={() => {}}
          chatProfilePhoto={chatSliceRef.groups[groupId].profilePhoto}
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
