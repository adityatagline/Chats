import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {fontSize} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation, useTheme} from '@react-navigation/native';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import BaseText from '../../../components/BaseText';
import ImageCompWithLoader from '../../../components/ImageCompWithLoader';

const ChatScreenHeaderComponent = ({
  displayChatName,
  onOptionPress,
  onInfoPress,
  chatProfilePhoto,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    pageHeadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      paddingHorizontal: wp(1.5),
      marginHorizontal: wp(1),
    },
    chatImage: {
      height: hp(5),
      width: hp(5),
      marginRight: wp(3),
      borderRadius: 17,
    },
  });

  const navigation = useNavigation();

  return (
    <View style={styles.pageHeadingContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon
          name={'chevron-back'}
          size={30}
          color={themeRef.colors.appThemeColor}
        />
      </TouchableOpacity>
      <ImageCompWithLoader
        source={chatProfilePhoto}
        ImageStyles={[
          styles.chatImage,
          {
            height: hp(4),
            width: hp(4),
          },
        ]}
        resizeMode="contain"
        borderRadius={17}
      />
      <BaseText
        color={themeRef.colors.appThemeColor}
        weight={fontWeights.bold}
        size={fontSize.big}
        otherStyles={{flex: 1}}>
        {displayChatName}
      </BaseText>
      <TouchableOpacity style={styles.backButton} onPress={onInfoPress}>
        <Icon
          name={'information-circle-outline'}
          size={30}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onOptionPress}>
        <Icon
          name={'ellipsis-vertical'}
          size={25}
          color={themeRef.colors.secondaryColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreenHeaderComponent;
