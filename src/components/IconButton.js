import {memo} from 'react';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import FontfamiliesNames from '../strings/FontfamiliesNames';
import Icon from 'react-native-vector-icons/Ionicons';
import {colorStrings} from '../strings/ColorStrings';

const dimesions = Dimensions.get('screen');

const IconButton = ({
  onPress,
  name,
  size = 30,
  color = colorStrings.lightThemeColors.appThemeColor,
  containerStyle,
  iconStyle,
}) => {
  return (
    <Pressable
      style={({pressed}) => [containerStyle, pressed && {opacity: 0.5}]}
      onPress={onPress}>
      <Icon name={name} color={color} size={size} style={[iconStyle]} />
    </Pressable>
  );
};

export default memo(IconButton);
