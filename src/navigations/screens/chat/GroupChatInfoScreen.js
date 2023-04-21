import {useRoute, useTheme} from '@react-navigation/native';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import BaseText from '../../../components/BaseText';
import {useSelector} from 'react-redux';
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
import {useEffect, useState} from 'react';
import {
  getGroupInfo,
  getStrangerInfoFromDB,
  removeAdmin,
} from '../../../../api/chat/ChatRequests';
import {FlatList} from 'react-native';
import ChatAvatar from '../../../components/ChatAvatar';
import IconButton from '../../../components/IconButton';
import BaseModal from '../../../components/BaseModal';
import TextButton from '../../../components/TextButton';
import {makeAdmin} from '../../../../api/chat/ChatRequests';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';

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

  const route = useRoute();
  const groupId = route?.params?.groupId;

  const chatSliceRef = useSelector(state => state.chatSlice);
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const [groupInfo, setGroupInfo] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [optionUser, setOptionUser] = useState();
  console.log({groupMembers, groupInfo});

  const storeMembers = memberArr => {
    let arrayToSet = [];
    memberArr.map(item => {
      let {username} = item;
      if (username == currentUser.username) {
        console.log({username});
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
    console.log({arrayToSet});
    setGroupMembers([
      {...currentUser, profilePhoto: currentUser?.profilePhotoObject?.uri},
      ...arrayToSet,
    ]);
  };

  const getInitialInfo = async () => {
    let response = await getGroupInfo(groupId);
    if (!response.isError) {
      let oldMemberArray = response.data.members;
      let newMemberArray = [];
      for (let i = 0; i < oldMemberArray.length; i++) {
        let member = await getStrangerInfoFromDB(oldMemberArray[i]);
        console.log({member});
        if (!member.isError) {
          newMemberArray.push(member.data);
        }
      }
      console.log({getInitialInfo: newMemberArray});
      storeMembers(newMemberArray);
      setGroupInfo(response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!!groupId) {
      getInitialInfo();
    }
  }, [groupId, chatSliceRef]);

  const showConfirm = opAction => {
    let subText =
      opAction == 'makeAdmin'
        ? `making "${optionUser.firstName}" admin ..`
        : opAction == 'removeAdmin'
        ? `removing "${optionUser.firstName}" from admin ..`
        : `removing "${optionUser.firstName}" from group ..`;
    let confirmAction =
      opAction == 'makeAdmin'
        ? makeNewAdmin
        : opAction == 'removeAdmin'
        ? removeFromAdmin
        : () => {};

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
    let response = await makeAdmin(optionUser.username, groupId);
    setOptionUser();
    setShowOptionModal(false);
    getInitialInfo();
  };

  const removeFromAdmin = async () => {
    setIsLoading(true);
    let response = await removeAdmin(optionUser.username, groupId);
    setOptionUser();
    setShowOptionModal(false);
    getInitialInfo();
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
        onPress={onPress}
        style={[styles.settingItem, customContainerStyle]}>
        <Ionicons
          name={itemIcon}
          size={30}
          color={iconColor}
          style={{
            paddingRight: '5%',
            alignSelf: 'center',
          }}
        />
        <BaseText
          size={fontSize.big}
          weight={fontWeights.semiBold}
          color={themeRef.colors.secondaryColor}>
          {title}
        </BaseText>
      </TouchableOpacity>
    );
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
        visibility={!!showOptionModal}
        onOutsidePressHandler={closeOptionModal}>
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
      </BaseModal>

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
            !isLoading ? (
              <TouchableOpacity
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
              {!groupInfo?.profilePhoto ? (
                <ImageCompWithLoader
                  // source={{uri: groupInfo.groupPhoto}}
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
              <TouchableOpacity
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
                <TouchableOpacity>
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
              </View>

              <BaseText
                color={themeRef.colors.secondaryColor}
                size={fontSize.medium}
                weight={fontWeights.medium}>
                uid@{groupId}
              </BaseText>
            </View>
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
