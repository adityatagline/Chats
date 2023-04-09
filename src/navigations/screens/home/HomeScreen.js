import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
  getStrangerInfoFromDB,
  getUserHomepageChats,
} from '../../../../api/chat/ChatRequests';
import firestore from '@react-native-firebase/firestore';
import {
  checkAndStoreNewMessages,
  storeStranger,
} from '../../../../redux/chats/ChatSlice';
import {askPermissionAsync, getContacts} from '../NewChatPage';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import {checkAndDeleteMessage} from '../../../../api/chat/firebaseSdkRequests';
import IonIcon from 'react-native-vector-icons/Ionicons';
import BaseText from '../../../components/BaseText';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import ScreenNames from '../../../strings/ScreenNames';

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
  // console.log({chatSliceRef});

  // console.log({unseenChats: chatSliceRef.unseenChats});

  useEffect(() => {
    setisLoading(true);
    getInitialData();
    isFocused && props.setterFunction(route.name);
  }, [isFocused]);

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
          let arrayToCheck = [];
          let usersArray = [];
          docChanges.forEach(item => {
            const data = item.doc.data();
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
  }, [strangerArray]);

  useEffect(() => {
    const deleteMessages = async () => {
      await checkAndDeleteMessage(
        [...messageToBedeleted],
        authenticationSlice.user.username,
      );
    };

    if (messageToBedeleted.length != 0) {
      // deleteMessages();
    }
  }, [messageToBedeleted]);

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
    setisLoading(false);
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      paddingTop: hp(12),
    },
    searchDiv: {
      flexDirection: 'row',
      marginHorizontal: wp(7),
    },
    newChatBtn: {
      backgroundColor: themeRef.colors.appThemeColor,
      shadowColor: themeRef.colors.appThemeColor,
      position: 'absolute',
      top: hp(1.75) + StatusBarHeight,
      right: wp(14),
      alignSelf: 'center',
    },
  });

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
        <View style={styles.searchDiv}>
          <SearchPage />
        </View>

        <HomepageChatsPage />
        <AppStatusBar dark={themeRef.dark} />
      </>
    </View>
  );
};
