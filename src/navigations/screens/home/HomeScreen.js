import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  NativeModules,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AppStatusBar} from '../../../components/AppStatusBar';
import Avatar from '../../../components/Avatar';
import HeadingLarge from '../../../components/HeadingLarge';
import IconButton from '../../../components/IconButton';
import {imageUrlStrings} from '../../../strings/ImageUrlStrings';
import {commonStyles, dimensions} from '../../../styles/commonStyles';
import ChatsPage from './ChatsPage';
import StatusList from './StatusList';

export default HomeScreen = () => {
  const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
  const themeRef = useTheme();
  const authRef = useSelector(state => state.authenticationSlice);
  const [statusArray, setStatusArray] = useState([
    {
      name: 'aditya',
      avatar: imageUrlStrings.lemon,
    },
    {
      name: 'yash',
      avatar: imageUrlStrings.banana,
    },
    {
      name: 'yash',
      avatar: imageUrlStrings.banana,
    },
  ]);

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.appThemeColor,
      flex: 1,
    },
    heading: {
      color: themeRef.colors.primaryColor,
      flex: 1,
      textAlign: 'center',
    },
    headerDiv: {
      backgroundColor: themeRef.colors.appThemeColor,
      paddingTop: StatusBarHeight + 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 20,
    },
    floatingButton: {
      position: 'absolute',
      top: StatusBarHeight + 5,
      marginHorizontal: 20,
    },
    rightIconDiv: {
      right: 0,
      flexDirection: 'row',
      marginHorizontal: 5,
    },
    icon: {
      marginHorizontal: 10,
    },
    statusListDiv: {
      position: 'absolute',
      width: dimensions.width,
      top: StatusBarHeight + dimensions.height * 0.06,
      left: 0,
      zIndex: 0,
    },
  });

  return (
    <View style={[styles.mainDiv]}>
      <View style={styles.headerDiv}>
        <IconButton
          name={'search'}
          color={themeRef.colors.primaryColor}
          size={30}
          containerStyle={[styles.floatingButton]}
        />
        <HeadingLarge text={'Home'} style={styles.heading} />
        <View style={[styles.floatingButton, styles.rightIconDiv]}>
          {/* <IconButton
            name={'person'}
            color={themeRef.colors.primaryColor}
            size={30}
            containerStyle={[styles.icon]}
          /> */}
          <IconButton
            name={'ellipsis-vertical'}
            color={themeRef.colors.primaryColor}
            size={30}
            containerStyle={[styles.icon]}
          />
        </View>
        {/* <Avatar source={imageUrlStrings.banana} /> */}
      </View>
      <StatusList
        containerStyle={styles.statusListDiv}
        statusArray={[
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
          ...statusArray,
        ]}
        nameColor={themeRef.colors.primaryColor}
      />
      <ChatsPage />
      <AppStatusBar
        dark={themeRef.dark}
        barStyle={'light-content'}
        backgroundColor={themeRef.colors.appThemeColor}
        translucent={true}
      />
    </View>
  );
};
