import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {useEffect, useRef, useState, React} from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
import {AppStatusBar} from '../../../components/AppStatusBar';
import HeadingLarge from '../../../components/HeadingLarge';
import InputBox from '../../../components/InputBox';
import SimpleButton from '../../../components/SimpleButton';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import {
  addUserToDatabase,
  checkUserName,
} from '../../../../api/authentication/AuthenticationRequests';
import {Formik} from 'formik';
import {newUserDetails} from './ValidationSchemas';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';
import {useDispatch} from 'react-redux';
import {storeUserDataInRedux} from '../../../../redux/authentication/AuthenticationSlice';

export default EnterDetails = () => {
  const themeRef = useTheme();
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
      fontSize: fontSize.medium,
      marginHorizontal: 20,
      marginVertical: 2,
      color: themeRef.colors.errorColor,
    },
    greetLarge: {
      color: themeRef.colors.appThemeColor,
      textAlign: 'center',
    },
    greetSmall: {
      fontSize: fontSize.large,
      color: themeRef.colors.secondaryColor,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  const route = useRoute();
  const previousDetails = !!route.params
    ? route.params.previousDetails
    : {isNewUser: true};

  const userNameRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const ageRef = useRef();
  const [isUsername, setIsUsername] = useState(false);

  const dipatch = useDispatch();

  useEffect(() => {
    userNameRef?.current?.focus();
  }, []);

  const focusField = (func, field) => {
    func({[field]: true});
  };

  const changeField = (func, field, text) => {
    !!isUsername && setIsUsername(false);
    func(field, text);
  };

  const checkForUserNameAvaibility = async userName => {
    // console.log({userName});
    if (!userName) {
      Alert.alert('Enter username first !!');
      userNameRef.current.focus();
      return;
    }
    try {
      const response = await checkUserName(userName);
      if (!response.isError) {
        setIsUsername(true);
        userNameRef.current.focus();
        return false;
      } else if (response.isError && response.error != 'noData') {
        Alert.alert('Oops', 'Something went wrong.Please Try again');
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Oops', 'Something went wrong.Please Try again');
      return false;
    }
  };

  const submitDetail = (errors, currentField) => {
    currentField.current.blur();
    if (errors.username) {
      userNameRef.current.focus();
    } else if (errors.firstName) {
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
    const avaibility = await checkForUserNameAvaibility(values.username);
    if (!avaibility) {
      setIsUsername(true);
      return;
    }
    const sendData = await addUserToDatabase(
      previousDetails.username,
      values.username,
      {
        ...previousDetails,
        ...values,
        isNewUser: false,
      },
    );
    if (sendData.isError) {
      Alert.alert('Oops !!', ErrorCodes[sendData.error].message);
      return;
    }
    // console.log({sendData});
    dipatch(storeUserDataInRedux({userDetails: {...sendData.response}}));
  };

  const initialNewUserValues = {
    username: '',
    firstName: !!previousDetails.firstName ? previousDetails.firstName : '',
    lastName: !!previousDetails.firstName ? previousDetails.lastName : '',
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
              {previousDetails.isNewUser && (
                <>
                  <InputBox
                    label={'Username'}
                    focusFunction={focusField.bind(
                      this,
                      setTouched,
                      'username',
                    )}
                    value={values.username}
                    focused={!!touched.username}
                    inputRef={userNameRef}
                    otherProps={{
                      onChangeText: changeField.bind(
                        this,
                        setFieldValue,
                        'username',
                      ),
                      onSubmitEditing: submitDetail.bind(
                        this,
                        errors,
                        userNameRef,
                      ),
                      onBlur: checkForUserNameAvaibility.bind(
                        this,
                        values.username,
                      ),
                    }}
                  />
                  {!!errors.username && (
                    <Text style={styles.error}>{errors.username}</Text>
                  )}
                  {!!isUsername && (
                    <Text style={styles.error}>
                      Sorry , this username is taken already. Plaease choose
                      different one !!
                    </Text>
                  )}
                  <Text style={styles.error}>
                    Username must be unique and it can not changed in future !!
                  </Text>
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
                      onSubmitEditing: submitDetail.bind(this, errors, ageRef),
                    }}
                  />
                  {touched.age && !!errors.age && (
                    <Text style={styles.error}>{errors.age}</Text>
                  )}
                </>
              )}
              <SimpleButton
                title={previousDetails.isNewUser ? 'Submit' : 'Next'}
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
