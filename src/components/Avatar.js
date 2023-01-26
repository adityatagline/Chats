import {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Avatar = ({
  source,
  imageStyle,
  borderRadius = 25,
  resizeMode = 'cover',
  imageSize = 60,
  haveBorder = true,
  containerStyle,
}) => {
  const styles = StyleSheet.create({
    avatar: {
      height: imageSize,
      width: imageSize,
    },
    mainDiv: {
      borderRadius: borderRadius + 3,
      borderWidth: 2,
      borderColor: 'white',
      padding: 3,
    },
  });
  return (
    <View style={[styles.mainDiv, containerStyle]}>
      <Image
        source={source}
        style={[styles.avatar, imageStyle]}
        borderRadius={borderRadius}
        resizeMode={resizeMode}
      />
    </View>
  );
};

export default memo(Avatar);
