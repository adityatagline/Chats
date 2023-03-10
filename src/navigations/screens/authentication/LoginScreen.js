import {useNavigation, useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppStatusBar} from '../../../components/AppStatusBar';
import HeadingLarge from '../../../components/HeadingLarge';
import InputBox from '../../../components/InputBox';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';
import {commonStyles} from '../../../styles/commonStyles';
import {commonPageStyles} from './commonPageStyles';
import {
  loginWithEmail,
  loginWithGoogle,
} from '../../../../api/authentication/AuthenticationRequests';
import {
  LoginValidationSchema,
  LoginValidationSchemaWithPhone,
} from './ValidationSchemas';
import IconButton from '../../../components/IconButton';
import ScreenNames from '../../../strings/ScreenNames';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';
import {useDispatch, useSelector} from 'react-redux';
import {setLoadingState} from '../../../../redux/loading/LoadingSlice';
import LoadingPage from '../../../components/LoadingPage';
import {storeUserDataInRedux} from '../../../../redux/authentication/AuthenticationSlice';

export default LoginScreen = () => {
  const themeRef = useTheme();
  const emailRef = useRef(0);
  const passwordRef = useRef(0);
  const [loginUsingEmail, setLoginUsingEmail] = useState(true);
  const [loading, setLoading] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef?.current.focus();
    // emailRef?.current.blur();
  }, [loginUsingEmail]);

  const goToSinupPage = () => navigation.replace(ScreenNames.SignupScreen);

  const toggleLoginScheme = () => {
    emailRef.current.blur();
    setLoginUsingEmail(!loginUsingEmail);
  };

  const changeEmail = (func, text) => {
    func('email', text);
  };
  const changePhone = (func, text) => {
    func('phone', text);
  };
  const changePassword = (func, text) => {
    func('password', text);
  };

  const submitEmail = (func, errors) => {
    if (!errors.email) {
      passwordRef.current.focus();
      func({password: true});
    } else {
      emailRef.current.blur();
      emailRef.current.focus();
    }
  };
  const submitPhone = (func, errors) => {
    if (!errors.phone) {
      passwordRef.current.focus();
      func({password: true});
    } else {
      emailRef.current.blur();
      emailRef.current.focus();
    }
  };
  const submitPassword = (func, errors) => {
    if (!!errors.email) {
      emailRef.current.focus();
      func({email: true});
    } else if (!!errors.password) {
      passwordRef.current.blur();
      passwordRef.current.focus();
    } else {
      passwordRef.current.blur();
      func({});
    }
  };

  const focusEmail = (func, isBlur = false) => {
    if (isBlur) {
      func({});
      return;
    }
    func({email: true});
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
    console.log(loginResponse);
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

  const testFun = () => {
    emailRef.current.focus();
  };

  const login = async values => {
    setLoading('Checking info ..');
    const loginResponse = await loginWithEmail({
      email: values.email,
      password: values.password,
    });
    setLoading('');
    if (!!loginResponse.isError) {
      Alert.alert(
        'Oops !!',
        ErrorCodes[loginResponse.error.toString()].message,
      );
      return;
    }
    console.log('loginResponse');
    console.log(loginResponse);
    Alert.alert('Done !', 'Login SuccessFully');
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
    console.log('errors');
    console.log(errors);
    if (!!errors.email) {
      Alert.alert(`Errors in email !!`, errors.email);
    } else if (!!errors.phone) {
      Alert.alert(`Errors in phone !!`, errors.phone);
    } else if (!!errors.password) {
      Alert.alert(`Errors in password !!`, errors.password);
    }
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    ...commonPageStyles(),
  });

  // const dumyFun = props => {
  //   console.log({props});
  //   alert('pressed');
  // };

  return (
    <>
      {!!loading && <LoadingPage dark={themeRef.dark} loadingText={loading} />}
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.container, {flexGrow: 1}]}
        extraScrollHeight={5}
        scrollEnabled={false}>
        {/* <TouchableOpacity
          style={{marginTop: '10%'}}
          onPress={dumyFun.bind(this, 'id')}>
          <Text>Hello</Text>
        </TouchableOpacity> */}
        <View style={[styles.mainDiv, styles.screenStyle]}>
          <HeadingLarge style={[styles.greetLarge]} text={'Wellcome Back !!'} />
          <HeadingLarge style={[styles.greetSmall]} text={'We missed You :)'} />
          <TextButton
            title={loginUsingEmail ? 'Email' : 'Phone'}
            onPress={toggleLoginScheme}
          />
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={
              loginUsingEmail
                ? LoginValidationSchema
                : LoginValidationSchemaWithPhone
            }>
            {({values, touched, errors, setFieldValue, setTouched}) => (
              <>
                <View style={styles.formDiv}>
                  {console.log({
                    values,
                    touched,
                    errors,
                    setFieldValue,
                    setTouched,
                  })}
                  <InputBox
                    label={loginUsingEmail ? 'Email' : 'Phone number'}
                    value={loginUsingEmail ? values.email : values.phone}
                    focused={
                      loginUsingEmail ? !!touched.email : !!touched.phone
                    }
                    focusFunction={
                      loginUsingEmail
                        ? focusEmail.bind(this, setTouched)
                        : focusPhone.bind(this, setTouched)
                    }
                    otherProps={{
                      onChangeText: loginUsingEmail
                        ? changeEmail.bind(this, setFieldValue, 'okkk')
                        : changePhone.bind(this, setFieldValue),
                      onSubmitEditing: loginUsingEmail
                        ? submitEmail.bind(this, setTouched, errors)
                        : submitPhone.bind(this, setTouched, errors),
                    }}
                    inputRef={emailRef}
                  />
                  {!!touched[loginUsingEmail ? 'email' : 'phone'] &&
                    !!errors[loginUsingEmail ? 'email' : 'phone'] && (
                      <Text style={styles.error}>
                        {errors[loginUsingEmail ? 'email' : 'phone']}
                      </Text>
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
                  />
                  {touched.password && !!errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>
                <SimpleButton
                  title={'Login'}
                  onPress={
                    (
                      loginUsingEmail
                        ? !!errors.email || !!errors.password
                        : !!errors.phone
                    )
                      ? showError.bind(this, errors)
                      : login.bind(this, values)
                  }
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
          <Text
            style={[styles.orText, {color: themeRef.colors.secondaryColor}]}>
            or
          </Text>
          <IconButton
            name={'logo-google'}
            onPress={signinWithGoogle}
            containerStyle={[styles.googleLoginButton]}
            color={themeRef.colors.appThemeColor}
          />
          <View style={[styles.signupDiv]}>
            <Text
              style={[styles.orText, {color: themeRef.colors.secondaryColor}]}>
              Don't have an account ?
            </Text>
            <TextButton
              title={'Sign up'}
              textStyle={styles.otherScreenBtn}
              onPress={goToSinupPage}
              // onPress={testFun}
            />
          </View>
          <AppStatusBar />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
