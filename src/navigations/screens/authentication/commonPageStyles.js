import {useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';

export const commonPageStyles = () => {
  const themeRef = useTheme();
  return StyleSheet.create({
    formDiv: {
      marginVertical: 5,
      marginBottom: 25,
    },
    loginButton: {
      marginVertical: 7,
    },
    loginButtonText: {
      letterSpacing: 1,
      textTransform: 'capitalize',
      fontFamily: FontfamiliesNames.primaryFontBold,
    },
    error: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: 18,
      marginHorizontal: 20,
      marginVertical: 2,
      color: themeRef.colors.errorColor,
    },

    googleLoginButtonText: {
      color: '#2886E0',
    },
    signupDiv: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainDiv: {
      justifyContent: 'center',
      backgroundColor: themeRef.colors.primaryColor,
    },
    googleLoginButton: {
      alignSelf: 'center',
      marginVertical: 10,
    },
    greetLarge: {
      color: themeRef.colors.appThemeColor,
      textAlign: 'center',
    },
    greetSmall: {
      fontSize: 20,
      color: themeRef.colors.secondaryColor,
      textAlign: 'center',
    },
    otherScreenBtn: {
      marginHorizontal: 10,
      color: themeRef.colors.appThemeColor,
    },
  });
};
