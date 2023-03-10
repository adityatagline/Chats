import {Dimensions, NativeModules, StyleSheet} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
export const dimensions = Dimensions.get('screen');

export const fontSize = {
  extrasmall: 13,
  small: 14,
  medium: 16,
  big: 18,
  large: 20,
  extralarge: 22,
  heading: 25,
  subheading: 21,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenStyle: {
    flex: 1,
    paddingTop: StatusBarHeight,
    paddingHorizontal: wp(5),
  },
  floatingButton: {
    position: 'absolute',
    bottom: dimensions.height * 0.05,
  },
  orText: {
    fontSize: fontSize.small,
    fontFamily: FontfamiliesNames.primaryFontSemiBold,
    alignSelf: 'center',
    marginVertical: 7,
  },
  suggestion: {
    fontSize: fontSize.medium,
    marginVertical: 5,
    // paddingHorizontal: 25,
  },
});
