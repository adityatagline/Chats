import {useTheme} from '@react-navigation/native';
import {useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import FontfamiliesNames from '../strings/FontfamiliesNames';

const dimensions = Dimensions.get('screen');
export default InputBox = ({
  value,
  label,
  otherProps = {secureTextEntry: false},
  focused,
  focusFunction,
  inputRef,
}) => {
  const themeRef = useTheme();
  const labelRef = useRef(new Animated.ValueXY({x: 55, y: 5})).current;
  const labelSizeRef = useRef(new Animated.ValueXY({x: 20, y: 0})).current;
  const secureTextEntry = !!otherProps.secureTextEntry;

  const slideLabel = () =>
    Animated.parallel([
      Animated.timing(labelRef, {
        toValue: {x: 40, y: 45},
        useNativeDriver: false,
        duration: 100,
      }).start(),
      Animated.timing(labelSizeRef, {
        toValue: {x: 17, y: 5},
        useNativeDriver: false,
        duration: 100,
      }).start(),
    ]);

  const slideLabelBack = () =>
    Animated.parallel([
      Animated.timing(labelRef, {
        toValue: {x: 55, y: 5},
        useNativeDriver: false,
        duration: 100,
      }).start(),
      Animated.timing(labelSizeRef, {
        toValue: {x: 20, y: 0},
        useNativeDriver: false,
        duration: 100,
      }).start(),
    ]);

  const focusHandler = () => {
    slideLabel();
    focusFunction();
  };
  const blurHandler = () => {
    !value && slideLabelBack();
  };

  const styles = StyleSheet.create({
    mainDiv: {
      height: 90,
      justifyContent: 'flex-end',
    },
    inputBox: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      // backgroundColor: 'yellow',
      height: 65,
      width: dimensions.width * 0.82,
      alignSelf: 'center',
      borderRadius: 10,
      fontSize: 20,
      borderWidth: 2,
      paddingHorizontal: 15,
      letterSpacing: 1,
      color: themeRef.colors[focused ? 'appThemeColor' : 'secondaryColor'],
      borderColor:
        themeRef.colors[focused ? 'appThemeColor' : 'secondaryColor'],
      letterSpacing: secureTextEntry ? 5 : 1,
    },
    boxLabel: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors[focused ? 'appThemeColor' : 'secondaryColor'],
    },
    labelDiv: {
      position: 'absolute',
      left: dimensions.width * 0.1,
      justifyContent: 'center',
      zIndex: -10,
      backgroundColor: themeRef.colors.primaryColor,
    },
  });

  return (
    <View style={[styles.mainDiv]}>
      <Animated.View
        ref={labelRef}
        style={[
          styles.labelDiv,
          {height: labelRef.x, bottom: labelRef.y},
          (focused || !!value) && {zIndex: 100},
        ]}>
        <Animated.Text
          ref={labelSizeRef}
          style={[
            styles.boxLabel,
            {fontSize: labelSizeRef.x, marginHorizontal: labelSizeRef.y},
          ]}>
          {label}
        </Animated.Text>
      </Animated.View>
      <TextInput
        style={[styles.inputBox]}
        placeholderTextColor={themeRef.colors.secondaryColor}
        onFocus={focusHandler}
        onBlur={blurHandler}
        value={value}
        ref={inputRef}
        {...otherProps}
      />
    </View>
  );
};
