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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';

export default SearchNewContactList = ({searchArray, searchText}) => {
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
      {contactList.length != 0 && (
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
    </View>
  );
};
