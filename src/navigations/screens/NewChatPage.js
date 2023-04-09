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
import {storeFriends} from '../../../redux/chats/ChatSlice';
import InputBox from '../../components/InputBox';
import {useFormik} from 'formik';
import {groupNameValidation} from './authentication/ValidationSchemas';
import BaseText from '../../components/BaseText';
import AvatarListHorizontal from '../../components/AvatarListHorizontal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SimpleButton from '../../components/SimpleButton';
import {commonPageStyles} from './authentication/commonPageStyles';

export const getContacts = async (
  setterFunc,
  loaderFunc,
  dispatch,
  currentUser,
) => {
  try {
    console.log({currentUser});
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
  const [isCreatingGroup, setIsCreatingGroup] = useState(true);
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
    const response = await createNewGroupInDB(
      memebersSelected,
      values.groupName,
      authenticationSliceRef.user,
    );
    if (!!response.isError) {
      console.log({errorInGroup: response.error});
    }
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
          <Image
            source={{uri: item.profilePhoto}}
            style={styles.profilePhoto}
            borderRadius={wp(6)}
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
      {!!isCreatingGroup && (
        <>
          <PageLabels label={'Create Group'} />
          <View style={[commonStyles.rowCenter]}>
            <InputBox
              label={'Group Name'}
              focusFunction={focusFunc}
              focused={!!touched.groupName}
              value={values.groupName}
              inputRef={groupNameRef}
              mainContainerStyle={{
                marginTop: hp(1.5),
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
                marginTop: hp(1.5),
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

      {contactList.length != 0 && (
        <SearchPage containerStyle={{marginVertical: hp(2)}} />
      )}
      {!isCreatingGroup && (
        <TouchableOpacity
          style={[
            commonStyles.iconWithTextBtn,
            {
              backgroundColor: themeRef.colors.appThemeColor,
              shadowColor: themeRef.colors.appThemeColor,
              alignSelf: 'center',
              marginVertical: hp(2),
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
      {contactList.length != 0 && (
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
      {isCreatingGroup && (
        <SimpleButton
          title={'Create group'}
          containerStyle={{marginVertical: hp(2)}}
          onPress={createGroup}
        />
      )}
    </View>
  );
};
