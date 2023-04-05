import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppStatusBar} from '../../../components/AppStatusBar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SearchPage from '../../../components/home/search/SearchPage';
import HomepageChatsPage from '../../../components/home/HomepageChatsPage';
import {commonStyles} from '../../../styles/commonStyles';
import {getUserHomepageChats} from '../../../../api/chat/ChatRequests';
import firestore from '@react-native-firebase/firestore';
import {checkAndStoreNewMessages} from '../../../../redux/chats/ChatSlice';
import {askPermissionAsync, getContacts} from '../NewChatPage';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import {checkAndDeleteMessage} from '../../../../api/chat/firebaseSdkRequests';

export default HomeScreen = props => {
  const themeRef = useTheme();
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const chatSliceRef = useSelector(state => state.chatSlice);
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [messageToBedeleted, setMessageToBedeleted] = useState([]);

  // console.log({unseenChats: chatSliceRef.unseenChats});

  useEffect(() => {
    setisLoading(true);
    getInitialData();
    isFocused && props.setterFunction(route.name);
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
          let arrayToCheck = [];
          docChanges.forEach(item => {
            arrayToCheck.push({
              ...item.doc.data(),
            });
          });
          dispatch(
            checkAndStoreNewMessages({
              messageArray: [...arrayToCheck],
              userInfo: {...authenticationSlice.user},
            }),
          );
          setMessageToBedeleted([...arrayToCheck]);
        });

      return () => firestoreListner();
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
      // deleteMessages();
    }
  }, [messageToBedeleted]);

  const getInitialData = async () => {
    Platform.OS == 'android' &&
      (await askPermissionAsync(
        undefined,
        undefined,
        dispatch,
        authenticationSlice.user.username,
      ));
    Platform.OS == 'ios' &&
      (await getContacts(
        undefined,
        undefined,
        dispatch,
        authenticationSlice.user.username,
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
        <View style={styles.searchDiv}>
          <SearchPage />
        </View>

        <HomepageChatsPage />
        <AppStatusBar dark={themeRef.dark} />
      </>
    </View>
  );
};
