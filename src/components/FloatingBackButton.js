import {Text, StyleSheet, View, NativeModules, Pressable} from 'react-native';
import {dimensions} from '../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {memo} from 'react';
import {colorStrings} from '../strings/ColorStrings';
import NativeStatusBarManager from 'react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid';
import FontfamiliesNames from '../strings/FontfamiliesNames';

const FloatingBackButton = ({
  backScreenName = 'back',
  color = colorStrings.lightThemeColors.secondaryColor,
  size = 30,
  containerStyle,
  iconStyle,
  onPress,
}) => {
  const styles = StyleSheet.create({
    mainDiv: {
      flexDirection: 'row',
      //   backgroundColor: 'red',
      height: dimensions.height * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
      width: !!backScreenName ? null : dimensions.height * 0.05,
      borderRadius: 15,
      position: 'absolute',
      top: NativeModules.StatusBarManager.HEIGHT + dimensions.height * 0.02,
      left: 30,
    },
    screenName: {
      fontSize: 20,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: color,
      textTransform: 'capitalize',
      letterSpacing: 0.5,
    },
  });
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.mainDiv,
        containerStyle,
        pressed && {opacity: 0.5},
      ]}>
      <Icon name="chevron-back" size={size} color={color} style={[iconStyle]} />
      {!!backScreenName && (
        <Text style={styles.screenName}>{backScreenName}</Text>
      )}
    </Pressable>
  );
};

export default memo(FloatingBackButton);
