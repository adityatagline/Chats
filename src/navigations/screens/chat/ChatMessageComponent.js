import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {fontSize} from '../../../styles/commonStyles';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import BaseText from '../../../components/BaseText';

const ChatMessageComponent = ({
  item,
  index,
  chatArray,
  currentUserInfo,
  themeRef,
  isGroup,
}) => {
  let position;

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
