import {Dimensions, NativeModules, StyleSheet} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
export const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
export const dimensions = Dimensions.get('screen');

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenStyle: {
    flex: 1,
    paddingTop: StatusBarHeight,
    paddingHorizontal: 30,
  },
  floatingButton: {
    position: 'absolute',
    bottom: dimensions.height * 0.05,
  },
  orText: {
    fontSize: 18,
    fontFamily: FontfamiliesNames.primaryFontSemiBold,
    alignSelf: 'center',
    marginVertical: 7,
  },
  suggestion: {
    fontSize: 18,
    marginVertical: 5,
    // paddingHorizontal: 25,
  },
});
