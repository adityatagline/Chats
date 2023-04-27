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
  Alert,
  Keyboard,
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
import {
  checkForUserInRecord,
  createNewGroupInDB,
} from '../../../api/chat/ChatRequests';
import IconButton from '../../components/IconButton';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontfamiliesNames, {fontWeights} from '../../strings/FontfamiliesNames';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {animateBook} from '../../components/AnimationFunctions.';
import ScreenNames from '../../strings/ScreenNames';
import {
  storeFriends,
  storeMessageToGroup,
} from '../../../redux/chats/ChatSlice';
import InputBox from '../../components/InputBox';
import {useFormik} from 'formik';
import {groupNameValidation} from './authentication/ValidationSchemas';
import BaseText from '../../components/BaseText';
import AvatarListHorizontal from '../../components/AvatarListHorizontal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SimpleButton from '../../components/SimpleButton';
import {commonPageStyles} from './authentication/commonPageStyles';
import ChatAvatar from '../../components/ChatAvatar';
import ImageCompWithLoader from '../../components/ImageCompWithLoader';
import {imageUrlStrings} from '../../strings/ImageUrlStrings';
import LoadingPage from '../../components/LoadingPage';

export const getContacts = async (
  setterFunc,
  loaderFunc,
  dispatch,
  currentUser,
) => {
  try {
    // console.log({currentUser});
    const contacts = await getAll();
    const response = await checkForUserInRecord(
      [...contacts],
      currentUser.username,
    );
    if (!response.isError) {
      !!setterFunc && setterFunc([...response.users]);
      dispatch(storeFriends([{...currentUser}, ...response.users]));
    } else {
      dispatch(storeFriends([{...currentUser}]));
    }
    !!loaderFunc && loaderFunc(false);
  } catch (error) {
    !!loaderFunc && loaderFunc(false);
  }
};

export const askPermissionAsync = async (
  setContactList,
  loaderFunc,
  dispatch,
  currentUser,
) => {
  try {
    const permissionResult = await PermissionsAndroid.request(
      'android.permission.READ_CONTACTS',
    );
    getContacts(setContactList, loaderFunc, dispatch, currentUser);
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
      height: hp(5),
      width: hp(5),
      marginLeft: wp(1),
      // marginHorizontal: wp(2),
    },
    userContactDiv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: hp(0.5),
      alignItems: 'center',
    },
    detailsDiv: {
      flex: 1,
      marginHorizontal: wp(3),
    },
    topBar: {
      flexDirection: 'row',
      // marginBottom: hp(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageHeading: {
      fontSize: fontSize.extralarge,
      fontFamily: FontfamiliesNames.primaryFontBold,
      marginLeft: wp(5),
      color: themeRef.colors.appThemeColor,
      flex: 1,
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
    noChatsDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
    },
    chatResultContainer: {
      //   backgroundColor: 'red',
      marginHorizontal: wp(8),
    },
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const chatSliceRef = useSelector(state => state.chatSlice);
  const authenticationSliceRef = useSelector(
    state => state.authenticationSlice,
  );

  const groupNameRef = useRef();
  const {values, errors, setFieldValue, setTouched, touched} = useFormik({
    validationSchema: groupNameValidation,
    initialValues: {groupName: ''},
  });

  const [contactList, setContactList] = useState([]);
  const [memebersSelected, setMemebersSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [intervalID, setIntervalID] = useState();
  const bookAnimation = useRef(
    new Animated.ValueXY({
      x: hp(40),
      y: wp(44),
    }),
  ).current;

  const [searchText, setSearchText] = useState('');
  const [searchArray, setSearchArray] = useState([
    // {
    //   username: 'John',
    //   email: 'aditya.tagline2@gmail.com',
    //   firstName: 'John',
    //   lastName: 'Appl',
    //   phone: '8885551212',
    //   profilePhoto: '',
    //   contactName: 'John Appleseed',
    // },
    // {
    //   username: 'Anna',
    //   email: 'aditya.tagline4@gmail.com',
    //   firstName: 'Anna',
    //   lastName: 'Haro',
    //   phone: '5555228243',
    //   profilePhoto: '',
    //   contactName: 'Anna Haro',
    // },
  ]);
  console.log({searchArray});

  const searchInContact = text => {
    setSearchText(text);
    let filteredItems = [...contactList].filter(item => {
      if (
        item.contactName.includes(text) ||
        item.phone.toString().includes(text)
      ) {
        if (
          memebersSelected.length == 0 ||
          (memebersSelected.length != 0 &&
            !memebersSelected.includes(item.username))
        ) {
          return item;
        }
      }
    });

    setSearchArray(filteredItems);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchArray([]);
    Keyboard.dismiss();
  };

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
  }, [isLoading, chatSliceRef.friends]);

  const onAddPressHandler = item => {
    if (isCreatingGroup) {
      if (memebersSelected.length == 25) {
        Alert.alert('Oops', 'Maximum 25 members are allowed in group.');
        return;
      }
      if (!memebersSelected.includes(item.username)) {
        setMemebersSelected(pre => [item.username, ...pre]);
      }
    } else {
      navigation.replace(ScreenNames.ChatPage, {
        userInfo: {...item},
        chatName: item.contactName,
      });
    }
  };

  const onRemoveHandler = item => {
    let newArrayToSet = [...memebersSelected].filter(
      memeber => memeber != item.username,
    );
    setMemebersSelected([...newArrayToSet]);
  };
  const focusFunc = (isBlur = false) => {
    if (isBlur) {
      setTouched({});
      return;
    }
    setTouched({groupName: true});
  };

  const submitName = () => {
    setTouched({});
  };

  const createGroup = async () => {
    if (!values.groupName || !!errors.groupName) {
      Alert.alert('Oops', 'Enter valid group name.');
      return;
    }
    if (memebersSelected.length <= 1) {
      Alert.alert('Oops', 'Minimum 2 members required in group !!');
      return;
    }
    setIsLoading(true);
    const response = await createNewGroupInDB(
      memebersSelected,
      values.groupName,
      authenticationSliceRef.user,
      true,
    );
    if (!!response.isError) {
      Alert.alert('Oops', 'Something went wrong !!\n Try again.');
      setIsLoading(false);
      return;
      // console.log({errorInGroup: response.error});
    }
    console.log({createNewGroupInDB: response});
    let {message, groupInfo} = response;
    console.log({responseCreate: response});
    dispatch(
      storeMessageToGroup({
        message,
        groupInfo,
        userInfo: authenticationSliceRef.user,
      }),
    );
    setIsLoading(false);
    navigation.navigate(ScreenNames.TopTabScreens.HomeScreen);
  };

  useEffect(() => {
    Platform.OS == 'android' &&
      askPermissionAsync(
        setContactList,
        setIsLoading,
        dispatch,
        authenticationSliceRef.user,
      );
    Platform.OS == 'ios' &&
      getContacts(
        setContactList,
        setIsLoading,
        dispatch,
        authenticationSliceRef.user,
      );
  }, []);

  useEffect(() => {
    if (!!isCreatingGroup) {
      groupNameRef.current.focus();
      setMemebersSelected([authenticationSliceRef.user.username]);
    } else {
      setMemebersSelected([]);
    }
  }, [isCreatingGroup]);

  const PageLabels = ({label}) => (
    <BaseText
      color={themeRef.colors.secondaryColor}
      weight={fontWeights.semiBold}
      size={fontSize.medium}
      otherStyles={{marginLeft: wp(5), marginVertical: hp(1.5)}}>
      {label}
    </BaseText>
  );

  const renderContact = ({item}) => {
    if (memebersSelected.includes(item.username)) {
      return;
    }
    return (
      <View style={styles.userContactDiv}>
        {!!item.profilePhoto ? (
          <ImageCompWithLoader
            // source={{uri: item.profilePhoto}}
            source={imageUrlStrings.lemon}
            ImageStyles={styles.profilePhoto}
            ImageProps={{borderRadius: 500}}
          />
        ) : (
          <ChatAvatar
            size={hp(6.3)}
            isCircle
            color={themeRef.colors.appThemeColor}
            containerStyle={{
              marginRight: -wp(1.5),
            }}
          />
        )}
        <View style={styles.detailsDiv}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.contactNumber}>{item.phone}</Text>
        </View>
        <TouchableOpacity onPress={onAddPressHandler.bind(this, item)}>
          <MaterialCommunityIcon
            name={isCreatingGroup ? 'plus-circle' : 'chat-plus-outline'}
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
      {isLoading &&
        isCreatingGroup &&
        !!values.groupName &&
        contactList.length != 0 && (
          <LoadingPage loadingText="Creating new group .." />
        )}
      {!!isCreatingGroup && (
        <>
          {/* <PageLabels label={'Create Group'} /> */}
          <View style={[commonStyles.rowCenter]}>
            <InputBox
              label={'Group Name'}
              focusFunction={focusFunc}
              focused={!!touched.groupName}
              value={values.groupName}
              inputRef={groupNameRef}
              mainContainerStyle={{
                marginTop: hp(3),
                width: wp(75),
              }}
              otherProps={{
                onChangeText: setFieldValue.bind(this, 'groupName'),
                onSubmitEditing: submitName,
              }}
            />
            <IconButton
              name={'close-circle'}
              color={themeRef.colors.appThemeColor}
              size={35}
              containerStyle={{
                marginTop: hp(2.5),
                marginHorizontal: wp(2),
              }}
              onPress={() => setIsCreatingGroup(false)}
            />
          </View>
          <BaseText otherStyles={commonPageStyles().error}>
            {errors.groupName}
          </BaseText>
          <PageLabels
            label={
              memebersSelected.length != 0
                ? `${memebersSelected.length} ${
                    memebersSelected.length == 1 ? 'Member' : 'Members'
                  } in group`
                : 'No members selected'
            }
          />
          {memebersSelected.length != 0 && (
            <AvatarListHorizontal
              listArray={memebersSelected}
              nameField={'contactName'}
              uriField={'profilePhoto'}
              themeRef={themeRef}
              onRemoveHandler={onRemoveHandler}
              onlyUsername
            />
          )}
        </>
      )}
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

      {contactList.length != 0 &&
        (isCreatingGroup
          ? contactList.length != memebersSelected.length
          : true) && (
          <SearchPage
            containerStyle={{marginVertical: hp(2)}}
            onChangeText={searchInContact}
            clearSearch={clearSearch}
            searchText={searchText}
          />
        )}
      {!isCreatingGroup && !searchText && (
        <TouchableOpacity
          style={[
            commonStyles.iconWithTextBtn,
            {
              backgroundColor: themeRef.colors.appThemeColor,
              shadowColor: themeRef.colors.appThemeColor,
              alignSelf: 'center',
              marginVertical: hp(1),
            },
          ]}
          onPress={() => setIsCreatingGroup(true)}>
          <IonIcon name="add" size={20} color={themeRef.colors.primaryColor} />
          <BaseText
            size={fontSize.small}
            color={themeRef.colors.primaryColor}
            weight={fontWeights.bold}>
            Create new Group
          </BaseText>
        </TouchableOpacity>
      )}
      {contactList.length != 0 && !searchText && (
        <FlatList
          data={contactList}
          renderItem={renderContact}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            paddingTop: hp(1),
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {!!searchText && (
        <>
          {searchArray.length != 0 && (
            <View style={styles.chatResultContainer}>
              <BaseText
                color={themeRef.colors.secondaryColor}
                size={fontSize.big}
                weight={fontWeights.semiBold}>
                {searchArray.length} Result{searchArray.length == 1 ? '' : 's'}{' '}
                found
              </BaseText>
            </View>
          )}
          {searchArray.length != 0 && (
            <FlatList
              data={searchArray}
              renderItem={renderContact}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{
                paddingTop: hp(1),
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
          {searchArray.length == 0 && (
            <View style={styles.noChatsDiv}>
              <BaseText
                color={themeRef.colors.secondaryColor}
                size={fontSize.big}
                weight={fontWeights.semiBold}>
                No Search found named {''}
                <BaseText
                  size={fontSize.big}
                  weight={fontWeights.semiBold}
                  color={themeRef.colors.appThemeColor}>
                  "{searchText}"
                </BaseText>
              </BaseText>
            </View>
          )}
        </>
      )}
      {isCreatingGroup && contactList.length == memebersSelected.length && (
        <BaseText
          size={fontSize.big}
          weight={fontWeights.semiBold}
          color={themeRef.colors.errorColor}
          otherStyles={{
            alignSelf: 'center',
            marginVertical: hp(2),
          }}>
          No contact remaining.
        </BaseText>
      )}
      {isCreatingGroup && (
        <SimpleButton
          title={'Create group'}
          containerStyle={{marginVertical: hp(3)}}
          onPress={createGroup}
        />
      )}
    </View>
  );
};
