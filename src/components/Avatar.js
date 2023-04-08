import {useTheme} from '@react-navigation/native';
import {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Avatar = ({
  source,
  imageStyle,
  borderRadius = 100,
  resizeMode = 'cover',
  imageSize = 60,
  haveBorder = true,
  containerStyle,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    avatar: {
      height: imageSize,
      width: imageSize,
    },
    mainDiv: {
      borderRadius: borderRadius + 3,
      borderWidth: 2,
      borderColor: themeRef.colors.primaryColor,
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
