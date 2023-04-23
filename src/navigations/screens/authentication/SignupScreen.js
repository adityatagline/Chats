import {useNavigation, useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, View, Alert, Modal} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStatusBar} from '../../../components/AppStatusBar';
import HeadingLarge from '../../../components/HeadingLarge';
import InputBox from '../../../components/InputBox';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';
import {commonStyles} from '../../../styles/commonStyles';
import {commonPageStyles} from './commonPageStyles';
import {
  loginWithGoogle,
  signinToFirebase,
} from '../../../../api/authentication/AuthenticationRequests';
import {SignupValidationSchema} from './ValidationSchemas';
import IconButton from '../../../components/IconButton';
import ScreenNames from '../../../strings/ScreenNames';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';
import VerificationScreen from './VerificationScreen';
import {useDispatch} from 'react-redux';
import {setLoadingState} from '../../../../redux/loading/LoadingSlice';
import LoadingPage from '../../../components/LoadingPage';
import {storeUserDataInRedux} from '../../../../redux/authentication/AuthenticationSlice';
import BaseText from '../../../components/BaseText';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {fontWeights} from '../../../strings/FontfamiliesNames';

export default SignupScreen = () => {
  const themeRef = useTheme();
  const phoneRef = useRef(0);
  const emailRef = useRef(0);
  const passwordRef = useRef(0);
  const passwordRef2 = useRef(0);
  const [validationError, setValidationError] = useState('');
  const [verificationFunction, setVerificationFunction] = useState();
  // console.log({verificationFunction});
  const [loading, setLoading] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    phoneRef?.current.focus();
  }, []);

  const goToLoginPage = () => navigation.replace(ScreenNames.LoginScreen);

  const changeEmail = (func, text) => {
    func('email', text);
  };
  const changePhone = (func, text) => {
    func('phone', text);
  };
  const changePassword = (func, text) => {
    func('password', text);
  };
  const changePassword2 = (func, values, text) => {
    setValidationError(text != values.password ? 'Password not matched' : '');
    func('password2', text);
  };

  const submitPhone = (func, errors) => {
    if (!errors.phone) {
      emailRef.current.focus();
      func({email: true});
    } else {
      phoneRef.current.blur();
      phoneRef.current.focus();
    }
  };
  const submitEmail = (func, errors) => {
    if (!!errors.phone) {
      phoneRef.current.focus();
      func({phone: true});
    } else if (!errors.email) {
      passwordRef.current.focus();
      func({password: true});
    } else {
      emailRef.current.blur();
      emailRef.current.focus();
    }
  };
  const submitPassword = (func, errors) => {
    if (!!errors.phone) {
      phoneRef.current.focus();
      func({phone: true});
    } else if (!!errors.email) {
      emailRef.current.focus();
      func({email: true});
    } else if (!!errors.password) {
      passwordRef.current.blur();
      passwordRef.current.focus();
    } else {
      passwordRef2.current.focus();
      func({password2: true});
    }
  };
  const submitPassword2 = (func, errors, value) => {
    // console.log(value);
    if (!!errors.phone) {
      phoneRef.current.focus();
      func({phone: true});
    } else if (!!errors.email) {
      emailRef.current.focus();
      func({email: true});
    } else if (!!errors.password) {
      passwordRef.current.focus();
      func({password: true});
    } else if (value.password != value.password2) {
      passwordRef2.current.blur();
      passwordRef2.current.focus();
      setValidationError('Password not matched');
    } else {
      passwordRef2.current.blur();
      func({});
      setValidationError('');
    }
  };

  const focusEmail = func => {
    func({email: true});
  };
  const focusPhone = func => {
    func({phone: true});
  };
  const focusPassword = func => {
    func({password: true});
  };
  const focusPassword2 = func => {
    func({password2: true});
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
      Alert.alert('Done !', 'Login SuccessFully');
      dispatch(
        storeUserDataInRedux({userDetails: {...loginResponse.response}}),
      );
    }
  };

  const askForRecheck = (values, errors) => {
    if (!!errors.phone) {
      Alert.alert('Oops', errors.phone);
      return;
    } else if (!!errors.email) {
      Alert.alert('Oops', errors.email);
      return;
    } else if (!!errors.password) {
      Alert.alert('Oops', errors.password);
      return;
    } else if (!!errors.password2) {
      Alert.alert('Oops', errors.password2);
      return;
    }
    if (values.password != values.password2) {
      Alert.alert('Oops', 'Both password not matched !!');
      return;
    }
    Alert.alert(
      'Are you sure with these details ?',
      `phone number : ${values.phone}`,
      [
        {text: 'Confirm', onPress: () => signup(values, errors)},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  const signup = async (values, errors) => {
    // Alert.alert('see', values.email.replaceAll('.', '-').replaceAll('@', '--'));
    // console.log('values');
    // console.log(values);

    setLoading('Registering you into our sweet record ..');
    const signupresponse = await signinToFirebase({
      email: values.email,
      password: values.password,
      phone: values.phone,
    });
    // console.log({signupresponse});
    setLoading('');

    if (!!signupresponse.isError) {
      Alert.alert('Oops', ErrorCodes[signupresponse.error].message);
      return;
    }
    setVerificationFunction({...signupresponse.response});
    // console.log(signupresponse.response);
    // setShowOtpModal(true);
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    ...commonPageStyles(),
  });

  if (!!verificationFunction) {
    return (
      <VerificationScreen
        closeFunction={() => verificationFunction()}
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
          contentContainerStyle={[commonStyles.container, {flexGrow: 1}]}
          extraScrollHeight={5}
          scrollEnabled={false}>
          <View style={[styles.mainDiv, commonStyles.screenStyle]}>
            <HeadingLarge
              style={[styles.greetLarge]}
              text={'Happy to have you !!'}
            />
            <HeadingLarge
              style={[styles.greetSmall]}
              text={'Register for free !!'}
            />

            <Formik
              initialValues={{
                phone: '',
                //  '5555228243',
                email: '',
                //  'test@test.com',
                password: '',
                //  '00000000aA',
                password2: '',
                //  '00000000aA',
              }}
              validationSchema={SignupValidationSchema}>
              {({values, touched, errors, setFieldValue, setTouched}) => (
                <>
                  <View style={styles.formDiv}>
                    <InputBox
                      label={'Phone'}
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
                    {touched.phone && !!errors.phone && (
                      <Text style={styles.error}>{errors.phone}</Text>
                    )}
                    <InputBox
                      label={'Email'}
                      value={values.email}
                      focused={!!touched.email}
                      focusFunction={focusEmail.bind(this, setTouched)}
                      otherProps={{
                        onChangeText: changeEmail.bind(this, setFieldValue),
                        onSubmitEditing: submitEmail.bind(
                          this,
                          setTouched,
                          errors,
                        ),
                        keyboardType: 'email-address',
                      }}
                      inputRef={emailRef}
                    />
                    {touched.email && !!errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                    <BaseText
                      weight={fontWeights.semiBold}
                      otherStyles={{
                        marginHorizontal: widthPercentageToDP(5),
                        marginTop: heightPercentageToDP(0.5),
                      }}>
                      This email will be used in reset password.
                    </BaseText>
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
                      // isPassword
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                    <InputBox
                      label={'ReEnter Password'}
                      value={values.password2}
                      focused={!!touched.password2}
                      focusFunction={focusPassword2.bind(this, setTouched)}
                      otherProps={{
                        onChangeText: changePassword2.bind(
                          this,
                          setFieldValue,
                          values,
                        ),
                        onSubmitEditing: submitPassword2.bind(
                          this,
                          setTouched,
                          errors,
                          values,
                        ),
                      }}
                      inputRef={passwordRef2}
                      isPassword
                    />
                    {touched.password2 && !!validationError && (
                      <Text style={styles.error}>{validationError}</Text>
                    )}
                  </View>
                  <SimpleButton
                    title={'Sign Up'}
                    onPress={askForRecheck.bind(this, values, errors)}
                    containerStyle={[
                      styles.loginButton,
                      {
                        backgroundColor:
                          themeRef.colors[
                            !errors.email && !errors.password
                              ? 'appThemeColor'
                              : 'primaryColor'
                          ],
                      },
                    ]}
                    textStyle={[
                      styles.loginButtonText,
                      {
                        color:
                          themeRef.colors[
                            !!errors.password || !!errors.email
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
            </Text>
            <IconButton
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
                Already have an account ?
              </Text>
              <TextButton
                title={'Log in'}
                textStyle={styles.otherScreenBtn}
                onPress={goToLoginPage}
              />
            </View>
            <AppStatusBar />
          </View>
        </KeyboardAwareScrollView>
      </>
    );
  }
};
