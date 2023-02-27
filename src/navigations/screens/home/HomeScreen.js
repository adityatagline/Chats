import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {StyleSheet, View, NativeModules} from 'react-native';
import {useSelector} from 'react-redux';
import {AppStatusBar} from '../../../components/AppStatusBar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SearchPage from '../../../components/home/search/SearchPage';
import HomepageChatsPage from '../../../components/home/HomepageChatsPage';
import {commonStyles} from '../../../styles/commonStyles';
import {AddNewChatButton} from '../../../components/home/AddNewChatButton';
import {getUserHomepageChats} from '../../../../api/chat/ChatRequests';

export default HomeScreen = props => {
  const themeRef = useTheme();
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const loadingSlice = useSelector(state => state.loadingSlice);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    getInitialData();
    isFocused && props.setterFunction(route.name);
  }, [isFocused]);

  const getInitialData = async () => {
    const response = await getUserHomepageChats(
      authenticationSlice.user.username,
    );
    console.log('response');
    console.log(response);
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      paddingTop: hp(12),
    },
    searchDiv: {
      flexDirection: 'row',
      marginHorizontal: wp(7),
    },
  });

  return (
    <View style={[styles.mainDiv]}>
      <View style={styles.searchDiv}>
        <SearchPage />
      </View>
      <HomepageChatsPage />
      <AppStatusBar dark={themeRef.dark} />
    </View>
  );
};
