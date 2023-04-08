import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {fontSize} from '../../../styles/commonStyles';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import BaseText from '../../../components/BaseText';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';
import IconButton from '../../../components/IconButton';
import {downloadMediaToDevice} from '../../../../api/chat/ChatRequests';
import IonIcon from 'react-native-vector-icons/Ionicons';

const ChatMessageComponent = ({
  item,
  index,
  chatArray,
  currentUserInfo,
  themeRef,
  isGroup,
  handleDownload,
}) => {
  let position;
  // console.log({item});

  switch (index) {
    case 0:
      if (chatArray.length == 1) {
        position = 'alone';
      } else if (item.from == chatArray[1].from) {
        position = 'Top';
      } else {
        position = 'alone';
      }
      break;
    case chatArray.length - 1:
      if (item.from == chatArray[index - 1].from) {
        position = 'Bottom';
      } else {
        position = 'alone';
      }
      break;
    default:
      if (
        item.from == chatArray[index - 1].from &&
        item.from == chatArray[index + 1].from
      ) {
        position = 'center';
      } else if (item.from == chatArray[index + 1].from) {
        position = 'Top';
      } else if (item.from == chatArray[index - 1].from) {
        position = 'Bottom';
      } else {
        position = 'alone';
      }
      break;
  }
  let borderRadiusStyle = {};

  if (position != 'center' && position != 'alone') {
    borderRadiusStyle[
      `border${position}${
        item.from == currentUserInfo.username ? 'Right' : 'Left'
      }Radius`
    ] = 0;
  } else if (position == 'center') {
    borderRadiusStyle[
      `borderTop${
        item.from == currentUserInfo.username ? 'Right' : 'Left'
      }Radius`
    ] = 0;
    borderRadiusStyle[
      `borderBottom${
        item.from == currentUserInfo.username ? 'Right' : 'Left'
      }Radius`
    ] = 0;
  }

  if (!!item.mediaType) {
    return (
      <RenderMediaComponent
        {...{
          item,
          currentUserInfo,
          themeRef,
          isGroup,
          position,
          handleDownload,
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.chatItemContainer,
        {
          alignItems:
            item.from == currentUserInfo.username ? 'flex-end' : 'flex-start',
        },
        {
          marginBottom: position == 'Top' ? hp(2) : hp(0.25),
          marginTop: position == 'Bottom' ? hp(2) : hp(0.25),
        },
      ]}>
      {(position == 'Bottom' || position == 'alone') &&
        (isGroup || (!isGroup && item.from == currentUserInfo.username)) && (
          <BaseText
            size={fontSize.extrasmall}
            weight={fontWeights.medium}
            color={themeRef.colors.secondaryColor}
            otherStyles={[styles.senderName]}>
            {isGroup ? item.from : 'You'}
          </BaseText>
        )}

      <View
        style={[
          styles.messageContainer,
          {...borderRadiusStyle, overflow: 'hidden'},
          {
            backgroundColor:
              item.from == currentUserInfo.username
                ? themeRef.colors.appThemeColor
                : themeRef.colors.card,
          },
        ]}>
        <BaseText
          size={fontSize.medium}
          weight={fontWeights.semiBold}
          color={
            item.from == currentUserInfo.username
              ? themeRef.colors.primaryColor
              : themeRef.colors.secondaryColor
          }
          otherStyles={[styles.message]}>
          {item.message}
        </BaseText>
      </View>
      {/* <BaseText>{new Date(item.date).toLocaleTimeString()}</BaseText> */}
    </View>
  );
};

const DownloadBtn = ({themeRef, item, handleDownload}) => (
  <IconButton
    name={'download-outline'}
    size={25}
    color={themeRef.colors.appThemeColor}
    containerStyle={{
      marginHorizontal: wp(2),
    }}
    onPress={downloadMediaToDevice.bind(this, item, handleDownload)}
  />
);

const RenderMediaComponent = ({
  item,
  currentUserInfo,
  themeRef,
  isGroup,
  position,
  handleDownload,
}) => {
  switch (item.mediaType) {
    case 'photo':
      return (
        <View
          style={[
            {
              // backgroundColor: 'yellow',
              // maxWidth: wp(80),
              marginVertical: position == 'alone' ? hp(1) : hp(0),
              marginTop: position == 'Bottom' ? hp(2) : hp(0.5),
              marginBottom: position == 'Top' ? hp(2) : hp(0.5),
              justifyContent: 'flex-start',
              flexDirection:
                item.from == currentUserInfo.username ? 'row-reverse' : 'row',
              alignItems: 'center',
            },
          ]}>
          <ImageCompWithLoader
            source={{
              uri: item.uri,
            }}
            ImageStyles={{
              height: hp(15),
              width: wp(50),
            }}
            resizeMode="cover"
            ImageProps={{
              borderRadius: 15,
            }}
          />
          {!item.isDownloaded && (
            <DownloadBtn {...{themeRef, item, handleDownload}} />
          )}
        </View>
      );

    case 'file':
    case 'video':
      return (
        <View
          style={{
            marginVertical: position == 'alone' ? hp(1) : hp(0),
            marginTop: position == 'Bottom' ? hp(2) : hp(0.5),
            marginBottom: position == 'Top' ? hp(2) : hp(0.5),
            justifyContent: 'flex-start',
            flexDirection:
              item.from == currentUserInfo.username ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
          <BaseText
            color={themeRef.colors.primaryColor}
            weight={fontWeights.semiBold}
            otherStyles={{
              backgroundColor: themeRef.colors.appThemeColor,
              paddingHorizontal: wp(4),
              paddingVertical: hp(1),
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            {item.mediaName}
          </BaseText>
          {!item.isDownloaded && (
            <DownloadBtn {...{themeRef, item, handleDownload}} />
          )}
        </View>
      );
    default:
      break;
  }
};

const styles = StyleSheet.create({
  senderName: {
    marginHorizontal: wp(1),
    marginVertical: hp(0.5),
    textTransform: 'capitalize',
  },
  messageContainer: {
    maxWidth: wp(80),
    borderRadius: 10,
    overflow: 'hidden',
  },
  message: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
  },
});

export default ChatMessageComponent;
