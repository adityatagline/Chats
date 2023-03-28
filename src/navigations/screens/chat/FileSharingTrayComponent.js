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

const FileSharingTrayComponent = ({visibility, setterFunc}) => {
  const themeRef = useTheme();
  const [isAdded, setIsAdded] = useState(false);

  const fileSendingTray = useRef(
    new Animated.ValueXY({
      x: hp(0),
      y: wp(0),
    }),
  ).current;
  const fileSendingTrayScaleAndOpacity = useRef(
    new Animated.ValueXY({
      x: 0.5,
      y: 0,
    }),
  ).current;

  useEffect(() => {
    const expandFileSendingTray = () => {
      setIsAdded(true);
      setterFunc(true);
      Animated.sequence([
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(90),
          },
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(10),
            y: wp(90),
          },
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTrayScaleAndOpacity, {
          toValue: {
            x: 1,
            y: 1,
          },
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };
    const closeFileSendingTray = () => {
      Animated.sequence([
        Animated.timing(fileSendingTrayScaleAndOpacity, {
          toValue: {
            x: 0.5,
            y: 0,
          },
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(10),
            y: wp(90),
          },
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(90),
          },
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(0),
          },
          duration: 10,
          useNativeDriver: false,
        }),
      ]).start();
      setTimeout(() => {
        setIsAdded(false);
      }, 700);
    };
    if (visibility) {
      expandFileSendingTray();
    } else {
      closeFileSendingTray();
    }
  }, [visibility]);

  return (
    <>
      {!!isAdded ? (
        <Animated.View
          style={{
            // position: 'absolute',
            // bottom: hp(10),
            alignSelf: 'center',
            height: fileSendingTray.x,
            width: fileSendingTray.y,
            backgroundColor: themeRef.colors.primaryColor,
            justifyContent: 'center',
            borderRadius: 20,
            elevation: 4,
            shadowColor: themeRef.colors.secondaryColor,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              opacity: fileSendingTrayScaleAndOpacity.y,
              transform: [
                {
                  scale: fileSendingTrayScaleAndOpacity.x,
                },
              ],
            }}>
            <IconButton name={'image'} color={themeRef.colors.appThemeColor} />
            <IconButton name={'film'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'document'}
              color={themeRef.colors.appThemeColor}
            />
            <IconButton name={'folder'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'location'}
              color={themeRef.colors.appThemeColor}
            />
          </Animated.View>
        </Animated.View>
      ) : null}
    </>
  );
};

export default FileSharingTrayComponent;
