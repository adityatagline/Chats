import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, TextInput} from 'react-native';
import IconButton from '../../IconButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useState} from 'react';
import FontfamiliesNames, {
  fontWeights,
} from '../../../strings/FontfamiliesNames';
import {commonStyles, fontSize} from '../../../styles/commonStyles';
import BaseText from '../../BaseText';

export default SearchPage = ({
  isLeft,
  containerStyle,
  searchText,
  onChangeText,
  clearSearch,
  mainContainerStyle,
  showSideSearchCount = false,
  searchCounts = 0,
}) => {
  const themeRef = useTheme();

  const styles = StyleSheet.create({
    mainDiv: {
      marginHorizontal: wp(0),
      // backgroundColor: 'red',
      // paddingVertical: 0,
      // paddingRight: wp(10),
    },
    searchContainer: {
      flex: 1,
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
      marginRight: !!searchText ? wp(5) : 0,
    },
    inputBox: {
      // width: wp(70),
      height: hp(7),
      flex: 1,
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
    <View style={[commonStyles.rowCenter, styles.mainDiv, mainContainerStyle]}>
      <View style={[styles.searchContainer, containerStyle]}>
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
      {showSideSearchCount && !!searchText && (
        <BaseText
          otherStyles={{
            marginRight: wp(5),
          }}
          size={fontSize.big}
          weight={fontWeights.semiBold}
          color={themeRef.colors.appThemeColor}>
          {searchCounts}
        </BaseText>
      )}
      {!!searchText && (
        <IconButton
          name={'close'}
          color={themeRef.colors.appThemeColor}
          size={25}
          onPress={clearSearch}
        />
      )}
    </View>
  );
};
