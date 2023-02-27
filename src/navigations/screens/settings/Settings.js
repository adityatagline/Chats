import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import React, {useEffect} from 'react';
import PageHeading from './PageHeading';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  commonStyles,
  fontSize,
  StatusBarHeight,
} from '../../../styles/commonStyles';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import ScreenNames from '../../../strings/ScreenNames';

export default Settings = props => {
  const PageName = () => {
    return <Text style={styles.pageHeading}>Settings</Text>;
  };
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const themeRef = useTheme();

  useEffect(() => {
    isFocused && props.setterFunction(route.name);
  }, [isFocused]);

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  const SettingItem = ({
    title,
    onPress,
    customContainerStyle,
    customLabelStyle,
    itemIcon,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.settingItem, customContainerStyle]}>
        <Icon
          name={itemIcon}
          size={30}
          color={themeRef.colors.secondaryColor}
          style={styles.settingItemIcon}
        />
        <Text style={[styles.settingItemLabel, customLabelStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    ...commonStyles,
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      flex: 1,
      paddingTop: hp(10),
    },
    pageHeading: {
      // backgroundColor: "yellow",
      // flex: 1,
      // textAlign: "center",
      marginLeft: '10%',
      fontSize: 25,
      fontWeight: 'bold',
    },
    settingItem: {
      // backgroundColor: "yellow",
      flexDirection: 'row',
      marginVertical: '1%',
      paddingVertical: '4%',
      marginHorizontal: wp(2),
      borderRadius: 15,
      alignItems: 'center',
    },
    settingItemIcon: {
      paddingRight: '5%',
      alignSelf: 'center',
    },
    settingItemLabel: {
      fontSize: fontSize.large,
      fontFamily: FontfamiliesNames.primaryFontSemiBold,
      color: themeRef.colors.secondaryColor,
      alignSelf: 'center',
      // fontWeight: "bold",
    },
    listDiv: {
      marginTop: '5%',
    },
  });

  return (
    <View style={[styles.screenStyle, styles.mainDiv]}>
      <ScrollView style={styles.listDiv}>
        <SettingItem
          title={'Appearence'}
          itemIcon={'color-palette-outline'}
          onPress={goToScreen.bind(
            this,
            ScreenNames.TopTabInnerScreens.Appearence,
          )}
        />
        <SettingItem
          title={'Privacy and Security'}
          itemIcon={'shield-outline'}
          onPress={goToScreen.bind(
            this,
            ScreenNames.TopTabInnerScreens.PrivacyNSecurity,
          )}
        />
        <SettingItem
          title={'Backup and Restore'}
          itemIcon={'cloud-upload-outline'}
          onPress={goToScreen.bind(
            this,
            ScreenNames.TopTabInnerScreens.BackupNRestore,
          )}
        />
        <SettingItem title={'Log out'} itemIcon={'exit-outline'} />
      </ScrollView>
    </View>
  );
};
