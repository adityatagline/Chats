import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
} from 'react-native';
import SearchPage from '../../components/home/search/SearchPage';
import {commonStyles, fontSize} from '../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {getAll} from 'react-native-contacts';
import {checkForUserInRecord} from '../../../api/chat/ChatRequests';
import IconButton from '../../components/IconButton';
import FontfamiliesNames from '../../strings/FontfamiliesNames';
import {imageUrlStrings} from '../../strings/ImageUrlStrings';

export default NewChatPage = () => {
  const themeRef = useTheme();
  const navigation = useNavigation();
  const [contactList, setContactList] = useState([
    {
      contactName: 'Tagline Testing',
      email: 'aditya.tagline@gmail.com',
      firstName: 'Aditya',
      lastName: 'Patel',
      phone: '7778889990',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
    {
      contactName: 'Tagline Testing',
      email: 'aditya.tagline@gmail.com',
      firstName: 'Aditya',
      lastName: 'Patel',
      phone: '7778889990',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
    {
      contactName: 'Tagline Testing',
      email: 'aditya.tagline@gmail.com',
      firstName: 'Aditya',
      lastName: 'Patel',
      phone: '7778889990',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
    {
      contactName: 'Tagline Testing',
      email: 'aditya.tagline@gmail.com',
      firstName: 'Aditya',
      lastName: 'Patel',
      phone: '7778889990',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
    {
      contactName: 'Tagline Testing',
      email: 'aditya.tagline@gmail.com',
      firstName: 'Aditya',
      lastName: 'Patel',
      phone: '7778889990',
      profilePhoto:
        'https://lh3.googleusercontent.com/a/AEdFTp4_9kNWjMb2uHUNGdvpzmHIwLVCK4yyCNNXCKfm=s96-c',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  console.log({contactList});

  const askPermissionAsync = async () => {
    try {
      const permissionResult = await PermissionsAndroid.request(
        'android.permission.READ_CONTACTS',
      );
      console.log('permissionResult');
      console.log(permissionResult);
      // getContacts();
    } catch (error) {}
  };

  const getContacts = async () => {
    try {
      const contacts = await getAll();
      // console.log({contacts});
      const response = await checkForUserInRecord([...contacts]);
      console.log({response});
      if (!response.isError) {
        setContactList([...response.users]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log({contactsError: error});
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Platform.OS == 'android' && askPermissionAsync();
    Platform.OS == 'ios' && getContacts();
  }, []);

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      paddingTop: hp(5),
      backgroundColor: themeRef.colors.primaryColor,
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
  });

  const renderContact = ({item}) => {
    return (
      <View style={styles.userContactDiv}>
        <Image
          source={{uri: item.profilePhoto}}
          style={styles.profilePhoto}
          borderRadius={22}
        />
        <View style={styles.detailsDiv}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.contactNumber}>{item.phone}</Text>
        </View>
        {/* <Image
          resizeMode="contain"
          source={imageUrlStrings.newMessage}
          style={styles.newChatIcon}
        /> */}
        <IconButton
          name={'add'}
          size={30}
          color={themeRef.colors.secondaryColor}
        />
      </View>
    );
  };

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      <View style={styles.topBar}>
        <IconButton onPress={() => navigation.goBack()} name={'chevron-back'} />
        <Text style={styles.pageHeading}>Contacts</Text>
      </View>
      {/* {isLoading && <Text>Loading</Text>} */}
      <SearchPage />
      <FlatList
        data={contactList}
        renderItem={renderContact}
        keyExtractor={(item, index) => index}
        contentContainerStyle={{
          paddingTop: hp(3),
        }}
      />
    </View>
  );
};
