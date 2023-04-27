import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppStatusBar} from '../../../components/AppStatusBar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SearchPage from '../../../components/home/search/SearchPage';
import HomepageChatsPage from '../../../components/home/HomepageChatsPage';
import {
  StatusBarHeight,
  commonStyles,
  fontSize,
} from '../../../styles/commonStyles';
import {
  checkIsMember,
  getGroupInfo,
  getGroupsOfUser,
  getStrangerInfoFromDB,
  getUserHomepageChats,
} from '../../../../api/chat/ChatRequests';
import firestore from '@react-native-firebase/firestore';
import {
  checkAndStoreNewMessages,
  clearUserChat,
  storeGroups,
  storeMessageToGroup,
  storeStranger,
} from '../../../../redux/chats/ChatSlice';
import {askPermissionAsync, getContacts} from '../NewChatPage';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import {checkAndDeleteMessage} from '../../../../api/chat/firebaseSdkRequests';
import IonIcon from 'react-native-vector-icons/Ionicons';
import BaseText from '../../../components/BaseText';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import ScreenNames from '../../../strings/ScreenNames';
import notifee from '@notifee/react-native';
import {logout} from '../../../../redux/authentication/AuthenticationSlice';
import {storeUserDataInRedux} from '../../../../redux/authentication/AuthenticationSlice';
import {sendmsg} from '../../../../api/notification/NotificationReq';
import {changePassword} from '../../../../api/authentication/AuthenticationRequests';
import SearchList from '../../../components/home/search/SearchList';

export default HomeScreen = props => {
  const themeRef = useTheme();
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const chatSliceRef = useSelector(state => state.chatSlice);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [messageToBedeleted, setMessageToBedeleted] = useState([]);
  const [strangerArray, setStrangerArray] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchArray, setSearchArray] = useState([
    // {
    //   from: 'Aditya',
    //   date: 'Wed Apr 26 2023 11:37:52 GMT+0530 (India Standard Time)',
    //   message: 'Hi',
    //   isSending: true,
    //   id: 'HiWed Apr 26 2023 11:37:52 GMT+0530 (India Standard Time)',
    //   otherUser: 'Developer',
    //   chatName: 'Me Personal',
    // },
  ]);
  // console.log({individualChats: chatSliceRef.homepageChats});

  useEffect(() => {
    setisLoading(true);
    isFocused && getInitialData();
    isFocused && props.setterFunction(route.name);
    // dispatch(clearUserChat({username: 'Kate'}));
  }, [isFocused]);

  useEffect(() => {
    if (!chatSliceRef.friends) {
      return;
    }
    try {
      const firestoreListner = firestore()
        .collection('chats')
        .doc('individual')
        .collection(authenticationSlice.user.username)
        .onSnapshot(res => {
          const docChanges = res.docChanges();
          // console.log({docChanges});
          let arrayToCheck = [];
          let usersArray = [];
          docChanges.forEach(item => {
            const data = item.doc.data();
            const {id} = item.doc;
            if (id == 'lastSeen') {
              return;
            }
            arrayToCheck.push({
              ...data,
            });
            // console.log({data, strangerArray});
            if (
              !chatSliceRef.friends?.[data.otherUser] &&
              !strangerArray.includes(data.otherUser) &&
              !usersArray.includes(data.otherUser)
            ) {
              usersArray.push(data.otherUser);
            }
          });
          usersArray.forEach(userOfChats => {
            if (!strangerArray.includes(userOfChats)) {
              setStrangerArray(pre => [...pre, userOfChats]);
            }
          });
          dispatch(
            checkAndStoreNewMessages({
              messageArray: [...arrayToCheck],
              userInfo: {...authenticationSlice.user},
            }),
          );
          setMessageToBedeleted([...arrayToCheck]);
        });

      getStarngersUserInfo([...strangerArray]);

      return () => firestoreListner();
    } catch (error) {}
  }, [strangerArray, chatSliceRef.friends]);

  useEffect(() => {
    // console.log('running');
    // console.log({gp: chatSliceRef.groups});

    try {
      // console.log('running 2');
      const gpChatListner = firestore()
        .collection('groupChats')
        .onSnapshot(async res => {
          for (let i = 0; i < res.docChanges().length; i++) {
            let obj = res?.docChanges()[i]?.doc?.data();

            let messageArray = [];
            for (const key in obj) {
              messageArray.push(obj[key]);
            }
            messageArray.forEach(async element => {
              // console.log({
              //   con: !element?.members?.includes(
              //     authenticationSlice?.user?.username,
              //   ),
              // });
              if (
                !element?.members?.includes(authenticationSlice?.user?.username)
              ) {
                return;
              }
              // let response = await checkIsMember(
              //   authenticationSlice.user.username,
              //   element.groupId,
              // );
              // // console.log({checkRes: response});
              // if (response.isError || !response?.data?.isMember) {
              //   return;
              // }
              let groupInfo = await getGroupInfo(element.groupId);
              if (!groupInfo.isError) {
                dispatch(
                  storeMessageToGroup({
                    message: element,
                    groupInfo: groupInfo.data,
                    userInfo: authenticationSlice.user,
                  }),
                );
              }
            });
          }
        });
      return () => gpChatListner();
    } catch (error) {}
  }, []);

  useEffect(() => {
    const deleteMessages = async () => {
      await checkAndDeleteMessage(
        [...messageToBedeleted],
        authenticationSlice.user.username,
      );
    };

    if (messageToBedeleted.length != 0) {
      deleteMessages();
    }
  }, [messageToBedeleted]);

  const getStarngersUserInfo = async userArrayOfStranger => {
    if (userArrayOfStranger.length == 0) {
      return;
    }
    userArrayOfStranger.forEach(async element => {
      const response = await getStrangerInfoFromDB(element);
      // console.log({responseFormFb: response, userArrayOfStranger, element});
      if (
        !response.isError &&
        !!response.data &&
        !chatSliceRef?.strangers[element] &&
        !!element
      ) {
        // console.log('runnning for dispatch');
        dispatch(storeStranger({userInfo: response.data}));
      }
    });
  };
  const getInitialData = async () => {
    Platform.OS == 'android' &&
      (await askPermissionAsync(
        undefined,
        undefined,
        dispatch,
        authenticationSlice.user,
      ));
    Platform.OS == 'ios' &&
      (await getContacts(
        undefined,
        undefined,
        dispatch,
        authenticationSlice.user,
      ));
    // console.log('running getInitialData');
    let response = await getGroupsOfUser(authenticationSlice.user.username);
    console.log({getGroupsOfUser: response});
    if (!response.isError) {
      dispatch(storeGroups({groups: response.data}));
      setisLoading(false);
    }
    setisLoading(false);
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      paddingTop: hp(1.5) + StatusBarHeight,
    },
    searchDiv: {
      // flexDirection: 'row',
      marginHorizontal: wp(7),
      marginBottom: hp(2),
    },
    newChatBtn: {
      backgroundColor: themeRef.colors.appThemeColor,
      shadowColor: themeRef.colors.appThemeColor,
      // position: 'absolute',
      // bottom: hp(12),
      // right: wp(14),
      alignSelf: 'flex-end',
      zIndex: 150,
      paddingVertical: hp(1),
      borderRadius: 200,
      marginRight: wp(12),
      marginBottom: hp(2),
    },
  });

  // const sendNoti = async () => {
  //   await notifee.displayNotification({
  //     android: {
  //       // color: 'res',
  //       channelId: 'Chats',
  //     },
  //     title: 'hello',
  //     subtitle: 'subtitle',
  //   });
  // };

  const searchInHomeChat = text => {
    setSearchText(text);
    let filteredItems = chatSliceRef.homepageChats.filter(item => {
      if (item.chatName.includes(text)) {
        return item;
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

  return (
    <View style={[styles.mainDiv]}>
      <>
        {!!isLoading && chatSliceRef.homepageChats.length == 0 && (
          <LoadingPage
            loadingText="Geting your chats .."
            dark={themeRef.dark}
          />
        )}
        <TouchableOpacity
          style={[commonStyles.iconWithTextBtn, styles.newChatBtn]}
          onPress={() => navigation.navigate(ScreenNames.NewChatPage)}>
          <IonIcon name="add" size={20} color={themeRef.colors.primaryColor} />
          <BaseText
            size={fontSize.small}
            color={themeRef.colors.primaryColor}
            weight={fontWeights.bold}>
            New
          </BaseText>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[commonStyles.iconWithTextBtn, styles.newChatBtn]}
          onPress={async () => {
            await changePassword();
          }}>
          <IonIcon name="add" size={20} color={themeRef.colors.primaryColor} />
          <BaseText
            size={fontSize.small}
            color={themeRef.colors.primaryColor}
            weight={fontWeights.bold}>
            New
          </BaseText>
        </TouchableOpacity> */}
        <View style={styles.searchDiv}>
          <SearchPage
            searchText={searchText}
            clearSearch={clearSearch}
            onChangeText={searchInHomeChat}
          />
        </View>

        {!searchText && <HomepageChatsPage />}
        {!!searchText && (
          <SearchList searchText={searchText} searchArray={searchArray} />
        )}
        <AppStatusBar dark={themeRef.dark} />
      </>
    </View>
  );
};
