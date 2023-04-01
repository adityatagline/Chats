import {memo} from 'react';
import {Text} from 'react-native';

const BaseText = ({
  children,
  weight = 'Regular',
  size = 16,
  color = 'black',
  otherProp,
  otherStyles,
}) => (
  <Text
    style={[
      {fontFamily: `Quicksand-${weight}`, fontSize: size, color},
      otherStyles,
    ]}
    {...otherProp}>
    {children}
  </Text>
);

export default memo(BaseText);
