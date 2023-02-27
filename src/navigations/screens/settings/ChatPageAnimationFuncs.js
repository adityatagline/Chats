import {Animated} from 'react-native';
import {dimensions} from '../../../styles/commonStyles';

export const animateNoChat = (componentRef, toValue, duration, delay = 0) => {
  const animate = () =>
    Animated.sequence([
      Animated.timing(componentRef, {
        toValue,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(componentRef, {
        toValue: {x: toValue.x, y: dimensions.height * 0.15},
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(componentRef, {
        toValue,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(componentRef, {
        toValue: {x: toValue.x, y: dimensions.height * 0.15},
        duration,
        useNativeDriver: false,
      }),
    ]).start();
  animate();
  return setInterval(() => {
    animate();
  }, 5000);
};

export const removeNoChat = (componentRef, toValue, duration, delay = 0) => {
  Animated.sequence([
    Animated.timing(componentRef, {
      toValue,
      duration: duration / 2,
      delay,
      useNativeDriver: false,
    }),
    // Animated.timing(componentRef, {
    //   toValue: { x: 0, y: toValue.y },
    //   duration: duration / 3,
    //   delay,
    //   useNativeDriver: false,
    // }),
  ]).start();
};
