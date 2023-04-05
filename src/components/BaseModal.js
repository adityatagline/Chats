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

const BaseModal = ({
  visibility,
  canClosable = false,
  onOutsidePressHandler = () => {},
  children,
  scrollContainerProps,
}) => {
  const themeRef = useTheme();
  const [modalExistance, setModalExistance] = useState(false);
  const outerContainerOpacity = useRef(new Animated.Value(0)).current;
  const innerContainerPosition = useRef(new Animated.Value(-hp(100))).current;

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(innerContainerPosition, {
        toValue: -hp(100),
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
      Animated.timing(innerContainerPosition, {
        toValue: hp(3),
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
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
            height: hp(100),
            width: wp(100),
            top: 0,
            right: 0,
            backgroundColor: themeRef.colors.secondaryColor,
            zIndex: 100,
            opacity: outerContainerOpacity,
          },
        ]}>
        {canClosable && (
          <Pressable
            style={[
              {
                position: 'absolute',
                height: hp(100),
                width: wp(100),
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
            maxHeight: hp(85),
            width: wp(92),
            bottom: innerContainerPosition,
            alignSelf: 'center',
            backgroundColor: themeRef.colors.primaryColor,
            zIndex: 105,
            borderRadius: 35,
            paddingVertical: hp(3),
            paddingHorizontal: wp(5),
          },
        ]}>
        <ScrollView bounces={false} style={[{}]} {...scrollContainerProps}>
          {children}
        </ScrollView>
        {/* <StatusBar translucent /> */}
      </Animated.View>
    </>
  ) : null;
};

const styles = StyleSheet.create({});

export default BaseModal;
