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

const NoChatAnimatedCompoenet = ({visibility}) => {
  const noChatRef = useRef(
    new Animated.ValueXY({x: 0, y: dimensions.height * 0.15}),
  ).current;
  const [noChatRefValue, setNoChatRefValue] = useState();

  useEffect(() => {
    if (!!noChatRefValue && !visibility) {
      clearInterval(noChatRefValue);
      removeNoChat(noChatRef, {x: 0, y: dimensions.height * 0.1}, 700);
      setNoChatRefValue();
    } else if (!!visibility && !noChatRefValue) {
      setNoChatRefValue(
        animateNoChat(noChatRef, {x: 0.6, y: dimensions.height * 0.16}, 500),
      );
    }
  }, [visibility]);

  return (
    <Animated.Text
      ref={noChatRef}
      style={[
        styles.noChatText,
        {
          opacity: noChatRef.x,
          top: noChatRef.y,
        },
      ]}>
      No recent chats ..
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  noChatText: {
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#F0F0F0',
    color: 'black',
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default NoChatAnimatedCompoenet;
