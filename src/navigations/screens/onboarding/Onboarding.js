import {useNavigation, useTheme} from '@react-navigation/native';
import {useRef, useState} from 'react';
import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import {animate, animateXY} from '../../../components/AnimationFuncions';
import {AppStatusBar} from '../../../components/AppStatusBar';
import SimpleButton from '../../../components/SimpleButton';
import ScreenNames from '../../../strings/ScreenNames';
import {commonStyles} from '../../../styles/commonStyles';
import AnimatedText from './AnimatedText';

const dimensions = Dimensions.get('screen');

export default Onboading = () => {
  const mainHeading = useRef(
    new Animated.ValueXY({x: 35, y: dimensions.height * 0.4}),
  ).current;
  const firstPoint = useRef(
    new Animated.ValueXY({x: 20, y: dimensions.height * 1}),
  ).current;
  const secondPoint = useRef(
    new Animated.ValueXY({x: 20, y: dimensions.height * 1}),
  ).current;
  const thirdPoint = useRef(
    new Animated.ValueXY({x: 20, y: dimensions.height * 1}),
  ).current;
  const themeRef = useTheme();
  const navigation = useNavigation();
  const [animationState, setAnimationState] = useState(0);

  const firstAnimate = () => {
    setAnimationState(pre => pre + 1);
    animateXY(mainHeading, 500, {x: 27, y: dimensions.height * 0.1}, false);
    animateXY(firstPoint, 500, {x: 35, y: dimensions.height * 0.2}, false);
    setTimeout(() => {
      secondAnimate();
    }, 2000);
  };
  const secondAnimate = () => {
    setAnimationState(pre => pre + 1);
    animateXY(mainHeading, 500, {x: 27, y: dimensions.height * 0.07}, false);
    animateXY(firstPoint, 500, {x: 24, y: 10}, false);
    animateXY(secondPoint, 500, {x: 35, y: dimensions.height * 0.1}, false);
  };
  const thirdAnimate = () => {
    setAnimationState(pre => pre + 1);
    animateXY(secondPoint, 500, {x: 24, y: 10}, false);
    animateXY(thirdPoint, 500, {x: 35, y: dimensions.height * 0.1}, false);
  };
  const fourthAnimate = () => {
    setAnimationState(pre => pre + 1);
    animateXY(mainHeading, 500, {x: 35, y: dimensions.height * 0.3}, false);
    animateXY(firstPoint, 500, {x: 25, y: 15}, false);
    animateXY(secondPoint, 500, {x: 25, y: 5}, false);
    animateXY(thirdPoint, 500, {x: 25, y: 5}, false);
  };

  const gotToLoginScreen = () => navigation.navigate(ScreenNames.LoginScreen);

  const checkAndReturnFunction = state => {
    switch (state) {
      case 0:
        return firstAnimate;

      case 1:
        return secondAnimate;

      case 2:
        return thirdAnimate;

      case 3:
        return fourthAnimate;

      default:
        return gotToLoginScreen;
        break;
    }
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      paddingHorizontal: '10%',
      backgroundColor: themeRef.colors.primaryColor,
    },

    nextButton: {
      backgroundColor: themeRef.colors.appThemeColor,
      justifyContent: 'center',
    },
    nextButtonTextStyle: {
      fontSize: 30,
      color: themeRef.colors.secondaryColor,
      // textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      {/* <CircleBackground /> */}
      <AnimatedText
        animationRef={mainHeading}
        text={'Hello there ..\nWelcome to '}
        isFirst
      />
      <AnimatedText
        animationRef={firstPoint}
        text={"It's free,smooth and easy to use."}
      />
      <AnimatedText
        animationRef={secondPoint}
        text={'Share your memories with everyone.'}
      />
      <AnimatedText
        animationRef={thirdPoint}
        text={'No any third party storage.'}
      />
      {/* It's free,smooth and..\neasy to use. */}
      <SimpleButton
        title={animationState == 4 ? 'Get Started' : 'Next'}
        containerStyle={[styles.floatingButton, styles.nextButton]}
        textStyle={styles.nextButtonTextStyle}
        onPress={checkAndReturnFunction(animationState)}
      />
      <AppStatusBar
        backgroundColor={'transparent'}
        barStyle={`${themeRef.dark ? 'dark' : 'light'}-content`}
        translucent={true}
      />
    </View>
  );
};
