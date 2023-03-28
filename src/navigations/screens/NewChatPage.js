import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import SearchPage from '../../components/home/search/SearchPage';
import {commonStyles, fontSize} from '../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {getAll} from 'react-native-contacts';
import {checkForUserInRecord} from '../../../api/chat/ChatRequests';
import IconButton from '../../components/IconButton';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontfamiliesNames from '../../strings/FontfamiliesNames';
import {imageUrlStrings} from '../../strings/ImageUrlStrings';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {animateBook} from '../../components/AnimationFunctions.';
import {setLoadingState} from '../../../redux/loading/LoadingSlice';
import {toggleTheme} from '../../../redux/theme/ThemeSlice';
import ScreenNames from '../../strings/ScreenNames';
import {getUsernameFromEmail} from '../../components/CommonFunctions';
import {storeFriends} from '../../../redux/chats/ChatSlice';

export const getContacts = async (
  setterFunc,
  loaderFunc,
  dispatch,
  username,
) => {
  try {
    const contacts = await getAll();
    const response = await checkForUserInRecord([...contacts], username);
    if (!response.isError) {
      !!setterFunc && setterFunc([...response.users]);
    }
    !!loaderFunc && loaderFunc(false);
    dispatch(storeFriends([...response.users]));
  } catch (error) {
    // console.log({error});
    !!loaderFunc && loaderFunc(false);
  }
};

export const askPermissionAsync = async (
  setContactList,
  loaderFunc,
  dispatch,
  username,
) => {
  try {
    const permissionResult = await PermissionsAndroid.request(
      'android.permission.READ_CONTACTS',
    );
    getContacts(setContactList, loaderFunc, dispatch, username);
  } catch (error) {}
};

export default NewChatPage = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      paddingTop: hp(5),
      backgroundColor: themeRef.colors.primaryColor,
    },
    profileIcon: {
      backgroundColor: themeRef.colors.primaryColor,
      borderRadius: 100,
      marginHorizontal: wp(2),
    },
    profilePhoto: {
      height: hp(7),
      width: hp(7),
    },
    userContactDiv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: hp(1),
      alignItems: 'center',
    },
    detailsDiv: {
      flex: 1,
      marginHorizontal: wp(3),
      // justifyContent: 'center',
    },
    topBar: {
      flexDirection: 'row',
      marginBottom: hp(2),
      // alignItems: 'center',
      // justifyContent:
    },
    pageHeading: {
      fontSize: fontSize.extralarge,
      fontFamily: FontfamiliesNames.primaryFontBold,
      marginLeft: wp(5),
      color: themeRef.colors.appThemeColor,
      flex: 1,
      // backgroundColor: 'red',
      textAlign: 'center',
      marginRight: wp(15),
    },
    contactName: {
      fontSize: fontSize.large,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
    },
    contactNumber: {
      fontSize: fontSize.medium,
      fontFamily: FontfamiliesNames.primaryFontMedium,
      color: themeRef.colors.secondaryColor,
    },
    newChatIcon: {
      height: hp(4),
      width: hp(4),
    },
    loadingText: {
      position: 'absolute',
      top: hp(50),
      alignSelf: 'center',
      color: themeRef.colors.appThemeColor,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: fontSize.medium,
      width: wp(60),
      textAlign: 'center',
    },
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const chatSliceRef = useSelector(state => state.chatSlice);
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );
  const [contactList, setContactList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [intervalID, setIntervalID] = useState();
  const bookAnimation = useRef(
    new Animated.ValueXY({
      x: hp(40),
      y: wp(44),
    }),
  ).current;

  useEffect(() => {
    let arrayToSet = [];
    for (const user in chatSliceRef.friends) {
      arrayToSet.push({...chatSliceRef.friends[user]});
    }
    setContactList([...arrayToSet]);
    if (isLoading) {
      const id = animateBook(
        bookAnimation,
        {
          x: hp(38),
          y: wp(46),
        },
        {
          x: hp(40),
          y: wp(48),
        },
        {
          x: hp(42),
          y: wp(46),
        },
        {
          x: hp(40),
          y: wp(44),
        },
        4000,
      );
      setIntervalID(id);
    } else {
      !!intervalID && clearInterval(intervalID);
    }
  }, [isLoading]);

  const goToChatPage = item => {
    navigation.replace(ScreenNames.ChatPage, {
      userInfo: {...item},
      chatName: item.contactName,
    });
  };

  useEffect(() => {
    // console.log('useeff');
    Platform.OS == 'android' &&
      askPermissionAsync(
        setContactList,
        setIsLoading,
        dispatch,
        authenticationSliceRef.user.username,
      );
    Platform.OS == 'ios' &&
      getContacts(
        setContactList,
        setIsLoading,
        dispatch,
        authenticationSliceRef.user.username,
      );
  }, []);

  const renderContact = ({item}) => {
    return (
      <View style={styles.userContactDiv}>
        {!!item.profilePhoto ? (
          <Image
            source={{uri: item.profilePhoto}}
            style={styles.profilePhoto}
            borderRadius={22}
          />
        ) : (
          <Icon
            name="person"
            color={themeRef.colors.appThemeColor}
            size={30}
            style={styles.profileIcon}
          />
        )}
        <View style={styles.detailsDiv}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.contactNumber}>{item.phone}</Text>
        </View>
        {/* <Image
          resizeMode="contain"
          source={imageUrlStrings.newMessage}
          style={styles.newChatIcon}
        /> */}
        <TouchableOpacity onPress={goToChatPage.bind(this, item)}>
          <MaterialCommunityIcon
            name={'chat-plus-outline'}
            size={25}
            color={themeRef.colors.appThemeColor}
            style={{
              paddingHorizontal: wp(1),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      <View style={styles.topBar}>
        <IconButton
          onPress={() => navigation.goBack()}
          name={'chevron-back'}
          color={themeRef.colors.appThemeColor}
        />
        <Text style={styles.pageHeading}>Contacts</Text>
      </View>
      {isLoading && contactList.length == 0 && (
        <Animated.View
          ref={bookAnimation}
          style={{
            position: 'absolute',
            top: bookAnimation.x,
            left: bookAnimation.y,
          }}>
          <Icon name="book" color={themeRef.colors.appThemeColor} size={50} />
        </Animated.View>
      )}
      {isLoading && contactList.length == 0 && (
        <Text style={styles.loadingText}>
          Checking for your new chat mate ..
        </Text>
      )}
      {contactList.length == 0 && !isLoading && (
        <Text style={styles.loadingText}>
          No one contact of yours are available on app.
        </Text>
      )}
      {contactList.length != 0 && <SearchPage />}
      {contactList.length != 0 && (
        <FlatList
          data={contactList}
          renderItem={renderContact}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            paddingTop: hp(3),
          }}
        />
      )}
    </View>
  );
};
