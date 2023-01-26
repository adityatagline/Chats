import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {Text, StyleSheet, View, ScrollView, FlatList} from 'react-native';
import {
  commonStyles,
  dimensions,
  StatusBarHeight,
} from '../../../styles/commonStyles';

export default ChatsPage = ({chatArray}) => {
  const themeRef = useTheme();
  const [zIndex, setZIndex] = useState(-100);
  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      //   position: 'absolute',
      width: dimensions.width,
      backgroundColor: 'transparent',
      zIndex: zIndex,
      //   top: 0,
    },
    dummyDiv: {
      height: dimensions.height * 0.17,
      backgroundColor: 'transparent',
      //   marginTop: StatusBarHeight,
    },
    chatpage: {
      height: dimensions.height,
      backgroundColor: themeRef.colors.primaryColor,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      marginTop: dimensions.height * 0.17,
    },
  });
  const checkFun = temp => {
    if (
      (temp.nativeEvent.contentOffset.y > 34 && zIndex == 100) ||
      (temp.nativeEvent.contentOffset.y <= 34 && zIndex == -100)
    ) {
      return;
    } else if (temp.nativeEvent.contentOffset.y > 34) {
      setZIndex(100);
      return;
    } else if (temp.nativeEvent.contentOffset.y <= 34) {
      setZIndex(-100);
      return;
    }
  };

  const faltListArray = [<View style={styles.chatpage}></View>];
  return (
    <View style={styles.mainDiv}>
      <FlatList
        data={[...faltListArray]}
        renderItem={({item}) => item}
        bounces={false}
        onScroll={checkFun}
      />
    </View>
  );
};
