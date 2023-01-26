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
  addUserToDatabase,
  loginWithEmail,
  sendOtp,
} from '../../../../api/authentication/AuthenticationRequests';
import {Formik} from 'formik';
import {
  LoginValidationSchema,
  newUserDetails,
  otpSchema,
  phoneNumberSchema,
} from './ValidationSchemas';
import ScreenNames from '../../../strings/ScreenNames';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';

export default EnterDetails = () => {
  const themeRef = useTheme();
  const navigation = useNavigation();
  const firstNameRef = useRef(0);
  const lastNameRef = useRef(0);
  const ageRef = useRef(0);
  // navigation.reset({
  //   index:0,
  //   routes:[{name:screenanem}]
  // })
  const route = useRoute();
  const previousDetails = !!route.params
    ? route.params.previousDetails
    : {newUser: true};

  useEffect(() => {
    firstNameRef?.current.focus();
  }, []);

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
    error: {
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      fontSize: 18,
      marginHorizontal: 20,
      marginVertical: 2,
      color: themeRef.colors.errorColor,
    },
    greetLarge: {
      color: themeRef.colors.appThemeColor,
      textAlign: 'center',
    },
    greetSmall: {
      fontSize: 20,
      color: themeRef.colors.secondaryColor,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  const focusField = (func, field) => {
    func({[field]: true});
  };

  const changeField = (func, field, text) => {
    func(field, text);
  };
  const submitDetail = (setTouched, errors, currentField) => {
    currentField.current.blur();
    if (errors.firstName) {
      firstNameRef.current.focus();
    } else if (errors.lastName) {
      lastNameRef.current.focus();
    } else if (errors.age) {
      ageRef.current.focus();
    } else {
      currentField.current.blur();
    }
  };

  const addDetails = async values => {
    const sendData = await addUserToDatabase({...values});
    if (sendData.isError) {
      Alert.alert('Oops !!', ErrorCodes[sendData.error].message);
      return;
    }
    Alert.alert('Success !!');
  };

  const initialNewUserValues = {
    firstName: '',
    lastName: '',
    age: '',
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, {flexGrow: 1}]}
      extraScrollHeight={5}
      scrollEnabled={false}>
      <View style={[styles.screenStyle, styles.mainDiv]}>
        <HeadingLarge style={[styles.greetLarge]} text={'Basic Details !!'} />
        <HeadingLarge style={[styles.greetSmall]} text={'Let me know you :)'} />
        <Formik
          initialValues={initialNewUserValues}
          validationSchema={newUserDetails}>
          {({values, touched, errors, setFieldValue, setTouched}) => (
            <>
              {previousDetails.newUser && (
                <>
                  <InputBox
                    label={'First Name'}
                    focusFunction={focusField.bind(
                      this,
                      setTouched,
                      'firstName',
                    )}
                    value={values.firstName}
                    focused={!!touched.firstName}
                    inputRef={firstNameRef}
                    otherProps={{
                      onChangeText: changeField.bind(
                        this,
                        setFieldValue,
                        'firstName',
                      ),
                      onSubmitEditing: submitDetail.bind(
                        this,
                        setTouched,
                        errors,
                        firstNameRef,
                      ),
                    }}
                  />
                  {touched.firstName && !!errors.firstName && (
                    <Text style={styles.error}>{errors.firstName}</Text>
                  )}
                  <InputBox
                    label={'Last Name'}
                    focusFunction={focusField.bind(
                      this,
                      setTouched,
                      'lastName',
                    )}
                    value={values.lastName}
                    focused={!!touched.lastName}
                    inputRef={lastNameRef}
                    otherProps={{
                      onChangeText: changeField.bind(
                        this,
                        setFieldValue,
                        'lastName',
                      ),
                      onSubmitEditing: submitDetail.bind(
                        this,
                        setTouched,
                        errors,
                        lastNameRef,
                      ),
                    }}
                  />
                  {touched.lastName && !!errors.lastName && (
                    <Text style={styles.error}>{errors.lastName}</Text>
                  )}
                  <InputBox
                    label={'Age'}
                    focusFunction={focusField.bind(this, setTouched, 'age')}
                    value={values.age}
                    focused={!!touched.age}
                    inputRef={ageRef}
                    otherProps={{
                      onChangeText: changeField.bind(
                        this,
                        setFieldValue,
                        'age',
                      ),
                      onSubmitEditing: submitDetail.bind(
                        this,
                        setTouched,
                        errors,
                        ageRef,
                      ),
                    }}
                  />
                  {touched.age && !!errors.age && (
                    <Text style={styles.error}>{errors.age}</Text>
                  )}
                </>
              )}
              <SimpleButton
                title={previousDetails.newUser ? 'Submit' : 'Next'}
                containerStyle={[styles.verifyButton]}
                textStyle={[styles.verifyButtonText]}
                onPress={
                  !errors.firstName &&
                  !errors.lastName &&
                  !errors.age &&
                  addDetails.bind(this, values)
                }
              />
            </>
          )}
        </Formik>

        <AppStatusBar dark={themeRef.dark == 'dark'} />
      </View>
    </KeyboardAwareScrollView>
  );
};
