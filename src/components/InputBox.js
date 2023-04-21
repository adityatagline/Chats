import {useTheme} from '@react-navigation/native';
import {useRef, useState} from 'react';
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
import {fontSize} from '../styles/commonStyles';
import IconButton from './IconButton';

const dimensions = Dimensions.get('screen');
export default InputBox = ({
  value,
  label,
  otherProps = {secureTextEntry: false},
  focused,
  focusFunction,
  inputRef,
  isPassword = false,
  mainContainerStyle,
  eyeColor,
}) => {
  const themeRef = useTheme();
  const labelRef = useRef(new Animated.ValueXY({x: 55, y: 5})).current;
  const labelSizeRef = useRef(new Animated.ValueXY({x: 20, y: 0})).current;
  const secureTextEntry = !!otherProps.secureTextEntry;
  const [passwordShown, setPasswordShown] = useState(!isPassword);

  const slideLabel = () =>
    Animated.parallel([
      Animated.timing(labelRef, {
        toValue: {x: 35, y: 47},
        useNativeDriver: false,
        duration: 100,
      }).start(),
      Animated.timing(labelSizeRef, {
        toValue: {x: 17, y: 5},
        useNativeDriver: false,
        duration: 100,
      }).start(),
    ]);

  !!value && slideLabel();

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
    focusFunction(true);
  };

  const styles = StyleSheet.create({
    mainDiv: {
      height: 65,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      borderColor:
        themeRef.colors[focused ? 'appThemeColor' : 'secondaryColor'],
      borderRadius: 10,
      borderWidth: 2,
      marginTop: 25,
      width: dimensions.width * 0.82,
      paddingHorizontal: 15,
    },
    inputBox: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      // backgroundColor: 'yellow',
      height: 65,
      alignSelf: 'center',
      fontSize: fontSize.large,
      letterSpacing: 1,
      color: themeRef.colors[focused ? 'appThemeColor' : 'secondaryColor'],
      flex: 1,
      letterSpacing: secureTextEntry ? 5 : 1,
      marginRight: 10,
      // backgroundColor: 'red',
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
      // backgroundColor: 'red',
    },
  });

  return (
    <View style={[styles.mainDiv, mainContainerStyle]}>
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
        secureTextEntry={!passwordShown}
      />
      {!!isPassword && (
        <IconButton
          name={!passwordShown ? 'eye-off' : 'eye'}
          onPress={() => setPasswordShown(pre => !pre)}
          color={eyeColor}
        />
      )}
    </View>
  );
};
