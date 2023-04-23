import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
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
import {addMembers} from '../../../../api/chat/ChatRequests';
import {FlatList} from 'react-native';
import ChatAvatar from '../../../components/ChatAvatar';
import IconButton from '../../../components/IconButton';
import BaseModal from '../../../components/BaseModal';
import TextButton from '../../../components/TextButton';
import LoadingPage, {BaseLoader} from '../../../components/LoadingPage';

import SimpleButton from '../../../components/SimpleButton';
import AvatarListHorizontal from '../../../components/AvatarListHorizontal';

const EditGroupScreen = () => {
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
  const route = useRoute();
  const dispatch = useDispatch();
  const groupId = route?.params?.groupId;

  const chatSliceRef = useSelector(state => state.chatSlice);
  const groupInfo = chatSliceRef.groups[groupId];
  const currentUser = useSelector(state => state.authenticationSlice).user;
  const [groupMembers, setGroupMembers] = useState([
    ...route?.params?.groupMembers,
  ]);
  console.log({groupMembeINEdit: groupMembers});
  const [memberList, setMemberList] = useState([]);
  const [memberSelected, setMemberSelected] = useState([]);
  console.log({memberSelected});
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let memberArray = [];
    for (const user in chatSliceRef.friends) {
      memberArray.push(chatSliceRef.friends[user]);
    }
    console.log({memberArray});
    setMemberList(memberArray);
  }, []);

  const addMember = user => {
    console.log({userInAddMe: user});
    setMemberSelected([user.username, ...memberSelected]);
  };
  const removeMember = user => {
    let newArray = memberSelected.filter(item => item != user.username);
    setMemberSelected(newArray);
  };

  const addMembersToGroup = async () => {
    setIsLoading(true);
    let response = await addMembers(memberSelected, groupId, currentUser);
    setIsLoading(false);
    console.log({response});
    if (!response.isError) {
      navigation.navigate(ScreenNames.GroupChatInfoScreen, {
        groupId,
      });
      setShowFinalConfirm(false);
    }
  };

  const RenderContacts = ({item}) => {
    if (
      item.username == currentUser.username ||
      groupMembers.includes(item.username) ||
      memberSelected.includes(item.username)
    ) {
      return null;
    }
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
        <IconButton
          name={'add-circle-outline'}
          size={25}
          containerStyle={{
            marginRight: wp(2),
          }}
          onPress={addMember.bind(this, item)}
        />
      </View>
    );
  };

  const RenderFinalMembers = ({item}) => {
    return (
      <BaseText
        color={themeRef.colors.appThemeColor}
        weight={fontWeights.medium}
        size={fontSize.big}
        otherStyles={{
          flex: 1,
          textAlign: 'center',
        }}>
        {chatSliceRef.friends[item].contactName}
      </BaseText>
    );
  };

  return (
    <>
      <BaseModal visibility={showFinalConfirm}>
        {!!isLoading ? (
          <BaseLoader loadingText="Updating group .." />
        ) : (
          <>
            <BaseText
              size={fontSize.large}
              color={themeRef.colors.appThemeColor}
              weight={fontWeights.semiBold}
              otherStyles={{
                alignSelf: 'center',
                marginBottom: hp(1),
              }}>
              Adding members
            </BaseText>

            <FlatList
              data={memberSelected}
              keyExtractor={(item, index) => index + 6655445}
              renderItem={RenderFinalMembers}
              style={{
                // backgroundColor: 'red',
                maxHeight: hp(50),
                marginHorizontal: wp(3),
                marginVertical: hp(2),
              }}
            />
            <SimpleButton title={'Confirm'} onPress={addMembersToGroup} />
            <TextButton
              title={'Cancel'}
              textStyle={{
                color: themeRef.colors.errorColor,
                fontSize: fontSize.big,
                marginTop: hp(2),
              }}
              onPress={() => setShowFinalConfirm(false)}
            />
          </>
        )}
      </BaseModal>
      <View style={commonStyles.screenStyle}>
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
          mainContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: hp(1),
          }}
        />
        <BaseText
          size={fontSize.heading}
          weight={fontWeights.bold}
          color={themeRef.colors.appThemeColor}
          otherProp={{numberOfLines: 3}}
          otherStyles={{
            alignSelf: 'center',
          }}>
          {groupInfo?.name}
        </BaseText>
        <BaseText
          otherStyles={{
            alignSelf: 'center',
          }}>
          chats@{groupInfo.id}
        </BaseText>
        <BaseText
          size={fontSize.large}
          color={themeRef.colors.appThemeColor}
          weight={fontWeights.semiBold}
          otherStyles={{
            marginTop: hp(2),
            alignSelf: 'center',
          }}>
          Add new member
        </BaseText>
        {
          <>
            <BaseText
              size={fontSize.big}
              color={themeRef.colors.appThemeColor}
              weight={fontWeights.semiBold}
              otherStyles={{
                marginTop: hp(2),
                marginLeft: wp(2),
              }}>
              {memberSelected.length} Members selected
            </BaseText>
            <AvatarListHorizontal
              listArray={memberSelected}
              uriField={'profilePhoto'}
              nameField={'contactName'}
              themeRef={themeRef}
              onRemoveHandler={removeMember}
              haveRemoveBtn
              onlyUsername
            />
          </>
        }

        {memberList.length - memberSelected.length - groupMembers.length ==
        0 ? (
          <BaseText
            size={fontSize.big}
            color={themeRef.colors.appThemeColor}
            weight={fontWeights.semiBold}
            otherStyles={{
              flex: 1,
              paddingTop: hp(5),
              alignSelf: 'center',
            }}>
            No member remaining to add.
          </BaseText>
        ) : (
          <>
            <BaseText
              size={fontSize.big}
              color={themeRef.colors.appThemeColor}
              weight={fontWeights.semiBold}
              otherStyles={{
                marginVertical: hp(1),
                marginLeft: wp(2),
              }}>
              Your Contacts
            </BaseText>

            <View
              style={{
                flex: 1,
                // backgroundColor: 'red',
              }}>
              <FlatList
                data={memberList}
                renderItem={RenderContacts}
                keyExtractor={(item, index) => index}
              />
            </View>
          </>
        )}

        {memberSelected.length != 0 && (
          <SimpleButton
            title={'Add Members'}
            containerStyle={{
              marginBottom: hp(3),
            }}
            onPress={() => setShowFinalConfirm(true)}
          />
        )}
      </View>
    </>
  );
};

export default EditGroupScreen;
