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
import ChatScreenHeaderComponent from './ChatScreenHeaderComponent';
import ChatMessageComponent from './ChatMessageComponent';
import NoChatAnimatedCompoenet from './NoChatAnimatedComponent';
import FileSharingTrayComponent from './FileSharingTrayComponent';

const ChatTextInputContainer = ({
  userChatMessage,
  setUserChatMessage,
  toggleFileTray,
  isFileSendingTrayOpen,
  sendMessage,
}) => {
  const themeRef = useTheme();

  const styles = StyleSheet.create({
    userTextInputContainer: {
      // position: 'absolute',
      backgroundColor: themeRef.colors.primaryColor,
      flexDirection: 'row',
      // left: 0,
      marginHorizontal: wp(4),
      marginTop: hp(1),
      paddingBottom: Platform.OS == 'ios' ? hp(0) : hp(2),
    },
    chatInput: {
      backgroundColor: '#F0F0F0',
      flex: 1,
      marginHorizontal: hp(2),
      paddingVertical: hp(1),
      paddingHorizontal: wp(3),
      borderRadius: 15,
      fontSize: !!userChatMessage ? 16 : 14,
      maxHeight: dimensions.height * 0.2,
      textAlignVertical: 'center',
      justifyContent: 'center',
      lineHeight: hp(2.7),
      // alignItems: 'center',
      alignSelf: 'center',
    },
    inputButton: {
      marginHorizontal: '1%',
      alignSelf: 'flex-end',
      paddingVertical: '2%',
    },
  });
  return (
    <View style={styles.userTextInputContainer}>
      <TouchableOpacity style={styles.inputButton}>
        <Icon
          name={'camera-outline'}
          size={25}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.chatInput}
        placeholder={'Type something ..'}
        placeholderTextColor={'black'}
        value={userChatMessage}
        multiline
        onChangeText={setUserChatMessage}
        textAlignVertical="center"
      />
      <TouchableOpacity
        style={[styles.inputButton, {marginRight: wp(3)}]}
        onPress={toggleFileTray}>
        <Icon
          name={isFileSendingTrayOpen ? 'close' : 'attach'}
          size={25}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.inputButton, styles.sendButton]}
        onPress={sendMessage.bind(this, userChatMessage)}>
        <Icon name={'send'} size={25} color={themeRef.colors.secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatTextInputContainer;
