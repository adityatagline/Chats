import {Animated} from 'react-native';

export const animate = (animationRef, duration, values, useNativeDriver) => {
  return Animated.timing(animationRef, {
    toValue: values,
    duration: duration,
    useNativeDriver: useNativeDriver,
  }).start();
};

export const animateXY = (animationRef, duration, values, useNativeDriver) => {
  return Animated.timing(animationRef, {
    toValue: {...values},
    duration: duration,
    useNativeDriver: useNativeDriver,
  }).start();
};
