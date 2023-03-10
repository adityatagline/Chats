import {useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

export default CommonStyle = () => {
  const currentTheme = useTheme();
  return StyleSheet.create({
    globalDiv: {
      backgroundColor: currentTheme.colors.secondaryColor,
    },
    errorDiv: {
      backgroundColor: currentTheme.colors.errorCode,
    },
  });
};
