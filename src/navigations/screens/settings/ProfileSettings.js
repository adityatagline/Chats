import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Keyboard,
  Alert,
} from 'react-native';
import React from 'react';
import {
  commonStyles,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames, {
  fontWeights,
} from '../../../strings/FontfamiliesNames';
import {PageHeading, PageName} from './CommonComponents';
import {useDispatch, useSelector} from 'react-redux';
import InputBox from '../../../components/InputBox';
import IconButton from '../../../components/IconButton';
import SimpleButton from '../../../components/SimpleButton';
import TextButton from '../../../components/TextButton';
import {useFormik} from 'formik';
import {EditProfileValidationSchema} from '../authentication/ValidationSchemas';
import {commonPageStyles} from '../authentication/commonPageStyles';
import {useRef} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import BaseModal from '../../../components/BaseModal';
import BaseText from '../../../components/BaseText';
import {updateProfileOnFirebase} from '../../../../api/authentication/AuthenticationRequests';
import {
  changeUserDetails,
  logout,
} from '../../../../redux/authentication/AuthenticationSlice';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {useTheme} from '@react-navigation/native';
import MediaPickerOptionModal from '../../../components/MediaPickerOptionModal';
import {uploadProfilePic} from '../../../../api/chat/firebaseSdkRequests';
import LoadingPage from '../../../components/LoadingPage';
import {apiRequest} from '../../../../api/global/BaseApiRequestes';
import {updateProfilePhotoInDB} from '../../../../api/chat/ChatRequests';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import ChatAvatar from '../../../components/ChatAvatar';
import {clearAllChats} from '../../../../redux/chats/ChatSlice';
import ErrorCodes from '../../../../api/authentication/ErrorCodes';

export default ProfileSettings = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    ...commonPageStyles(),
    mainDiv: {
      marginTop: StatusBarHeight,
    },
    pageHeading: {
      marginLeft: wp(10),
      fontSize: fontSize.heading,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.appThemeColor,
    },
    settingItem: {
      flexDirection: 'row',
      marginVertical: hp(1),
      paddingVertical: hp(1),
      borderRadius: 15,
      paddingHorizontal: wp(8),
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: wp(5),
    },
    settingItemLabel: {
      fontSize: fontSize.large,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
    },
    listDiv: {
      marginTop: hp(2),
    },
    modalDetailComponent: {
      flexDirection: 'row',
      marginVertical: hp(0.5),
      marginHorizontal: wp(2),
    },
    detailValue: {
      marginHorizontal: wp(2),
      flex: 1,
    },
    confirmHeading: {
      alignSelf: 'center',
      marginBottom: hp(2),
    },
    confirmBtnContainer: {
      marginTop: hp(3),
      marginBottom: hp(2),
    },
    profilePhoto: {
      height: hp(15),
      width: hp(15),
      borderRadius: 500,
      alignSelf: 'center',
    },
  });

  const dispatch = useDispatch();
  const user = useSelector(state => state.authenticationSlice).user;
  // console.log({userInAuth: user});
  const firstNameRef = useRef();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPickerOption, setShowPickerOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    firstNameRef?.current?.focus();
  }, [firstNameRef]);

  const {values, errors, touched, setFieldTouched, setFieldValue} = useFormik({
    validationSchema: EditProfileValidationSchema,
    initialValues: {
      firstName: !!user.firstName ? user.firstName : '',
      lastName: !!user.lastName ? user.lastName : '',
      age: !!user.age ? user.age : '',
      email: !!user.email ? user.email : '',
    },
  });

  const openPickerModal = () => setShowPickerOption(true);

  const showFinalConfirmation = () => {
    Keyboard.dismiss();
    setShowConfirmation(true);
  };

  const updateUserProfile = async () => {
    const response = await updateProfileOnFirebase(
      {
        ...user,
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        email: values.email,
      },
      user.username,
    );
    setShowConfirmation(false);
    if (response.isError) {
      Alert.alert(
        'Oops',
        !!ErrorCodes?.[response?.error]?.message
          ? ErrorCodes?.[response?.error]?.message
          : response.error.toString(),
      );
      return;
    }
    if (!!response?.data?.isEmailReset) {
      dispatch(clearAllChats());
      dispatch(logout());
    }
    if (!!response.data) {
      dispatch(changeUserDetails({userDetails: {...response.data}}));
    }
  };

  const updatePhoto = async imageObj => {
    try {
      setIsLoading(true);
      // console.log({imageObj});
      setShowPickerOption(false);
      const response = await uploadProfilePic({...imageObj}, user.username);
      if (response.isError) {
        Alert.alert('Oops', response.error);
      }
      // console.log({fireStorageResponse: response});
      const updateToDetails = await updateProfilePhotoInDB(user.username, {
        ...response.data,
      });
      // console.log({updateToDetails});
      if (!updateToDetails.isError) {
        dispatch(
          changeUserDetails({
            userDetails: {profilePhotoObject: {...updateToDetails.data}},
          }),
        );
      }
      setIsLoading(false);
    } catch (error) {
      // console.log({errorinupdatePhoto: error});
    }
  };

  const FieldArray = [
    {field: 'firstName', label: 'First Name'},
    {field: 'lastName', label: 'Last Name'},
    {field: 'age', label: 'Age'},
    {field: 'email', label: 'Email ID'},
  ];

  const renderModalComponent = ({item}) => {
    return (
      <View key={item.title} style={styles.modalDetailComponent}>
        <BaseText
          weight={fontWeights.semiBold}
          color={themeRef.colors.appThemeColor}
          size={fontSize.big}>
          {item.label}
        </BaseText>
        <BaseText
          weight={fontWeights.bold}
          color={themeRef.colors.secondaryColor}
          size={fontSize.big}
          otherStyles={styles.detailValue}>
          {values[item.field]}
        </BaseText>
      </View>
    );
  };

  const renderFieldInput = ({item}) => {
    return (
      <>
        <InputBox
          label={item.label}
          value={values[item.field]}
          focused={!!touched[item.field]}
          focusFunction={setFieldTouched.bind(this, item.field, true)}
          otherProps={{
            onChangeText: setFieldValue.bind(this, item.field),
            onBlur: setFieldTouched.bind(this, item.field, false),
          }}
        />
        {!!touched[item.field] && !!errors[item.field] && (
          <Text style={[styles.error, {marginHorizontal: wp(10)}]}>
            {errors[item.field]}
          </Text>
        )}
      </>
    );
  };

  return (
    <>
      <BaseModal visibility={!!showConfirmation} canClosable>
        <BaseText
          size={fontSize.extralarge}
          weight={fontWeights.bold}
          color={themeRef.colors.appThemeColor}
          otherStyles={[styles.confirmHeading]}>
          Confirm Details
        </BaseText>
        {FieldArray.map(item => renderModalComponent({item}))}
        <SimpleButton
          title={'Confirm'}
          containerStyle={styles.confirmBtnContainer}
          onPress={updateUserProfile}
        />
        <TextButton
          title={'cancel'}
          textStyle={[
            commonStyles.baseModalCancelBtn,
            {
              color: themeRef.colors.errorColor,
            },
          ]}
          onPress={() => setShowConfirmation(false)}
        />
      </BaseModal>
      {!!isLoading && (
        <LoadingPage dark={themeRef.dark} loadingText="Updating Profile .." />
      )}
      <MediaPickerOptionModal
        visibility={!!showPickerOption}
        closeActions={() => setShowPickerOption(false)}
        mediaType="photo"
        afterChoosehandler={updatePhoto}
        isProfilePhoto
      />
      <View style={[styles.mainDiv]}>
        <PageHeading
          middleComponenet={<PageName name={'Edit Profile'} />}
          backButtonProps={{
            name: 'chevron-back',
            size: 30,
            color: themeRef.colors.secondaryColor,
            backScreen: 'Settings',
          }}
          backNavigationScreen={ScreenNames.TopTabScreens.ProfileScreen}
        />
        <ScrollView
          style={styles.listDiv}
          bounces={false}
          contentContainerStyle={{paddingBottom: hp(20)}}>
          <View
            style={
              {
                // marginVertical: hp(1),
              }
            }>
            {!!user?.profilePhotoObject?.uri ? (
              <ImageCompWithLoader
                // source={{
                //   uri: user.profilePhotoObject.uri,
                // }}
                source={imageUrlStrings.lemon}
                ImageStyles={styles.profilePhoto}
                resizeMode="contain"
              />
            ) : (
              <ChatAvatar
                size={hp(18)}
                isCircle
                color={themeRef.colors.appThemeColor}
                containerStyle={{
                  marginVertical: -hp(2),
                }}
              />
            )}

            <IconButton
              name="pencil"
              size={20}
              color={themeRef.colors.primaryColor}
              containerStyle={{
                backgroundColor: themeRef.colors.appThemeColor,
                height: hp(5),
                width: hp(5),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 500,
                position: 'absolute',
                bottom: hp(0),
                marginLeft: wp(55),
                borderWidth: 3,
                borderColor: themeRef.colors.primaryColor,
              }}
              onPress={openPickerModal}
            />
          </View>
          {FieldArray.map(item => renderFieldInput({item}))}
          <SimpleButton
            title={'Update Profile'}
            containerStyle={{
              marginVertical: hp(3),
            }}
            onPress={showFinalConfirmation}
          />
        </ScrollView>
      </View>
    </>
  );
};
