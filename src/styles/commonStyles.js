import {Dimensions, NativeModules, StyleSheet} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
export const dimensions = Dimensions.get('screen');

export const fontSize = {
  tiny: 11,
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
  topSpacer: {
    marginTop: StatusBarHeight,
  },
  baseModalCancelBtn: {
    fontSize: fontSize.extralarge,
    textTransform: 'capitalize',
    marginVertical: hp(1),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithTextBtn: {
    flexDirection: 'row',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 5,
  },
});
