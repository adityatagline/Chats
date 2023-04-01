import {useTheme} from '@react-navigation/native';
import {useEffect, useRef} from 'react';
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
  const outerContainerOpacity = useRef(new Animated.Value(0.5)).current;
  const innerContainerPosition = useRef(new Animated.Value(-hp(100))).current;

  const closeModal = () => {
    Animated.sequence([
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
  };
  const openModal = () => {
    Animated.parallel([
      Animated.timing(outerContainerOpacity, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(innerContainerPosition, {
        toValue: hp(3),
        duration: 500,
        useNativeDriver: false,
        delay: 100,
      }),
    ]).start();

    // setTimeout(() => {
    //   closeModal();
    // }, 3000);
  };

  useEffect(() => {
    if (visibility) {
      openModal();
    } else {
      closeModal();
    }
  }, [visibility]);

  return (
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
  );
};

const styles = StyleSheet.create({});

export default BaseModal;
