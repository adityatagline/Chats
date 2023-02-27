import {useTheme} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const AddNewChatButton = ({onPress}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    mainDiv: {
      //   backgroundColor: 'red',
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    floatingAddButton: {
      position: 'absolute',
      alignSelf: 'center',
      //   alignItems: 'center',
    },
  });
  return (
    <Pressable
      style={({pressed}) => [styles.mainDiv, pressed && {opacity: 0.5}]}>
      <Icon
        name="chatbubble-outline"
        color={themeRef.colors.appThemeColor}
        size={30}
      />
      <Icon
        name="add"
        size={22}
        style={styles.floatingAddButton}
        color={themeRef.colors.appThemeColor}
      />
    </Pressable>
  );
};
