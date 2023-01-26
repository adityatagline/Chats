import {useTheme} from '@react-navigation/native';
import {Animated, StyleSheet} from 'react-native';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';

export default AnimatedText = ({animationRef, text, isFirst}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    mainGreet: {
      fontSize: 25,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.secondaryColor,
    },
  });
  return (
    <Animated.View
      ref={animationRef}
      style={{
        marginTop: animationRef.y,
      }}>
      <Animated.Text
        ref={animationRef}
        style={[styles.mainGreet, {fontSize: animationRef.x}]}>
        {text}
        {!!isFirst && (
          <Animated.Text
            ref={animationRef}
            style={[styles.mainGreet, {fontSize: animationRef.x}]}>
            chats
          </Animated.Text>
        )}
      </Animated.Text>
    </Animated.View>
  );
};
