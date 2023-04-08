import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {dimensions} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useTheme} from '@react-navigation/native';

const ChatTextInputContainer = ({
  userChatMessage,
  setUserChatMessage,
  toggleFileTray,
  isFileSendingTrayOpen,
  sendMessage,
  onPressCamera,
}) => {
  const themeRef = useTheme();

  const styles = StyleSheet.create({
    userTextInputContainer: {
      backgroundColor: themeRef.colors.primaryColor,
      flexDirection: 'row',
      marginHorizontal: wp(4),
      marginTop: hp(1),
      paddingBottom: Platform.OS == 'ios' ? hp(0.5) : hp(2),
    },
    chatInput: {
      backgroundColor: '#F0F0F0',
      flex: 1,
      marginHorizontal: hp(2),
      paddingVertical: hp(1),
      paddingHorizontal: wp(3),
      borderRadius: 15,
      fontSize: !!userChatMessage ? 16 : 14,
      maxHeight: hp(15),
      textAlignVertical: 'center',
      justifyContent: 'center',
      lineHeight: hp(2.7),
      alignSelf: 'center',
      color: 'black',
    },
    inputButton: {
      marginHorizontal: wp(1),
      alignSelf: 'flex-end',
      paddingVertical: hp(1),
    },
  });
  return (
    <View style={styles.userTextInputContainer}>
      <TouchableOpacity style={styles.inputButton}>
        <Icon
          name={'camera-outline'}
          size={25}
          color={themeRef.colors.secondaryColor}
          onPress={onPressCamera}
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
