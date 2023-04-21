import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {fontSize} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useTheme} from '@react-navigation/native';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import BaseText from '../../../components/BaseText';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import {useRef} from 'react';
import {useEffect} from 'react';
import ChatAvatar from '../../../components/ChatAvatar';

const ChatScreenHeaderComponent = ({
  displayChatName,
  onOptionPress,
  onInfoPress,
  chatProfilePhoto,
  onChatNamePress,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    pageHeadingContainer: {
      flexDirection: 'row',
      paddingTop: hp(1),
      paddingBottom: hp(0.5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {
      paddingHorizontal: wp(1),
      // marginHorizontal: wp(1),
      marginLeft: wp(2),
    },
    chatImage: {
      // height: hp(25),
      // width: hp(25),
      height: hp(5),
      width: hp(5),
      marginRight: wp(3),
      borderRadius: 500,
      // overflow: 'hidden',
      // position: 'absolute',
      // alignSelf: 'center',
      // right: 0,
      // left: 0,
    },
  });

  const navigation = useNavigation();
  const ItemsOpacity = useRef(new Animated.ValueXY({x: 0, y: 1})).current;
  const ImagePositionRef = useRef(
    new Animated.ValueXY({x: wp(40), y: -hp(12.5)}),
  ).current;
  const ImageDimensions = useRef(
    new Animated.ValueXY({x: 0.22, y: -hp(12.5)}),
  ).current;
  const MainContainerDimensions = useRef(
    new Animated.ValueXY({x: -wp(20), y: wp(100)}),
  ).current;
  // console.log({chatProfilePhoto});

  // const expandHeading = () => {
  //   Animated.parallel([
  //     Animated.timing(MainContainerDimensions, {
  //       toValue: {x: hp(100), y: wp(100)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(ImageDimensions, {
  //       toValue: {x: 1, y: hp(2)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(ImagePositionRef, {
  //       toValue: {x: wp(15), y: hp(2)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //   ]).start();
  //   setTimeout(() => {
  //     minimizeHeading();
  //   }, 2000);
  // };

  // const minimizeHeading = () => {
  //   Animated.parallel([
  //     Animated.timing(MainContainerDimensions, {
  //       toValue: {x: hp(8), y: wp(100)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(ImageDimensions, {
  //       toValue: {x: 0.22, y: -hp(12.5)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(ImagePositionRef, {
  //       toValue: {x: -wp(20), y: -hp(12.5)},
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }),
  //   ]).start();
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     expandHeading();
  //   }, 2000);
  // }, []);

  return (
    <Animated.View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'red',
          // height: MainContainerDimensions.x,
          // width: MainContainerDimensions.y,
        },
      ]}>
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
        {!!chatProfilePhoto ? (
          <ImageCompWithLoader
            source={chatProfilePhoto}
            ImageStyles={[
              styles.chatImage,
              // {
              //   transform: [
              //     {
              //       scale: ImageDimensions.x,
              //     },
              //   ],
              //   marginTop: ImageDimensions.y,
              //   left: ImagePositionRef.x,
              // },
            ]}
            ImageProps={{
              borderRadius: 500,
            }}
          />
        ) : (
          <ChatAvatar
            size={hp(6)}
            isCircle
            color={themeRef.colors.appThemeColor}
          />
        )}

        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={onChatNamePress}>
          <BaseText
            color={themeRef.colors.appThemeColor}
            weight={fontWeights.bold}
            size={fontSize.large}
            otherStyles={{
              flex: 1,
              // marginLeft: wp(10),
              // backgroundColor: 'yellow',
            }}>
            {displayChatName}
          </BaseText>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.backButton} onPress={onInfoPress}>
          <Icon
            name={'search'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              marginRight: wp(2.5),
            },
          ]}
          onPress={onOptionPress}>
          <Icon
            name={'ellipsis-vertical'}
            size={25}
            color={themeRef.colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChatScreenHeaderComponent;
