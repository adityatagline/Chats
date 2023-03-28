import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {colorStrings} from '../strings/ColorStrings';
import FontfamiliesNames from '../strings/FontfamiliesNames';

export default LoadingPage = ({dark, loadingText = ''}) => {
  const styles = StyleSheet.create({
    loadingIndicator: {
      backgroundColor: dark
        ? colorStrings.darkThemeColors.primaryColor
        : colorStrings.lightThemeColors.primaryColor,
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 1000,
      opacity: 0.95,
      justifyContent: 'center',
      alignItems: 'center',
    },
    waitingMessage: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: 16,
      marginVertical: 10,
      color: dark
        ? colorStrings.darkThemeColors.appThemeColor
        : colorStrings.lightThemeColors.appThemeColor,
      marginHorizontal: widthPercentageToDP(20),
      //   backgroundColor: 'red',
      textAlign: 'center',
    },
  });
  if (!loadingText) {
    return <></>;
  }
  return (
    <View style={styles.loadingIndicator}>
      <ActivityIndicator
        size={Platform.OS == 'android' ? 50 : 'large'}
        color={
          dark
            ? colorStrings.darkThemeColors.appThemeColor
            : colorStrings.lightThemeColors.appThemeColor
        }
      />
      <Text style={styles.waitingMessage}>{loadingText}</Text>
    </View>
  );
};

export const BaseLoader = ({
  dark,
  loadingText = 'Please wait',
  size = Platform.OS == 'adnroid' ? 30 : 'small',
  containerStyle,
  textStyle,
  loaderStyle,
}) => {
  const styles = StyleSheet.create({
    waitingMessage: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: 16,
      marginVertical: 10,
      color: dark
        ? colorStrings.darkThemeColors.appThemeColor
        : colorStrings.lightThemeColors.appThemeColor,
      marginHorizontal: widthPercentageToDP(20),
      textAlign: 'center',
    },
  });
  return (
    <View style={[containerStyle]}>
      <ActivityIndicator
        size={size}
        color={
          dark
            ? colorStrings.darkThemeColors.appThemeColor
            : colorStrings.lightThemeColors.appThemeColor
        }
        style={[loaderStyle]}
      />
      {!!loadingText && (
        <Text style={[styles.waitingMessage, textStyle]}>{loadingText}</Text>
      )}
    </View>
  );
};
