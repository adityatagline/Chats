import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {PageHeading} from '../settings/CommonComponents';
import {useTheme} from '@react-navigation/native';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import HeadingLarge from '../../../components/HeadingLarge';
import {commonPageStyles} from './commonPageStyles';
import InputBox from '../../../components/InputBox';
import {useFormik} from 'formik';
import {
  SignupValidationSchema,
  emailValidationRule,
  otpValidationRule,
  phoneValidationRule,
  resetPassword,
} from './ValidationSchemas';
import BaseText from '../../../components/BaseText';
import auth from '@react-native-firebase/auth';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';
import {useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';
import {fontWeights} from '../../../strings/FontfamiliesNames';

const ForgotPasswordScreen = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    ...commonStyles,
    ...commonPageStyles(),
    modeBtn: {
      backgroundColor: 'transparent',
      marginHorizontal: wp(1),
      paddingHorizontal: wp(3),
      borderRadius: hp(1),
    },
    selectedMode: {
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      backgroundColor: themeRef.colors.appThemeColor,
    },
  });

  const [resetField, setResetField] = useState('phone');
  const [status, setStatus] = useState('start');
  const fieldRef = useRef();

  const [formikProps, setFormikProps] = useState({
    validationSchema: Yup.object({
      phone: phoneValidationRule,
      email: emailValidationRule,
    }),
    initialValues: {
      phone: '',
      email: '',
    },
  });

  let formikObj = useFormik(formikProps);
  let {values, setFieldValue, setTouched, touched, errors} = formikObj;

  useEffect(() => {
    fieldRef?.current?.focus();
    if (!!resetField) {
      focusFunc();
    }
  }, [resetField]);

  const changeField = field => {
    setResetField(field);
  };

  const sendLink = async () => {
    setStatus('sent');
    // try {
    //   let response = await auth().sendPasswordResetEmail(values.email);
    //   console.log({response});
    // } catch (error) {
    //   console.log({errorInReset: error});
    // }
  };

  const submitValue = () => {
    if (!!errors[resetField]) {
      setTouched({
        [resetField]: true,
      });
    }
  };

  const focusFunc = (isBlur = false) => {
    if (isBlur) {
      setTouched({});
      return;
    }
    setTouched({[resetField]: true});
  };

  return (
    <View style={commonStyles.screenStyle}>
      <PageHeading
        backButtonProps={{
          name: 'chevron-back',
          size: 30,
          color: themeRef.colors.appThemeColor,
          backScreen: 'Login',
        }}
        backButtonStyle={{
          marginLeft: 0,
        }}
      />
      <HeadingLarge style={[styles.greetLarge]} text={'Forgot password ?'} />
      <HeadingLarge
        style={[styles.greetSmall]}
        text={"Never worry, We'll get you :)"}
      />
      {status == 'start' && (
        <>
          <View
            style={{
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignSelf: 'center',
              marginVertical: hp(2),
            }}>
            <TextButton
              onPress={changeField.bind(this, 'phone')}
              title={'Phone'}
              containerStyle={[
                styles.modeBtn,
                resetField == 'phone' && styles.selectedMode,
              ]}
              textStyle={[
                {
                  color:
                    themeRef.colors[
                      resetField != 'phone' ? 'secondaryColor' : 'primaryColor'
                    ],
                },
              ]}
            />
            <TextButton
              onPress={changeField.bind(this, 'email')}
              title={'Email'}
              containerStyle={[
                styles.modeBtn,
                resetField == 'email' && styles.selectedMode,
              ]}
              textStyle={[
                {
                  color:
                    themeRef.colors[
                      resetField != 'email' ? 'secondaryColor' : 'primaryColor'
                    ],
                },
              ]}
            />
          </View>

          <InputBox
            label={resetField}
            value={values[resetField]}
            focused={!!touched[resetField]}
            focusFunction={focusFunc}
            otherProps={{
              onChangeText: setFieldValue.bind(this, resetField),
              onSubmitEditing: submitValue,
              keyboardType:
                resetField == 'phone' ? 'phone-pad' : 'email-address',
            }}
            inputRef={fieldRef}
          />
          {!!touched[resetField] && !!errors[resetField] && (
            <BaseText
              size={fontSize.medium}
              weight={fontWeights.semiBold}
              color={themeRef.colors.errorColor}
              otherStyles={{
                marginHorizontal: wp(5),
                marginVertical: hp(0.5),
              }}>
              {errors[resetField]}
            </BaseText>
          )}

          {!!values[resetField] && !errors[resetField] && (
            <SimpleButton
              title={'Send Link'}
              onPress={sendLink}
              containerStyle={{
                marginVertical: hp(2),
              }}
            />
          )}
        </>
      )}
      {status == 'sent' && (
        <>
          <BaseText
            color={themeRef.colors.secodaryColor}
            size={fontSize.big}
            weight={fontWeights.medium}
            otherStyles={{
              marginVertical: hp(1),
              alignSelf: 'center',
              textAlign: 'center',
              marginHorizontal: wp(4),
              marginTop: hp(4),
            }}>
            Link sent successfully on your registred Email address.
          </BaseText>
          <BaseText
            color={themeRef.colors.appThemeColor}
            size={fontSize.large}
            weight={fontWeights.bold}
            otherStyles={{
              marginVertical: hp(1),
              alignSelf: 'center',
              textAlign: 'center',
              marginHorizontal: wp(5),
            }}>
            adipatel2626@gmail.com
          </BaseText>
          <SimpleButton
            title={'Resend Link'}
            containerStyle={{
              marginVertical: hp(2),
            }}
          />
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;
