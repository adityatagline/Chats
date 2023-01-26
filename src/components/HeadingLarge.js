import {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';

const HeadingLarge = ({text, style, isCenter = false}) => {
  const styles2 = StyleSheet.create({
    headingStyle: {
      fontSize: 25,
      fontFamily: FontfamiliesNames.primaryFontBold,
      paddingHorizontal: !isCenter ? 5 : 0,
      textAlign: !isCenter ? null : 'center',
    },
  });
  return <Text style={[styles2.headingStyle, style]}>{text}</Text>;
};

export default memo(HeadingLarge);
