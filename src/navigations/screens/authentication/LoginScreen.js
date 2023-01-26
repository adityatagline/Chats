import {useNavigation, useTheme} from '@react-navigation/native';
import {Formik} from 'formik';
import {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
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

export default LoginScreen = () => {
  const themeRef = useTheme();
  const emailRef = useRef(0);
  const passwordRef = useRef(0);
  const [loginUsingEmail, setLoginUsingEmail] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    emailRef.current.focus();
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

  const focusEmail = func => {
    func({email: true});
  };
  const focusPassword = func => {
    func({password: true});
  };
  const focusPhone = func => {
    func({phone: true});
  };

  const signinWithGoogle = async () => {
    const loginResponse = await loginWithGoogle();
    if (!!loginResponse.isError) {
      // Alert.alert('Oops !!', loginResponse.error);
      return;
    }
    if (!loginResponse.response.emailVerified) {
      navigation.navigate(ScreenNames.VerificationScreen, {
        verifyEmail: true,
      });
    }
    Alert.alert('Done !', 'Login SuccessFully');
  };

  const login = async values => {
    const loginResponse = await loginWithEmail({
      email: values.email,
      password: values.password,
    });
    if (!!loginResponse.isError) {
      Alert.alert(
        'Oops !!',
        ErrorCodes[loginResponse.error.toString()].message,
      );
      return;
    }

    // if (!loginResponse.response.emailVerified) {
    //   navigation.navigate(ScreenNames.VerificationScreen);
    // }
    Alert.alert('Done !', 'Login SuccessFully');
    navigation.navigate(ScreenNames.EnterDetails, {
      previousDetails: {
        ...loginResponse.response,
        newUser: true,
      },
    });
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

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, {flexGrow: 1}]}
      extraScrollHeight={5}
      scrollEnabled={false}>
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
                <InputBox
                  label={loginUsingEmail ? 'Email' : 'Phone number'}
                  value={loginUsingEmail ? values.email : values.phone}
                  focused={loginUsingEmail ? !!touched.email : !!touched.phone}
                  focusFunction={
                    loginUsingEmail
                      ? focusEmail.bind(this, setTouched)
                      : focusPhone.bind(this, setTouched)
                  }
                  otherProps={{
                    onChangeText: loginUsingEmail
                      ? changeEmail.bind(this, setFieldValue)
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
        <Text style={[styles.orText, {color: themeRef.colors.secondaryColor}]}>
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
          />
        </View>
        <AppStatusBar />
      </View>
    </KeyboardAwareScrollView>
  );
};
