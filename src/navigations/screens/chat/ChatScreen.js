import {
  StyleSheet,
  Platform,
  FlatList,
  Alert,
  BackHandler,
  View,
  Keyboard,
} from 'react-native';
import React, {useContext} from 'react';
import {commonStyles, dimensions, fontSize} from '../../../styles/commonStyles';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeMediaStatus,
  clearUserChat,
  removeUnseenChats,
  storeMessage,
  storeStranger,
} from '../../../../redux/chats/ChatSlice';
import {
  clearAllIndividualChats,
  sendLastSeen,
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
  openDocumentPicker,
  openMediaPickerModal,
} from '../../../components/MediaPickerOptionModal';
import {FirebaseStreamTaskContext} from '../../../../context/FirebaseStreamTaskContext';
import OptionModal from './OptionModal';
import ScreenNames from '../../../strings/ScreenNames';
import UploadingTrayComponent from './UploadingTrayComponent';
import IconButton from '../../../components/IconButton';
import firestore from '@react-native-firebase/firestore';
import BaseText from '../../../components/BaseText';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import {sendgpmsg, sendmsg} from '../../../../api/notification/NotificationReq';
import FloatingOptionModal from '../../../components/FloatingOptionModal';
import {getTokens} from '../../../../api/authentication/AuthenticationRequests';
import SearchPage from '../../../components/home/search/SearchPage';
import TextButton from '../../../components/TextButton';
import BaseModal from '../../../components/BaseModal';
import {BaseLoader} from '../../../components/LoadingPage';
import {changeUserDetails} from '../../../../redux/authentication/AuthenticationSlice';
import {
  blockUsersInDB,
  getStrangerInfoFromDB,
  unBlockUsersInDB,
} from '../../../../api/chat/ChatRequests';
import ImageView from 'react-native-image-viewing';

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
    searchDiv: {
      flexDirection: 'row',
      marginHorizontal: wp(7),
      marginVertical: hp(2),
      alignItems: 'center',
    },
  });

  const navigation = useNavigation();
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

  const displayChatName =
    chatName.length > 20 ? chatName.slice(0, 20) + ' ..' : chatName;

  const [userChatMessage, setUserChatMessage] = useState('');
  const [chatContent, setChatContent] = useState([]);

  const [isFileSendingTrayOpen, setIsFileSendingTrayOpen] = useState(false);
  const [optionModalVisibility, setOptionModalVisibility] = useState(false);
  const [showPickerOptions, setShowPickerOptions] = useState('');
  const taskContextRef = useContext(FirebaseStreamTaskContext);
  const [lastSeen, setLastSeen] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchArray, setSearchArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState();

  // console.log({lastSeen});

  const getInitialData = async () => {
    let response = await getStrangerInfoFromDB(userInfo.username);
    if (!!response.error) {
      Alert.alert('Oops', 'Error while getting user information.');
      console.log({responseErrUserInfo: response});
      navigation.navigate(ScreenNames.TopTabScreens.HomeScreen);
      return;
    }
    dispatch(storeStranger({userInfo: response.data}));
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    !!chatSliceRef.individualChats[userInfo.username] &&
    chatSliceRef.individualChats[userInfo.username].length != 0
      ? setChatContent([...chatSliceRef.individualChats[userInfo.username]])
      : setChatContent([]);
  }, [chatSliceRef.individualChats[userInfo.username]]);

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
      let unseenChats = chatSliceRef?.unseenChats?.[userInfo.username];
      // console.log({unseenChats});
      if (!!unseenChats && unseenChats.length != 0) {
        let sendRes = await sendLastSeen(
          currentUserInfo.username,
          userInfo.username,
          unseenChats[0],
        );

        if (!sendRes.isError) {
          dispatch(
            removeUnseenChats({
              username: userInfo.username,
              chatArray: unseenChats,
            }),
          );
        }
      }
      // unseenChats = unseenChats.filter(
      //   item => item.otherUser == userInfo.username,
      // );
      console.log({unseenChatsInChatScreen: unseenChats});
    };
    checkAndDeleteMessage();
  }, [chatSliceRef.unseenChats]);

  useEffect(() => {
    let seenListner = firestore()
      .collection('chats')
      .doc('individual')
      .collection(userInfo.username)
      .doc('lastSeen')
      .onSnapshot(res => {
        let response = res.data();
        if (!!response?.[currentUserInfo?.username]) {
          setLastSeen(response[currentUserInfo.username]);
        }
      });
    return () => seenListner();
  }, []);

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
      currentUserInfo.username + userInfo.username + message.length > 10
        ? message.slice(0, 10)
        : message + new Date().toString();
    let id = objToGenID.toString();

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
    if (!!response.isError || response.isBlocked) {
      return;
    }
    try {
      const getToken = await getTokens(userInfo.username);
      if (!getToken.isError && getToken?.data?.length != 0) {
        const sendNotification = sendgpmsg(
          getToken.data,
          currentUserInfo.username,
          'message',
          {},
          message,
        );
      }
    } catch (error) {
      console.log({errorInSendNoti: error});
    }

    // console.log({response});
  };

  const sendNoti = async type => {
    try {
      const getToken = await getTokens(userInfo.username);
      if (!getToken.isError && getToken?.data?.length != 0) {
        const sendNotification = sendgpmsg(
          getToken.data,
          currentUserInfo.username,
          type,
          {},
          `sent ${type}`,
        );
      }
    } catch (error) {
      console.log({errorInSendNoti: error});
    }
  };

  const sendMedia = async (type, assetsArray) => {
    try {
      // console.log({type, assetsArray});
      // Alert.alert(
      //   'Sorry !!',
      //   'This feature is in developement for the time being.',
      // );
      // return;
      setIsFileSendingTrayOpen(false);
      setShowPickerOptions('');
      assetsArray.forEach(async element => {
        let {filename} = element;
        if (!filename || filename == undefined || filename == 'undefined') {
          filename = element.path.split('/').reverse()[0];
        }
        let uploadedObj = await uploadFileToFirebase(
          element,
          `chats${type}/${currentUserInfo.username}/${userInfo.username}/${element.filename}`,
          taskContextRef,
          sendMediaMessage,
          userInfo.username,
          {
            filename,
            type,
          },
          sendNoti.bind(this, type),
        );
      });
    } catch (error) {
      console.log({erroInSendMed: error});
    }
  };

  const sendMediaMessage = async (mediaObj, type) => {
    // console.log({mediaObj});

    const mediaName = mediaObj.path.split('/').reverse()[0];
    // console.log({mediaName});
    let objToGenID =
      currentUserInfo.username +
      userInfo.username +
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
    };
    let receiverObject = {otherUser: userInfo.username};
    // console.log({chatObject});
    dispatch(storeMessage({chatObject, receiverObject}));
    const response = await sendMessageToFirestore(
      currentUserInfo.username,
      userInfo.username,
      {...chatObject},
    );
  };

  const openImagePicker = () => {
    setShowPickerOptions('photo');
  };

  const openVideoPicker = () => {
    setShowPickerOptions('video');
  };

  const openDocPicker = async () => {
    const response = await openDocumentPicker();
    if (!response.isError) {
      let sendRes = await sendMedia('documentFile', response.assetsArray);
    }
  };

  const handleDownload = (downloadObj, chatObj) => {
    dispatch(changeMediaStatus({downloadObj, chatObj}));
  };

  const goToInfo = () => {
    navigation.navigate(ScreenNames.ChatInfoScreen, {
      chatType: 'chat',
      username: userInfo.username,
    });
  };

  const clearAllChats = async () => {
    const response = await clearAllIndividualChats(
      currentUserInfo.username,
      userInfo.username,
    );
    console.log({clearresponse: response});
    if (!response.isError) {
      dispatch(clearUserChat({username: userInfo.username}));
      setOptionModalVisibility(false);
    }
  };

  const showClearConfirm = () => {
    Alert.alert('Are you sure ?', 'Clear all chat.', [
      {
        text: 'Yes, Clear all',
        style: 'destructive',
        onPress: clearAllChats,
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const searchInChats = text => {
    setSearchText(text);
    if (!text) {
      setSearchArray([]);
      return;
    }
    let filteredItems = [];
    chatContent.map(item => {
      let lowerText = item?.message?.toString()?.toLowerCase();
      if (
        item.message.includes(text) ||
        (!!lowerText && !!lowerText?.includes(text?.toLowerCase()))
      ) {
        filteredItems.push(item.id);
      }
    });
    console.log({filteredItems});
    setSearchArray(filteredItems);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchArray([]);
    Keyboard.dismiss();
  };

  const RenderChatComp = ({item, index, chatArray, searchArray}) => (
    <>
      {lastSeen?.id == item?.id && (
        <View
          style={{
            alignSelf: 'flex-end',
            marginRight: wp(1),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButton
            name={'eye'}
            size={15}
            containerStyle={{
              marginHorizontal: wp(1),
            }}
            color={themeRef.colors.appThemeColor}
          />
          <BaseText
            size={fontSize.tiny}
            weight={fontWeights.bold}
            color={themeRef.colors.appThemeColor}>
            Seen
          </BaseText>
        </View>
      )}
      <ChatMessageComponent
        {...{
          item,
          index,
          chatArray,
          currentUserInfo,
          themeRef,
          isGroup: false,
          handleDownload,
          chatSliceRef,
          lastSeen,
          searchArray,
          onImagePress: res => setShowImage(res),
        }}
      />
    </>
  );

  const block = async () => {
    setIsLoading('Updating records ..');
    const response = await blockUsersInDB(currentUserInfo.username, [
      userInfo.username,
    ]);
    if (!response.isError) {
      dispatch(changeUserDetails({userDetails: {blocked: response.data}}));
    }
    console.log({block: response});
    setIsLoading('');
  };

  const unblock = async () => {
    setIsLoading('Please wait ..');
    const response = await unBlockUsersInDB(
      currentUserInfo.username,
      userInfo.username,
    );
    if (!!response.isError && response.error != 'noData') {
      setIsLoading('');
      return;
    }
    console.log({unBlockUser: response});
    dispatch(
      changeUserDetails({
        userDetails: {
          blocked: response?.data?.length != 0 ? response?.data : [],
        },
      }),
    );
    setIsLoading('');
  };

  const showConfirm = action => {
    // setOptionModalVisibility(false);
    setIsSearching(false);
    Alert.alert(
      'Are you sure ?',
      action == 'block' ? 'Want to block user?' : 'Want to Unblock user?',
      [
        {
          text: action == 'block' ? 'Yes, block' : 'Yes, Unblock',
          style: 'destructive',
          onPress: action == 'block' ? block : unblock,
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  return (
    <>
      <OptionModal
        cancelColor={themeRef.colors.errorColor}
        modalVisibility={optionModalVisibility}
        setModalVisibility={setOptionModalVisibility}
        themeRef={themeRef}
        clearAllChats={showClearConfirm}
        onSearchPress={() => {
          setOptionModalVisibility(false);
          setIsSearching(true);
        }}
        onBlockPress={
          !currentUserInfo?.blocked?.includes(userInfo.username)
            ? showConfirm.bind(this, 'block')
            : showConfirm.bind(this, 'unblock')
        }
        isBlocked={!!currentUserInfo?.blocked?.includes(userInfo.username)}
        // isSelectionMode={true}
      />
      <BaseModal visibility={isLoading}>
        <BaseLoader loadingText="Please wait .." dark={themeRef.dark} />
      </BaseModal>
      <MediaPickerOptionModal
        afterChoosehandler={res => {
          sendMedia(showPickerOptions, res);
        }}
        closeActions={() => setShowPickerOptions()}
        selectionLimit={3}
        mediaType={showPickerOptions}
        visibility={!!showPickerOptions}
      />
      {/* <ReviewModal for image
        type={showPickerOptions}
        visibility={assetsArray.length != 0}
      /> */}
      <SafeAreaView style={[commonStyles.screenStyle, styles.mainDiv]}>
        <ChatScreenHeaderComponent
          displayChatName={displayChatName}
          onChatNamePress={goToInfo}
          optionButtonVisibility={chatContent.length != 0}
          onInfoPress={() => {}}
          onOptionPress={() => {
            setOptionModalVisibility(true);
          }}
          chatProfilePhoto={
            !!chatSliceRef?.friends[userInfo.username]?.profilePhoto
              ? {uri: chatSliceRef?.friends[userInfo.username]?.profilePhoto}
              : !!chatSliceRef?.strangers[userInfo.username]?.profilePhoto
              ? {uri: chatSliceRef?.strangers[userInfo.username]?.profilePhoto}
              : imageUrlStrings.profileSelected
          }
        />

        {!!isSearching && (
          <View style={styles.searchDiv}>
            <SearchPage
              searchText={searchText}
              clearSearch={clearSearch}
              onChangeText={searchInChats}
              mainContainerStyle={{
                flex: 1,
                marginRight: !searchText ? wp(5) : 0,
                // backgroundColor: 'red',
              }}
              showSideSearchCount={true}
              searchCounts={searchArray.length}
            />

            {!searchText && (
              <TextButton
                title={'Cancel'}
                textStyle={{
                  color: themeRef.colors.errorColor,
                }}
                onPress={() => {
                  setSearchText('');
                  setSearchArray([]);
                  setIsSearching(false);
                }}
              />
            )}
          </View>
        )}

        <NoChatAnimatedCompoenet
          visibility={chatContent.length == 0}
          themeRef={themeRef}
        />

        <KeyboardAvoidingView
          style={[styles.chatListWrapperContainer]}
          behavior={Platform.OS == 'android' ? 'height' : 'padding'}>
          <FlatList
            data={[...chatContent]}
            renderItem={
              ({item, index}) =>
                RenderChatComp({
                  item,
                  index,
                  chatArray: [...chatContent],
                  searchArray,
                })
              // <RenderChatComp
              //   item={item}
              //   index={index}
              //   chatArray={[...chatContent]}
              //   searchArray={searchArray}
              // />
              // )
            }
            keyExtractor={(_, index) => index}
            style={styles.chatList}
            inverted
            contentContainerStyle={styles.chatListContainer}
            showsVerticalScrollIndicator={false}
          />

          {!!authenticationSliceRef?.user?.blocked &&
            authenticationSliceRef?.user?.blocked?.includes(
              userInfo.username,
            ) && (
              <BaseText
                otherStyles={{alignSelf: 'center'}}
                color={themeRef.colors.errorColor}
                weight={fontWeights.semiBold}>
                You blocked this user
              </BaseText>
            )}

          <UploadingTrayComponent username={userInfo.username} />

          <FileSharingTrayComponent
            visibility={isFileSendingTrayOpen}
            setterFunc={setIsFileSendingTrayOpen}
            onImagePress={openImagePicker}
            onVideoPress={openVideoPicker}
            onDocPress={openDocPicker}
          />

          {!isSearching && (
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
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};
