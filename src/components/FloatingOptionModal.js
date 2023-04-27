import {useTheme} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StatusBarHeight} from '../styles/commonStyles';

const FloatingOptionModal = ({
  visibility,
  canClosable = false,
  onOutsidePressHandler = () => {},
  children,
  scrollContainerProps,
  customBottomPosition,
  top = StatusBarHeight + hp(7),
  right = wp(5),
  width = wp(70),
  height = hp(20),
  scrollContainerStyle,
  innerContainerStyle,
}) => {
  const themeRef = useTheme();
  const [modalExistance, setModalExistance] = useState(false);
  const outerContainerOpacity = useRef(new Animated.Value(0)).current;
  const innerContainerDimensions = useRef(
    new Animated.ValueXY({x: 0, y: 0}),
  ).current;

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(innerContainerDimensions, {
        toValue: {x: 0, y: 0},
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(outerContainerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      setModalExistance(false);
    }, 600);
  };
  const openModal = () => {
    setModalExistance(true);
    Animated.parallel([
      Animated.timing(outerContainerOpacity, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(innerContainerDimensions, {
        toValue: {x: height, y: width},
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    // setTimeout(() => {
    //   closeModal();
    // }, 2000);
  };

  useEffect(() => {
    if (visibility) {
      openModal();
    } else {
      closeModal();
    }
  }, [visibility]);

  return !!modalExistance ? (
    <>
      <Animated.View
        style={[
          {
            position: 'absolute',
            // height: hp(200),
            // width: wp(100),
            ...StyleSheet.absoluteFillObject,
            top: 0,
            right: 0,
            // backgroundColor: themeRef.colors.secondaryColor,
            backgroundColor: themeRef.dark
              ? themeRef.colors.card
              : themeRef.colors.secondaryColor,
            // backgroundColor: 'black',
            zIndex: 100,
            opacity: outerContainerOpacity,
          },
        ]}>
        {canClosable && (
          <Pressable
            style={[
              {
                position: 'absolute',
                ...StyleSheet.absoluteFillObject,
                top: 0,
                right: 0,
                backgroundColor: 'transparent',
              },
            ]}
            onPress={
              !!canClosable ? onOutsidePressHandler : () => {}
            }></Pressable>
        )}
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            // maxHeight: hp(85),
            maxWidth: wp(92),
            // bottom: innerContainerDimensions,
            alignSelf: 'center',
            backgroundColor: themeRef.colors.primaryColor,
            zIndex: 105,
            borderRadius: 35,
            right,
            top,
            maxHeight: innerContainerDimensions.x,
            width: innerContainerDimensions.y,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            flexDirection: 'row',
            // borderColor: themeRef.dark
            //   ? themeRef.colors.secondaryColor
            //   : 'transparent',
            // borderWidth: themeRef.dark ? 0.5 : 0,
            paddingVertical: hp(2),
          },
          innerContainerStyle,
        ]}>
        <ScrollView
          bounces={false}
          style={[
            {
              alignSelf: 'center',
            },
            scrollContainerStyle,
          ]}
          {...scrollContainerProps}>
          {children}
        </ScrollView>
        {/* <StatusBar translucent /> */}
      </Animated.View>
    </>
  ) : null;
};

const styles = StyleSheet.create({});

export default FloatingOptionModal;
