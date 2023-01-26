import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
import {AppStatusBar} from '../../../components/AppStatusBar';
import FloatingBackButton from '../../../components/FloatingBackButton';
import HeadingLarge from '../../../components/HeadingLarge';
import InputBox from '../../../components/InputBox';
import SimpleButton from '../../../components/SimpleButton';
import {commonStyles} from '../../../styles/commonStyles';
import auth from '@react-native-firebase/auth';
import {
  loginWithEmail,
  logoutFromAuth,
  sendOtp,
} from '../../../../api/authentication/AuthenticationRequests';
import ScreenNames from '../../../strings/ScreenNames';
import {Formik} from 'formik';
import {otpSchema} from './ValidationSchemas';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import TextButton from '../../../components/TextButton';

export default VerificationScreen = ({userDetails}) => {
  const themeRef = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const otpRef = useRef(0);
  const [verificationFunction, setVerificationFunction] = useState(
    userDetails.sendOtpCode.response,
  );
  // console.log('userDetails');
  // console.log(userDetails);
  // console.log('verificationFunction');
  // console.log(verificationFunction);
  // : {signinUsingPhone: true};

  useEffect(() => {
    otpRef?.current.focus();
  }, []);

  const focusField = func => {
    func({otp: true});
  };

  const changeOtp = (func, text) => {
    func('otp', text);
  };

  const submitOtp = async number => {
    console.log('number');
    console.log(number);
    try {
      const verifyOtp = await verificationFunction.confirm(number);
      console.log('verifyOtp');
      console.log(verifyOtp);
      Alert.alert('Success!!');
      const logout = await logoutFromAuth();
      if (logout.isError) {
        Alert.alert('Oops', ErrorCodes[logout.error].message);
        return;
      }
      navigation.navigate(ScreenNames.LoginScreen);
    } catch (error) {
      // console.log('error-ajsdoajskdosjkdoasjk');
      // console.log(error.code);
      Alert.alert('Oops!!', ErrorCodes[error.code.toString()].message);
    }
  };

  const resendOtp = async () => {
    const resendResponse = await sendOtp('+91' + userDetails.phone);
    if (resendResponse.isError) {
      Alert.alert('Oops!!', `${ErrorCodes[resendResponse.error].message}`);
      return;
    }
    setVerificationFunction(resendResponse.response);
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      justifyContent: 'center',
    },
    verifyButton: {
      backgroundColor: themeRef.colors.appThemeColor,
      marginVertical: 20,
    },
    verifyButtonText: {
      color: themeRef.colors.primaryColor,
    },
    heading: {
      color: themeRef.colors.secondaryColor,
    },
    error: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: 18,
      marginHorizontal: 20,
      marginVertical: 2,
      color: themeRef.colors.errorColor,
    },
    resendButton: {
      marginTop: 15,
      color: themeRef.colors.secondaryColor,
    },
  });

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      <HeadingLarge style={[styles.heading]} text={'Verify !!'} />
      <HeadingLarge
        style={[styles.suggestion, styles.heading]}
        text={'We have sent you an varification otp on your phone number'}
      />
      <Formik initialValues={{otp: ''}} validationSchema={otpSchema}>
        {({values, touched, errors, setFieldValue, setTouched}) => (
          <>
            <InputBox
              label={'Otp'}
              focusFunction={focusField.bind(this, setTouched)}
              value={values.otp}
              focused={!!touched.otp}
              otherProps={{
                onChangeText: changeOtp.bind(this, setFieldValue),
              }}
              inputRef={otpRef}
            />
            {!!errors.otp && touched.otp && (
              <Text style={styles.error}>{errors.otp}</Text>
            )}
            <TextButton
              title={'Resend code'}
              textStyle={[styles.suggestion, styles.resendButton]}
              onPress={resendOtp}
            />
            <SimpleButton
              title={'Verify'}
              containerStyle={[styles.verifyButton]}
              textStyle={[styles.verifyButtonText]}
              onPress={submitOtp.bind(this, values.otp.toString())}
            />
          </>
        )}
      </Formik>

      <AppStatusBar dark={themeRef.dark == 'dark'} />
    </View>
  );
};
