import {delay} from '@reduxjs/toolkit/dist/utils';
import {Animated} from 'react-native';

export const animateBook = (
  ref,
  toValue,
  toValue2,
  toValue3,
  toValue4,
  duration,
  delay = 0,
) => {
  const animateFun = () =>
    Animated.sequence([
      Animated.timing(ref, {
        toValue,
        duration: duration / 4,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(ref, {
        toValue: toValue2,
        duration: duration / 4,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(ref, {
        toValue: toValue3,
        duration: duration / 4,
        delay,
        useNativeDriver: false,
      }),
      Animated.timing(ref, {
        toValue: toValue4,
        duration: duration / 4,
        delay,
        useNativeDriver: false,
      }),
    ]).start();

  animateFun();

  const intervalID = setInterval(() => {
    animateFun();
  }, duration * 1.5);

  return intervalID;
};
