import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput,
  Animated,
  FlatList,
  Alert,
  NetInfo,
  Keyboard,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  commonStyles,
  dimensions,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {useEffect} from 'react';
import {useState} from 'react';
import {animateNoChat, removeNoChat} from './ChatPageAnimationFuncs';
import {useRef} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {SafeAreaView} from 'react-native-safe-area-context';
import IconButton from '../../../components/IconButton';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {useDispatch, useSelector} from 'react-redux';
import {storeMessage} from '../../../../redux/chats/ChatSlice';
import {sendMessageToFirestore} from '../../../../api/chat/firebaseSdkRequests';
import {useNetInfo} from '@react-native-community/netinfo';
import {KeyboardAvoidingView} from 'react-native';

const ChatScreenHeaderComponent = ({
  displayChatName,
  onOptionPress,
  onInfoPress,
  chatProfilePhoto,
}) => {
  const navigation = useNavigation();

  const themeRef = useTheme();
  const styles = StyleSheet.create({
    pageHeadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      paddingHorizontal: wp(1.5),
      marginHorizontal: wp(1),
    },
    chatImage: {
      height: hp(5),
      width: hp(5),
      marginRight: wp(3),
      borderRadius: 17,
    },
    chatName: {
      flex: 1,
      color: themeRef.colors.appThemeColor,
      fontFamily: FontfamiliesNames.primaryFontBold,
      fontSize: fontSize.big,
    },
  });

  return (
    <View style={styles.pageHeadingContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon
          name={'chevron-back'}
          size={30}
          color={themeRef.colors.appThemeColor}
        />
      </TouchableOpacity>
      {!!chatProfilePhoto.uri ? (
        <Image
          source={chatProfilePhoto}
          style={styles.chatImage}
          borderRadius={17}
        />
      ) : (
        <Image
          source={imageUrlStrings.profileSelected}
          style={[
            styles.chatImage,
            {
              height: hp(4),
              width: hp(4),
            },
          ]}
          // borderRadius={17}
        />
      )}
      <Text style={styles.chatName}>{displayChatName}</Text>
      <TouchableOpacity style={styles.backButton} onPress={onInfoPress}>
        <Icon
          name={'information-circle-outline'}
          size={30}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onOptionPress}>
        <Icon
          name={'ellipsis-vertical'}
          size={25}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreenHeaderComponent;
