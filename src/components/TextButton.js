import {memo} from 'react';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import {fontSize} from '../styles/commonStyles';
const dimesions = Dimensions.get('screen');

const TextButton = ({title, onPress, textStyle, containerStyle}) => {
  return (
    <Pressable
      style={({pressed}) => [containerStyle, pressed && {opacity: 0.5}]}
      onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};
let styles = StyleSheet.create({
  text: {
    fontFamily: FontfamiliesNames.primaryFontBold,
    fontSize: fontSize.medium,
    alignSelf: 'center',
    paddingVertical: 5,
  },
});

export default memo(TextButton);
