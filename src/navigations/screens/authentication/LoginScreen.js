import {useEffect, useRef, useState} from 'react';
import {Alert, Text, StyleSheet, View, Platform} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStatusBar} from '../../../components/AppStatusBar';
import HeadingLarge from '../../../components/HeadingLarge';
import InputBox from '../../../components/InputBox';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';
import LoadingPage from '../../../components/LoadingPage';
import IconButton from '../../../components/IconButton';
import {commonStyles} from '../../../styles/commonStyles';
import {commonPageStyles} from './commonPageStyles';
import {LoginValidationSchemaWithPhone} from './ValidationSchemas';
import VerificationScreen from './VerificationScreen';
import {
  loginWithPhone,
  loginWithGoogle,
  sendOtp,
} from '../../../../api/authentication/AuthenticationRequests';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';
import {storeUserDataInRedux} from '../../../../redux/authentication/AuthenticationSlice';
import ScreenNames from '../../../strings/ScreenNames';

export default LoginScreen = () => {
  const themeRef = useTheme();
  const phoneRef = useRef(0);
  const passwordRef = useRef(0);
  const [loading, setLoading] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [verificationFunction, setVerificationFunction] = useState();

  useEffect(() => {
    phoneRef?.current.focus();
  }, []);

  const goToSinupPage = () => navigation.replace(ScreenNames.SignupScreen);

  const changePhone = (func, text) => {
    func('phone', text);
  };
  const changePassword = (func, text) => {
    func('password', text);
  };

  const submitPhone = (func, errors) => {
    if (!errors.phone) {
      passwordRef.current.focus();
      func({password: true});
    } else {
      phoneRef.current.blur();
      phoneRef.current.focus();
    }
  };

  const submitPassword = (func, errors) => {
    if (!!errors.email) {
      phoneRef.current.focus();
      func({email: true});
    } else if (!!errors.password) {
      passwordRef.current.blur();
      passwordRef.current.focus();
    } else {
      passwordRef.current.blur();
      func({});
    }
  };

  const focusPassword = (func, isBlur = false) => {
    if (isBlur) {
      func({});
      return;
    }
    func({password: true});
  };

  const focusPhone = (func, isBlur = false) => {
    if (isBlur) {
      func({});
      return;
    }
    func({phone: true});
  };

  const signinWithGoogle = async () => {
    setLoading('Checking info ..');
    const loginResponse = await loginWithGoogle();
    setLoading('');
    if (!!loginResponse.isError) {
      !!ErrorCodes[loginResponse.error.toString()].message &&
        Alert.alert(
          'Oops !!',
          ErrorCodes[loginResponse.error.toString()].message,
        );
      return;
    }
    if (!!loginResponse.response.isNewUser) {
      navigation.navigate(ScreenNames.EnterDetails, {
        previousDetails: {...loginResponse.response},
        withGoogle: true,
      });
    } else {
      dispatch(
        storeUserDataInRedux({userDetails: {...loginResponse.response}}),
      );
    }
  };

  const login = async values => {
    setLoading('Checking info ..');
    const loginResponse = await loginWithPhone({
      phone: values.phone,
      password: values.password,
    });
    if (!!loginResponse.isError) {
      Alert.alert(
        'Oops !!',
        ErrorCodes[loginResponse.error.toString()].message,
      );
      setLoading('');
      return;
    }
    if (!loginResponse.response.phoneVerified) {
      const sendCode = await sendOtp('+91' + values.phone);
      setLoading('');
      setVerificationFunction({
        ...loginResponse.response,
        sendOtpCode: sendCode.response,
      });
      return;
    }
    if (loginResponse.response.isNewUser) {
      navigation.navigate(ScreenNames.EnterDetails, {
        previousDetails: {
          ...loginResponse.response,
        },
      });
    } else {
      dispatch(
        storeUserDataInRedux({userDetails: {...loginResponse.response}}),
      );
    }
  };

  const showError = errors => {
    if (!!errors.phone) {
      Alert.alert(`Errors in phone !!`, errors.phone);
    } else if (!!errors.password) {
      Alert.alert(`Errors in password !!`, errors.password);
    }
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    ...commonPageStyles(),
  });

  if (!!verificationFunction) {
    return (
      <VerificationScreen
        userDetails={!!verificationFunction ? verificationFunction : null}
      />
    );
  } else {
    return (
      <>
        {!!loading && (
          <LoadingPage dark={themeRef.dark} loadingText={loading} />
        )}
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.container, {flexGrow: 1}]}
          extraScrollHeight={5}
          scrollEnabled={false}>
          <View style={[styles.mainDiv, styles.screenStyle]}>
            <HeadingLarge
              style={[styles.greetLarge]}
              text={'Wellcome Back !!'}
            />
            <HeadingLarge
              style={[styles.greetSmall]}
              text={'We missed You :)'}
            />
            <Formik
              initialValues={{
                // phone: Platform.OS == 'ios' ? '7778889990' : '5555228243',
                // password: '00000000aA',
                phone: '',
                password: '',
              }}
              validationSchema={LoginValidationSchemaWithPhone}>
              {({values, touched, errors, setFieldValue, setTouched}) => (
                <>
                  <View style={styles.formDiv}>
                    <InputBox
                      label={'Phone number'}
                      value={values.phone}
                      focused={!!touched.phone}
                      focusFunction={focusPhone.bind(this, setTouched)}
                      otherProps={{
                        onChangeText: changePhone.bind(this, setFieldValue),
                        onSubmitEditing: submitPhone.bind(
                          this,
                          setTouched,
                          errors,
                        ),
                        keyboardType: 'phone-pad',
                      }}
                      inputRef={phoneRef}
                    />
                    {!!touched['phone'] && !!errors['phone'] && (
                      <Text style={styles.error}>{errors['phone']}</Text>
                    )}
                    <InputBox
                      label={'Password'}
                      value={values.password}
                      focused={!!touched.password}
                      focusFunction={focusPassword.bind(this, setTouched)}
                      otherProps={{
                        onChangeText: changePassword.bind(this, setFieldValue),
                        onSubmitEditing: submitPassword.bind(
                          this,
                          setTouched,
                          errors,
                        ),
                      }}
                      inputRef={passwordRef}
                      isPassword
                      eyeColor={
                        themeRef.colors[
                          !!touched.password
                            ? 'appThemeColor'
                            : 'secondaryColor'
                        ]
                      }
                    />
                    {touched.password && !!errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                  </View>
                  <SimpleButton
                    title={'Login'}
                    onPress={
                      !!errors.phone || !!errors.password
                        ? showError.bind(this, errors)
                        : login.bind(this, values)
                    }
                    containerStyle={[
                      styles.loginButton,
                      {
                        backgroundColor:
                          themeRef.colors[
                            !!errors.email || !!errors.password
                              ? 'primaryColor'
                              : 'appThemeColor'
                          ],
                      },
                    ]}
                    textStyle={[
                      styles.loginButtonText,
                      {
                        color:
                          themeRef.colors[
                            !!errors.password || !!errors.phone
                              ? 'appThemeColor'
                              : 'primaryColor'
                          ],
                      },
                    ]}
                  />
                </>
              )}
            </Formik>
            {/* <Text
              style={[styles.orText, {color: themeRef.colors.secondaryColor}]}>
              or
            </Text> */}
            {/* <IconButton
              name={'logo-google'}
              onPress={signinWithGoogle}
              containerStyle={[styles.googleLoginButton]}
              color={themeRef.colors.appThemeColor}
            /> */}

            <View style={[styles.signupDiv]}>
              <Text
                style={[
                  styles.orText,
                  {color: themeRef.colors.secondaryColor},
                ]}>
                Don't have an account ?
              </Text>
              <TextButton
                title={'Sign up'}
                textStyle={styles.otherScreenBtn}
                onPress={goToSinupPage}

                // onPress={testFun}
              />
            </View>
            <TextButton
              title={'Forgot password ??'}
              textStyle={{
                paddingVertical: 0,
                color: themeRef.colors.appThemeColor,
              }}
              onPress={() =>
                navigation.navigate(ScreenNames.ForgotPasswordScreen)
              }
              // onPress={testFun}
            />
            <AppStatusBar />
          </View>
        </KeyboardAwareScrollView>
      </>
    );
  }
};
