import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseText from '../../../components/BaseText';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {PageHeading} from '../settings/CommonComponents';
import ScreenNames from '../../../strings/ScreenNames';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useEffect, useRef, useState} from 'react';
import {
  changeGroupName,
  getGroupInfo,
  getGroupsOfUser,
  getStrangerInfoFromDB,
  removeAdmin,
  removeMember,
  updateGPProfilePhotoInDB,
  updateProfilePhotoInDB,
} from '../../../../api/chat/ChatRequests';
import {FlatList} from 'react-native';
import ChatAvatar from '../../../components/ChatAvatar';
import IconButton from '../../../components/IconButton';
import BaseModal from '../../../components/BaseModal';
import TextButton from '../../../components/TextButton';
import {makeAdmin} from '../../../../api/chat/ChatRequests';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';
import MediaPickerOptionModal from '../../../components/MediaPickerOptionModal';
import {
  sendGPMessageToFB,
  uploadProfilePic,
} from '../../../../api/chat/firebaseSdkRequests';
import {
  storeMessageToGroup,
  updateGroup,
} from '../../../../redux/chats/ChatSlice';
import {useFormik} from 'formik';
import {groupNameValidation} from '../authentication/ValidationSchemas';
import {commonPageStyles} from '../authentication/commonPageStyles';
import SimpleButton from '../../../components/SimpleButton';

const GroupChatInfoScreen = () => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    groupPhoto: {
      height: hp(25),
      width: hp(25),
      borderRadius: 500,
      alignSelf: 'center',
      // backgroundColor: 'red',
    },
    userPhoto: {
      height: hp(5),
      width: hp(5),
      borderRadius: 500,
      // backgroundColor: 'red',
      alignSelf: 'center',
      marginLeft: wp(1),
    },
    adminLabel: {
      backgroundColor: themeRef.colors.appThemeColor,
      paddingVertical: hp(0.2),
      paddingHorizontal: wp(2),
      borderRadius: hp(0.5),
      overflow: 'hidden',
      marginHorizontal: wp(2),
    },
    settingItem: {
      flexDirection: 'row',
      marginVertical: hp(1),
      marginHorizontal: wp(2),
      borderRadius: 15,
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: wp(5),
      alignSelf: 'center',
    },
  });

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const groupId = route?.params?.groupId;

  const chatSliceRef = useSelector(state => state.chatSlice);
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const [groupInfo, setGroupInfo] = useState();
  const isAdmin = !!groupInfo?.admins?.includes(currentUser.username);
  const [groupMembers, setGroupMembers] = useState([]);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPickerOption, setShowPickerOption] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const groupNameRef = useRef();

  const {values, errors, setFieldValue, setTouched, touched} = useFormik({
    validationSchema: groupNameValidation,
    initialValues: {groupName: !!groupInfo ? groupInfo.name : ''},
  });
  const [optionUser, setOptionUser] = useState();
  // console.log({groupMembers, groupInfo});

  const storeMembers = memberArr => {
    let arrayToSet = [];
    let isIncludeCurUser = false;
    memberArr.map(item => {
      let {username} = item;
      if (username == currentUser.username) {
        isIncludeCurUser = true;
        // console.log({username});
      } else if (!!chatSliceRef?.friends?.[username]) {
        arrayToSet.push({
          ...chatSliceRef?.friends?.[username],
          isFriend: true,
        });
      } else if (!!chatSliceRef?.stranger?.[username]) {
        arrayToSet.push({
          ...chatSliceRef?.stranger?.[username],
          isFriend: false,
        });
      } else {
        arrayToSet.push({...item, isFriend: false});
      }
    });
    // console.log({memberArr});
    let newArray = [...arrayToSet];
    if (!!isIncludeCurUser) {
      newArray.unshift({
        ...currentUser,
        profilePhoto: currentUser?.profilePhotoObject?.uri,
      });
    }
    setGroupMembers(newArray);
  };

  const getInitialInfo = async () => {
    let response = await getGroupInfo(groupId);
    if (!response.isError) {
      let oldMemberArray = response.data.members;
      let newMemberArray = [];
      for (let i = 0; i < oldMemberArray.length; i++) {
        let member = await getStrangerInfoFromDB(oldMemberArray[i]);
        // console.log({member});
        if (!member.isError) {
          newMemberArray.push(member.data);
        }
      }
      // console.log({getInitialInfo: newMemberArray});
      storeMembers(newMemberArray);
      setGroupInfo(response.data);
      setFieldValue('groupName', response.data.name);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log({isFocused});
    if (!!isFocused) {
      getInitialInfo();
    }
  }, [isFocused]);

  const showConfirm = opAction => {
    let subText =
      opAction == 'makeAdmin'
        ? `making "${optionUser.firstName}" admin ..`
        : opAction == 'removeAdmin'
        ? `removing "${optionUser.firstName}" from admin ..`
        : opAction == 'leaveGroup'
        ? `Want to leave this group ?`
        : `removing "${optionUser.firstName}" from group ..`;
    let confirmAction =
      opAction == 'makeAdmin'
        ? makeNewAdmin
        : opAction == 'removeAdmin'
        ? removeFromAdmin
        : opAction == 'leaveGroup'
        ? leaveGroup
        : removeFromMember;

    Alert.alert('Are you sure ?', subText, [
      {
        text: 'Yes,confirm',
        style: opAction != 'makeAdmin' ? 'destructive' : 'default',
        onPress: confirmAction,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const makeNewAdmin = async () => {
    setIsLoading(true);
    setOptionUser();
    setShowOptionModal(false);
    let response = await makeAdmin(optionUser.username, groupId, currentUser);
    getInitialInfo();
  };

  const removeFromAdmin = async () => {
    setIsLoading(true);
    setOptionUser();
    setShowOptionModal(false);
    let response = await removeAdmin(optionUser.username, groupId, currentUser);
    getInitialInfo();
  };

  const removeFromMember = async () => {
    setIsLoading(true);
    setOptionUser();
    setShowOptionModal(false);
    const response = await removeMember(
      optionUser.username,
      groupId,
      currentUser,
    );
    if (!!response.isError) {
      console.log({response});
      return;
    }
    let {message} = response;
    dispatch(
      storeMessageToGroup({
        message,
        groupInfo,
        userInfo: currentUser,
      }),
    );
    getInitialInfo();
  };

  const leaveGroup = async () => {
    try {
      setIsLoading(true);
      setOptionUser();
      setShowOptionModal(false);
      const response = await removeMember(
        currentUser.username,
        groupId,
        currentUser,
      );
      if (!!response.isError) {
        console.log({response});
        return;
      }
      let {message} = response;
      dispatch(
        storeMessageToGroup({
          message,
          groupInfo,
          userInfo: currentUser,
        }),
      );
      getInitialInfo();
    } catch (error) {
      console.log({errorInLeave: error});
    }
  };

  const closeOptionModal = () => {
    setShowOptionModal(false);
    // setOptionUser();
  };

  const openOptionModal = item => {
    setShowOptionModal(true);
    setOptionUser(item);
  };

  const SettingItem = ({
    title,
    onPress,
    customContainerStyle,
    customLabelStyle,
    itemIcon,
    iconColor = themeRef.colors.appThemeColor,
  }) => {
    return (
      <TouchableOpacity
        onPress={!!onPress ? onPress : () => {}}
        disabled={!onPress}
        style={[styles.settingItem, customContainerStyle]}>
        {!!itemIcon && (
          <Ionicons
            name={itemIcon}
            size={30}
            color={iconColor}
            style={{
              paddingRight: '5%',
              alignSelf: 'center',
            }}
          />
        )}
        <BaseText
          size={fontSize.big}
          weight={fontWeights.semiBold}
          color={themeRef.colors.secondaryColor}
          otherStyles={customLabelStyle}>
          {title}
        </BaseText>
      </TouchableOpacity>
    );
  };

  const openPickerModal = () => setShowPickerOption(true);

  const updatePhoto = async imageObj => {
    if (!imageObj) {
      setShowPickerOption(false);
      return;
    }
    try {
      // console.log({imageObj});
      setIsLoading(true);
      // // console.log({imageObj});
      setShowPickerOption(false);
      const response = await uploadProfilePic({...imageObj}, groupId);
      if (response.isError) {
        Alert.alert('Oops', response.error);
      }
      // // console.log({fireStorageResponse: response});
      const updateToDetails = await updateGPProfilePhotoInDB(groupId, {
        ...response.data,
      });
      // // console.log({updateToDetails});
      if (!updateToDetails.isError) {
        getInitialInfo();
      }
      setIsLoading(false);
    } catch (error) {
      console.log({errorinupdatePhoto: error});
    }
  };

  const focusFunc = (isBlur = false) => {
    if (isBlur) {
      setTouched({});
      return;
    }
    setTouched({groupName: true});
  };

  const submitName = () => {
    setTouched({});
  };

  const changeName = async () => {
    setIsLoading(true);
    try {
      const announcement = `${currentUser.username} changed group name from "${groupInfo.name}" to "${values.groupName}"`;
      let objToGenID =
        currentUser.username + groupId + announcement.length > 10
          ? announcement.slice(0, 10)
          : announcement + new Date().toString();
      let id = objToGenID.toString();

      let chatObject = {
        from: currentUser.username,
        date: new Date().toString(),
        message: announcement,
        messageType: 'announcement',
        isSending: true,
        id,
        groupId,
        members: groupInfo.members,
      };
      const response = await sendGPMessageToFB(groupId, chatObject);
      const changeName = await changeGroupName(
        groupId,
        values.groupName,
        currentUser,
      );
      setIsEditingName(false);
      getInitialInfo();
    } catch (error) {}
  };

  const goToAddMemberScreen = () => {
    navigation.navigate(ScreenNames.EditGroupScreen, {
      groupId,
      groupMembers: groupInfo.members,
    });
  };

  const RenderMemebers = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginHorizontal: wp(2),
          marginVertical: hp(0.5),
        }}>
        <View>
          {!!item?.profilePhoto ? (
            <ImageCompWithLoader
              // source={{uri: item.profilePhoto}}
              source={imageUrlStrings.banana}
              ImageStyles={styles.userPhoto}
              resizeMode="contain"
            />
          ) : (
            <ChatAvatar
              size={hp(6)}
              isCircle
              color={themeRef.colors.appThemeColor}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            marginLeft: wp(2),
          }}>
          <BaseText
            color={themeRef.colors.appThemeColor}
            weight={fontWeights.semiBold}
            size={fontSize.large}
            otherProp={{
              numberOfLines: 1,
            }}>
            {item?.username == currentUser?.username ? 'You' : item?.firstName}
          </BaseText>
          <BaseText
            color={themeRef.colors.secondaryColor}
            size={fontSize.medium}
            weight={fontWeights.semiBold}>
            {item?.phone}
          </BaseText>
        </View>
        {groupInfo?.admins?.includes(item?.username) && (
          <BaseText
            color={themeRef.colors.primaryColor}
            size={fontSize.tiny}
            weight={fontWeights.semiBold}
            otherStyles={styles.adminLabel}>
            Admin
          </BaseText>
        )}
        {item?.isFriend && (
          <IconButton
            name="chatbubble-ellipses-outline"
            size={25}
            color={themeRef.colors.appThemeColor}
          />
        )}
        {item?.username != currentUser?.username &&
          groupInfo.admins.includes(currentUser?.username) && (
            <IconButton
              name="ellipsis-vertical"
              size={25}
              color={themeRef.colors.appThemeColor}
              containerStyle={{
                marginLeft: wp(1),
              }}
              onPress={openOptionModal.bind(this, item)}
            />
          )}
      </View>
    );
  };

  return (
    <>
      <BaseModal
        visibility={!!showOptionModal || !!isEditingName}
        onOutsidePressHandler={closeOptionModal}
        customBottomPosition={
          isEditingName ? hp(Platform.OS == 'android' ? 0 : 40) : undefined
        }>
        {!!isEditingName && !isLoading ? (
          <>
            <SettingItem
              title={'Edit group name'}
              customContainerStyle={{
                alignSelf: 'center',
              }}
              customLabelStyle={{
                color: themeRef.colors.appThemeColor,
              }}
            />
            {/* <View style={[commonStyles.rowCenter]}> */}
            <InputBox
              label={'Group Name'}
              focusFunction={focusFunc}
              focused={!!touched.groupName}
              value={values.groupName}
              inputRef={groupNameRef}
              mainContainerStyle={{
                marginTop: hp(1.5),
                width: wp(75),
              }}
              otherProps={{
                onChangeText: setFieldValue.bind(this, 'groupName'),
                onSubmitEditing: submitName,
              }}
            />
            {/* </View> */}
            <BaseText otherStyles={commonPageStyles().error}>
              {errors.groupName}
            </BaseText>
            <SimpleButton title={'Submit'} onPress={changeName} />
            <TextButton
              title={'Cancel'}
              textStyle={{
                color: themeRef.colors.errorColor,
                fontSize: fontSize.big,
                marginTop: hp(2),
              }}
              onPress={() => setIsEditingName(false)}
            />
          </>
        ) : !!showOptionModal ? (
          <View
            style={{
              marginHorizontal: wp(5),
            }}>
            {/* <BaseText>Make Admin</BaseText>  */}
            {/* <BaseText>Remove from group</BaseText> */}
            {!groupInfo?.admins?.includes(optionUser?.username) && (
              <SettingItem
                itemIcon={'ribbon'}
                title={'Make Admin'}
                onPress={showConfirm.bind(this, 'makeAdmin')}
              />
            )}
            {!!groupInfo?.admins?.includes(optionUser?.username) && (
              <SettingItem
                itemIcon={'ribbon'}
                title={'Remove from Admin'}
                iconColor={themeRef.colors.errorColor}
                onPress={showConfirm.bind(this, 'removeAdmin')}
              />
            )}
            <SettingItem
              itemIcon={'person-remove'}
              title={'Remove from group'}
              iconColor={themeRef.colors.errorColor}
              onPress={showConfirm.bind(this, 'removeMember')}
            />

            <TextButton
              title={'Cancel'}
              textStyle={{
                color: themeRef.colors.errorColor,
                fontSize: fontSize.big,
                marginTop: hp(2),
              }}
              onPress={closeOptionModal}
            />
          </View>
        ) : !!isLoading ? (
          <BaseLoader loadingText="Updating group .." />
        ) : null}
      </BaseModal>

      <MediaPickerOptionModal
        visibility={!!showPickerOption}
        closeActions={() => setShowPickerOption(false)}
        mediaType="photo"
        afterChoosehandler={updatePhoto}
        isProfilePhoto
      />

      <View style={[commonStyles.screenStyle, styles.mainDiv]}>
        <PageHeading
          backButtonProps={{
            name: 'chevron-back',
            size: 30,
            color: themeRef.colors.secondaryColor,
            backScreen: 'Back',
          }}
          backButtonStyle={{
            marginLeft: 0,
          }}
          rightButton={
            !isLoading && groupInfo?.members?.includes(currentUser.username) ? (
              <TouchableOpacity
                onPress={showConfirm.bind(this, 'leaveGroup')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: themeRef.colors.primaryColor,
                  paddingHorizontal: wp(2),
                  paddingVertical: hp(0.5),
                  borderRadius: hp(1.5),
                  elevation: 4,
                  shadowColor: themeRef.colors.secondaryColor,
                  shadowOffset: {
                    height: 0,
                    width: 0,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                }}>
                <BaseText
                  size={fontSize.medium}
                  weight={fontWeights.semiBold}
                  color={themeRef.colors.errorColor}>
                  Leave group
                </BaseText>
                <Ionicons
                  name="exit"
                  size={30}
                  color={themeRef.colors.errorColor}
                  style={{
                    alignSelf: 'center',
                    paddingLeft: wp(2),
                  }}
                />
              </TouchableOpacity>
            ) : null
          }
          mainContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: hp(1),
          }}
        />

        {isLoading ? (
          <BaseLoader
            dark={themeRef.dark}
            loadingText="Getting group info .."
            containerStyle={{
              paddingVertical: hp(5),
            }}
          />
        ) : (
          <>
            <View
              style={{
                // backgroundColor: 'red',
                alignSelf: 'center',
                height: hp(25),
                width: hp(25),
              }}>
              {!!groupInfo?.profilePhotoObject?.uri ? (
                <ImageCompWithLoader
                  // source={{uri: groupInfo?.profilePhotoObject?.uri}}
                  source={imageUrlStrings.banana}
                  ImageStyles={styles.groupPhoto}
                />
              ) : (
                <ChatAvatar
                  size={hp(23.5)}
                  isGroup
                  color={themeRef.colors.appThemeColor}
                />
              )}
              {isAdmin && (
                <TouchableOpacity
                  onPress={openPickerModal}
                  style={{
                    position: 'absolute',
                    bottom: hp(1),
                    right: wp(3),
                    backgroundColor: themeRef.colors.appThemeColor,
                    height: hp(5),
                    width: hp(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 500,
                    borderWidth: 3,
                    borderColor: themeRef.colors.primaryColor,
                  }}
                  activeOpacity={0.8}>
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={themeRef.colors.primaryColor}
                    style={{
                      alignSelf: 'center',

                      // marginLeft: wp(2),
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                alignItems: 'center',
                marginVertical: hp(2),
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: wp(10),
                  alignItems: 'center',
                  // backgroundColor: 'red',
                }}>
                <BaseText
                  size={fontSize.heading}
                  weight={fontWeights.bold}
                  color={themeRef.colors.appThemeColor}
                  otherProp={{numberOfLines: 3}}>
                  {groupInfo?.name}
                </BaseText>
                {isAdmin && (
                  <TouchableOpacity onPress={() => setIsEditingName(true)}>
                    <FontAwesome
                      name="pencil"
                      size={25}
                      color={themeRef.colors.appThemeColor}
                      style={{
                        alignSelf: 'center',
                        paddingLeft: wp(2),
                        marginLeft: wp(2),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <BaseText
                color={themeRef.colors.secondaryColor}
                size={fontSize.medium}
                weight={fontWeights.medium}>
                uid@{groupId}
              </BaseText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <BaseText
                color={themeRef.colors.appThemeColor}
                weight={fontWeights.bold}
                size={fontSize.large}
                otherStyles={{
                  marginLeft: wp(5),
                  marginVertical: hp(1),
                }}>
                {groupMembers.length} Members
              </BaseText>
              {isAdmin && (
                <TouchableOpacity
                  onPress={goToAddMemberScreen}
                  style={[
                    commonStyles.iconWithTextBtn,
                    // commonStyles.newChatBtn,
                    {
                      backgroundColor: themeRef.colors.primaryColor,
                      marginVertical: 0,
                      paddingVertical: 0,
                    },
                  ]}>
                  <Ionicons
                    name="add"
                    size={20}
                    color={themeRef.colors.appThemeColor}
                  />
                  <BaseText
                    size={fontSize.medium}
                    color={themeRef.colors.appThemeColor}
                    weight={fontWeights.bold}>
                    Add Member
                  </BaseText>
                </TouchableOpacity>
              )}
            </View>
            {!!groupMembers && groupMembers.length != 0 && (
              <View
                style={{
                  flex: 1,
                }}>
                <FlatList
                  data={[...groupMembers]}
                  showsVerticalScrollIndicator={false}
                  renderItem={RenderMemebers}
                  keyExtractor={(item, index) => index}
                  contentContainerStyle={{
                    paddingBottom: hp(10),
                  }}
                />
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default GroupChatInfoScreen;
