import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  blockUsersInDB,
  checkIsMember,
  getGroupInfo,
  getGroupsOfUser,
  getStrangerInfoFromDB,
  getUserHomepageChats,
} from '../../../../api/chat/ChatRequests';
import firestore from '@react-native-firebase/firestore';
import {
  checkAndStoreNewMessages,
  clearAllChats,
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
import IconButton from '../../../components/IconButton';
import BaseModal from '../../../components/BaseModal';
import {clearAllGroupChats} from '../../../../api/chat/firebaseSdkRequests';
import {changeUserDetails} from '../../../../redux/authentication/AuthenticationSlice';

export default HomeScreen = props => {
  const themeRef = useTheme();
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const chatSliceRef = useSelector(state => state.chatSlice);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState('');
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
  const [optionUsers, setOptionUsers] = useState([]);

  // dispatch(clearAllChats());
  // dispatch(logout());
  // console.log({individualChats: chatSliceRef});

  useEffect(() => {
    if (!!isProcessing) {
      navigation.setOptions({
        tabBarStyle: {
          display: 'none',
        },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: themeRef.colors.appThemeColor,
          position: 'absolute',
          bottom: hp(2.5),
          width: wp(60),
          elevation: 0,
          shadowOpacity: 0.4,
          shadowColor: themeRef.colors.appThemeColor,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          shadowRadius: 5,
          borderRadius: 40,
          alignSelf: 'center',
          justifyContent: 'center',
        },
      });
    }
  }, [isProcessing]);

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

  const startSelection = userName => {
    if (optionUsers.length == 0) {
      setOptionUsers([userName]);
    } else {
      let newArray = [...optionUsers];
      if (optionUsers.includes(userName)) {
        newArray = newArray.filter(item => item != userName);
      } else {
        newArray.push(userName);
      }
      setOptionUsers(newArray);
    }
  };

  const clearSelection = () => setOptionUsers([]);

  const deleteChats = async () => {
    setIsProcessing('Deleting chats ..');
    // return;
    for (let i = 0; i < optionUsers.length; i++) {
      const userName = optionUsers[i];
      console.log({userName, ind: chatSliceRef.individualChats});
      if (!!chatSliceRef?.groups?.[userName]) {
        let response = await clearAllGroupChats(
          authenticationSlice.user.username,
          userName,
        );
        if (!response.isError) {
        }
      }
      console.log({home: chatSliceRef.homepageChats});
      dispatch(clearUserChat({username: userName}));
      console.log({home: chatSliceRef.homepageChats});
    }
    setOptionUsers([]);
    setIsProcessing('');
  };
  const blockUsers = async () => {
    setIsProcessing('Updating records ..');
    const response = await blockUsersInDB(
      authenticationSlice.user.username,
      optionUsers,
    );
    if (!response.isError) {
      dispatch(changeUserDetails({userDetails: {blocked: response.data}}));
    }
    console.log({block: response});
    setIsProcessing('');
  };

  const showConfirm = action => {
    Alert.alert(
      'Are you sure ?',
      action == 'delete'
        ? 'Delete Selected chats ?'
        : action == 'block'
        ? 'Block users '
        : '',
      [
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress:
            action == 'delete'
              ? deleteChats
              : action == 'block'
              ? blockUsers
              : () => {},
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  return (
    <View style={[styles.mainDiv]}>
      <>
        {((!!isLoading && chatSliceRef.homepageChats.length == 0) ||
          !!isProcessing) && (
          <LoadingPage
            loadingText={!!isProcessing ? isProcessing : 'Geting your chats ..'}
            dark={themeRef.dark}
          />
        )}
        {optionUsers.length == 0 ? (
          <TouchableOpacity
            style={[commonStyles.iconWithTextBtn, styles.newChatBtn]}
            onPress={() => navigation.navigate(ScreenNames.NewChatPage)}>
            <IonIcon
              name="add"
              size={20}
              color={themeRef.colors.primaryColor}
            />
            <BaseText
              size={fontSize.small}
              color={themeRef.colors.primaryColor}
              weight={fontWeights.bold}>
              New
            </BaseText>
          </TouchableOpacity>
        ) : (
          <View
            style={[
              {
                // marginVertical: hp(1.5),
                paddingVertical: hp(0.25),
                marginBottom: hp(2),
                alignSelf: 'flex-end',
                flexDirection: 'row',
                marginRight: wp(10),
              },
            ]}>
            <IconButton
              name={'remove-circle-outline'}
              color={themeRef.colors.errorColor}
              size={27}
              containerStyle={{
                marginHorizontal: wp(2),
              }}
              onPress={showConfirm.bind(this, 'block')}
            />
            <IconButton
              name={'trash-outline'}
              color={themeRef.colors.errorColor}
              size={27}
              containerStyle={{
                marginHorizontal: wp(2),
              }}
              onPress={showConfirm.bind(this, 'delete')}
            />
            {/* <IconButton
              name={'ios-notifications-off-outline'}
              color={themeRef.colors.secondaryColor}
              size={28}
              containerStyle={{
                marginHorizontal: wp(2),
              }}
            /> */}
            <IconButton
              name={'close'}
              color={themeRef.colors.appThemeColor}
              size={30}
              containerStyle={{
                marginHorizontal: wp(2),
              }}
              onPress={clearSelection}
            />
          </View>
        )}
        <View style={styles.searchDiv}>
          <SearchPage
            searchText={searchText}
            clearSearch={clearSearch}
            onChangeText={searchInHomeChat}
          />
        </View>

        {!searchText && (
          <HomepageChatsPage
            onLongPress={startSelection}
            isSelectionMode={optionUsers.length != 0}
            optionUsers={optionUsers}
          />
        )}
        {!!searchText && (
          <SearchList
            searchText={searchText}
            searchArray={searchArray}
            onLongPress={startSelection}
            isSelectionMode={optionUsers.length != 0}
            optionUsers={optionUsers}
          />
        )}
        <AppStatusBar dark={themeRef.dark} />
      </>
    </View>
  );
};
