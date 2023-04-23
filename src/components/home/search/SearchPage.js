import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, TextInput} from 'react-native';
import IconButton from '../../IconButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useState} from 'react';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {fontSize} from '../../../styles/commonStyles';

export default SearchPage = ({
  isLeft,
  containerStyle,
  searchText,
  onChangeText,
}) => {
  const themeRef = useTheme();

  const styles = StyleSheet.create({
    mainDiv: {
      flexDirection: 'row',
      height: hp(7),
      alignSelf: 'center',
      backgroundColor: themeRef.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      borderRadius: 30,
      borderColor: themeRef.colors.border,
      borderWidth: 2,
      marginRight: wp(2),
    },
    inputBox: {
      width: wp(70),
      height: hp(7),
      marginLeft: wp(1),
      paddingHorizontal: wp(2),
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: !!searchText
        ? themeRef.colors.appThemeColor
        : themeRef.colors.secondaryColor,
      fontSize: fontSize.medium,
    },
  });

  return (
    <View style={[styles.mainDiv, containerStyle]}>
      <IconButton
        name={'search'}
        color={themeRef.colors.appThemeColor}
        size={25}
        onPress={() => {}}
      />
      <TextInput
        style={styles.inputBox}
        value={searchText}
        placeholder={'Search in chats ..'}
        placeholderTextColor={themeRef.colors.secondaryColor}
        onChangeText={onChangeText}
      />
    </View>
  );
};
