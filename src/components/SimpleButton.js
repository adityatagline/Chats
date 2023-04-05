import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import {colorStrings} from '../strings/ColorStrings';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import {fontSize} from '../styles/commonStyles';
const dimesions = Dimensions.get('screen');
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

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
    width: wp(80),
    alignSelf: 'center',
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
    marginVertical: hp(1),
    paddingVertical: hp(1.75),
  },
  text: {
    fontFamily: FontfamiliesNames.primaryFontBold,
    fontSize: fontSize.heading,
    textAlign: 'center',
    color: colorStrings.lightThemeColors.primaryColor,
  },
});
