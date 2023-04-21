import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatAvatar = ({
  isGroup = false,
  containerStyle,
  innerStyle,
  color,
  size,
  isCircle = false,
}) => {
  return (
    <View style={containerStyle}>
      <Ionicons
        name={`${isGroup ? 'people' : 'person'}${isCircle ? '-circle' : ''}`}
        size={size}
        color={color}
        style={[{alignSelf: 'center'}, innerStyle]}
      />
    </View>
  );
};

export default ChatAvatar;
