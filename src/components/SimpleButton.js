import {ThemeProvider} from '@react-navigation/native';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import {colorStrings} from '../strings/ColorStrings';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import {themeColorName} from '../strings/ScreenNames';
import {fontSize} from '../styles/commonStyles';
const dimesions = Dimensions.get('screen');

export default SimpleButton = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  leftIcon = false,
}) => {
  return (
    <Pressable
      style={({pressed}) => [
        styles.mainDiv,
        containerStyle,
        pressed && {opacity: 0.5},
      ]}
      onPress={onPress}>
      {/* {!!leftIcon&&<Icon />} */}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  mainDiv: {
    width: dimesions.width * 0.8,
    alignSelf: 'center',
    height: dimesions.height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colorStrings.lightThemeColors.appThemeColor,
    elevation: 5,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    marginVertical: 10,
  },
  text: {
    fontFamily: FontfamiliesNames.primaryFontBold,
    fontSize: fontSize.heading,
    textAlign: 'center',
    color: colorStrings.lightThemeColors.primaryColor,
  },
});
