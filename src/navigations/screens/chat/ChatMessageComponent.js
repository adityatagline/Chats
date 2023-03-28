import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {fontSize} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';

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
      {isGroup && (position == 'Bottom' || position == 'alone') ? (
        <Text
          style={[styles.senderName, {color: themeRef.colors.secondaryColor}]}>
          {item.from}
        </Text>
      ) : (
        item.from == currentUserInfo.username &&
        (position == 'alone' || position == 'Bottom') && (
          <Text
            style={[
              styles.senderName,
              {color: themeRef.colors.secondaryColor},
            ]}>
            you
          </Text>
        )
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
        <Text
          style={[
            styles.message,
            {
              color:
                item.from == currentUserInfo.username
                  ? themeRef.colors.primaryColor
                  : themeRef.colors.secondaryColor,
            },
          ]}>
          {item.message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  senderName: {
    fontSize: fontSize.extrasmall,
    fontFamily: FontfamiliesNames.primaryFontMedium,
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
    fontSize: fontSize.medium,
    fontFamily: FontfamiliesNames.primaryFontSemiBold,
  },
});

export default ChatMessageComponent;
