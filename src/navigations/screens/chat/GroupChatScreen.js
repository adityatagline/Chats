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
import {useRef} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  addInGpChat,
  changeMediaStatus,
  clearUserChat,
  storeGroups,
  storeMessage,
  storeMessageToGroup,
  updateGroup,
} from '../../../../redux/chats/ChatSlice';
import {
  clearAllGroupChats,
  clearAllIndividualChats,
  sendGPLastSeen,
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
  openDocumentPicker,
  openMediaPickerModal,
} from '../../../components/MediaPickerOptionModal';
import {array} from 'yup';
import IconButton from '../../../components/IconButton';
import {openPicker} from 'react-native-image-crop-picker';
import {FirebaseStreamTaskContext} from '../../../../context/FirebaseStreamTaskContext';
import UploadingTrayComponent from './UploadingTrayComponent';
import ScreenNames from '../../../strings/ScreenNames';
import {
  getGroupInfo,
  getGroupsOfUser,
  getStrangerInfoFromDB,
} from '../../../../api/chat/ChatRequests';
import firestore from '@react-native-firebase/firestore';
import BaseText from '../../../components/BaseText';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import {getTokens} from '../../../../api/authentication/AuthenticationRequests';
import {sendgpmsg} from '../../../../api/notification/NotificationReq';
import TextButton from '../../../components/TextButton';
import SearchPage from '../../../components/home/search/SearchPage';
import OptionModal from './OptionModal';

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
    searchDiv: {
      flexDirection: 'row',
      marginHorizontal: wp(7),
      marginVertical: hp(2),
      alignItems: 'center',
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
  // console.log({chatSliceRef: chatSliceRef.unseenChats});
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
  const [lastSeen, setLastSeen] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchArray, setSearchArray] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [optionModalVisibility, setOptionModalVisibility] = useState(false);
  // console.log({lastSeen});

  const getInitialData = async () => {
    let response = await getGroupsOfUser(currentUserInfo.username);
    if (!!response.isError) {
      return;
    }
    console.log({groupsUser: response.data});
    dispatch(storeGroups({groups: response.data}));

    // setIsMember(false);
  };

  useEffect(() => {
    if (!!groupId) {
      // getInitialData();
      const seenListner = firestore()
        .collection('groupChats')
        .doc(groupId)
        .collection('lastSeen')
        .onSnapshot(res => {
          const changeArr = res.docChanges();
          changeArr.forEach(element => {
            const {id} = element.doc;

            setLastSeen(pre => {
              return {...pre, [id]: element.doc.data()};
            });
          });
        });
      return () => seenListner();
    }
  }, [groupId]);

  // useEffect(() => {
  //   if (!!chatSliceRef.groups[groupId]) {
  //     const groupIN = chatSliceRef?.groups?.[groupId];
  //     const checkMember = !!groupIN?.members?.[currentUserInfo.username];
  //     // alert(checkMember);
  //     setIsMember(!!checkMember);
  //   }
  // }, [chatSliceRef.groups]);

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
      let unseenChats = chatSliceRef.unseenChats[groupId];
      // dispatch(addInGpChat({groupId}));
      await sendGPLastSeen(currentUserInfo.username, groupId, unseenChats[0]);
      console.log({'unseenChats[0]': unseenChats[0]});
    };
    checkAndDeleteMessage();
  }, [chatSliceRef.unseenChats]);

  const sendMessage = async message => {
    try {
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
        members: chatSliceRef.groups[groupId].memberUsernames,
      };
      // let receiverObject = {otherUser: userInfo.username};
      // // console.log({chatObject});
      // dispatch(storeMessage({chatObject, receiverObject}));
      const response = await sendGPMessageToFB(groupId, chatObject, false);
      console.log({memb: chatSliceRef?.groups?.[groupId]?.memberUsernames});

      try {
        let tokenArray = [];
        let mems = chatSliceRef?.groups?.[groupId]?.memberUsernames;
        for (let i = 0; i < mems.length; i++) {
          const uname = mems[i];
          console.log({uname});
          const getToken = await getTokens(uname);
          if (!getToken.isError) {
            console.log({tokenArr: getToken.data});
            tokenArray = [...tokenArray, ...getToken.data];
          }
        }

        console.log({tokenArray});
        if (tokenArray?.length != 0) {
          console.log('sending notis', tokenArray);
          const sendNotification = sendgpmsg(
            tokenArray,
            chatSliceRef?.groups?.[groupId]?.name,
            'message',
            {},
            `${currentUserInfo.username}:${message}`,
          );
        }
      } catch (error) {
        console.log({errorInSendNoti: error});
      }
      // console.log({response});
    } catch (error) {
      console.log({errorInGPSEND: error});
    }
  };

  const sendNoti = async type => {
    try {
      let tokenArray = [];
      let mems = chatSliceRef?.groups?.[groupId]?.memberUsernames;
      for (let i = 0; i < mems.length; i++) {
        const uname = mems[i];
        console.log({uname});
        const getToken = await getTokens(uname);
        if (!getToken.isError) {
          console.log({tokenArr: getToken.data});
          tokenArray = [...tokenArray, ...getToken.data];
        }
      }
      console.log({tokenArray});
      if (tokenArray?.length != 0) {
        console.log('sending notis', tokenArray);
        const sendNotification = sendgpmsg(
          tokenArray,
          chatSliceRef?.groups?.[groupId]?.name,
          'message',
          {},
          `${currentUserInfo.username}:Sent ${type}`,
        );
      }
    } catch (error) {
      console.log({errorInSendNoti: error});
    }
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
        sendNoti.bind(this, type),
      );
    });
  };

  const sendMediaMessage = async (mediaObj, type) => {
    try {
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
        members: chatSliceRef.groups[groupId].memberUsernames,
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
    } catch (error) {
      console.log({errorInSENDMED: error});
    }
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
    // console.log({downloadObj, chatObj});
    Alert.alert('In Progress');
    // dispatch(changeMediaStatus({downloadObj, chatObj}));
  };

  const RenderChatComp = ({item, index, chatArray, searchArray}) => {
    let seenMemberString = '';
    if (!!lastSeen) {
      for (const username in lastSeen) {
        if (
          lastSeen[username].id == item.id &&
          username != currentUserInfo.username
        ) {
          seenMemberString += username + ' ,';
        }
      }
    }
    seenMemberString = !!seenMemberString
      ? seenMemberString.slice(0, seenMemberString.length - 2)
      : '';
    return (
      <>
        {!!seenMemberString && (
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: wp(1),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconButton
              name={'eye'}
              size={15}
              containerStyle={{
                marginHorizontal: wp(1),
              }}
            />
            <BaseText size={fontSize.tiny} weight={fontWeights.bold}>
              Seen by {seenMemberString}
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
            isGroup: true,
            handleDownload,
            chatSliceRef,
            searchArray,
          }}
        />
      </>
    );
  };

  const goToInfo = () => {
    navigation.navigate(ScreenNames.GroupChatInfoScreen, {
      groupId,
    });
  };

  const clearAllChats = async () => {
    const response = await clearAllGroupChats(
      currentUserInfo.username,
      groupId,
    );
    console.log({clearresponse: response});
    if (!response.isError) {
      dispatch(clearUserChat({username: groupId}));
      setOptionModalVisibility(false);
    }
  };

  const searchInChats = text => {
    setSearchText(text);
    if (!text) {
      setSearchArray([]);
      return;
    }
    let filteredItems = [];
    chatContent.map(item => {
      if (item?.messageType == 'announcement') {
        return;
      }
      if (item.message.includes(text)) {
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

  // console.log({
  //   chatContent,
  // });

  return (
    <>
      <OptionModal
        cancelColor={themeRef.colors.errorColor}
        modalVisibility={optionModalVisibility}
        setModalVisibility={setOptionModalVisibility}
        themeRef={themeRef}
        clearAllChats={clearAllChats}
        onSearchPress={() => {
          setOptionModalVisibility(false);
          setIsSearching(true);
        }}
      />
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
          displayChatName={chatSliceRef?.groups[groupId]?.name ?? chatName}
          onChatNamePress={goToInfo}
          onInfoPress={() => {}}
          onOptionPress={() => {
            setOptionModalVisibility(true);
          }}
          chatProfilePhoto={chatSliceRef?.groups[groupId]?.profilePhoto}
          optionButtonVisibility={chatContent.length != 0}
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
            renderItem={({item, index}) => (
              <RenderChatComp
                item={item}
                index={index}
                chatArray={[...chatContent]}
                searchArray={searchArray}
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
            onDocPress={openDocPicker}
          />

          {/* {console.log({
            mem: chatSliceRef?.groups?.[groupId],
            curUser: currentUserInfo.username,
          })} */}
          {!!chatSliceRef?.groups?.[groupId]?.members[
            currentUserInfo.username
          ] ? (
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
          ) : (
            <BaseText
              size={fontSize.big}
              weight={fontWeights.bold}
              color={themeRef.colors.errorColor}
              otherStyles={{
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              You left the group.
            </BaseText>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default GroupChatScreen;
