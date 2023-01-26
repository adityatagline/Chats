import {memo} from 'react';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
const dimesions = Dimensions.get('screen');

const TextButton = ({title, onPress, textStyle}) => {
  return (
    <Pressable
      style={({pressed}) => [pressed && {opacity: 0.5}]}
      onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};
let styles = StyleSheet.create({
  text: {
    fontFamily: FontfamiliesNames.primaryFontBold,
    fontSize: 20,
    alignSelf: 'center',
    paddingVertical: 5,
  },
});

export default memo(TextButton);
