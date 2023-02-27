import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeModules,
  Appearance,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {fontSize} from '../../../styles/commonStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {memo} from 'react';

export const PageName = memo(({name, customStyle}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    pageHeading: {
      // backgroundColor: "yellow",
      // flex: 1,
      // textAlign: "center",
      marginLeft: wp(10),
      fontSize: fontSize.heading,
      fontFamily: FontfamiliesNames.primaryFontBold,
      color: themeRef.colors.appThemeColor,
    },
  });
  return <Text style={[styles.pageHeading, customStyle]}>{name}</Text>;
});

export const SettingItem = memo(
  ({title, onPress, customContainerStyle, customLabelStyle, itemIcon}) => {
    const themeRef = useTheme();
    const styles = StyleSheet.create({
      settingItem: {
        // backgroundColor: "yellow",
        flexDirection: 'row',
        marginVertical: hp(1),
        paddingVertical: hp(1),
        borderRadius: 15,
        paddingHorizontal: wp(8),
        alignItems: 'center',
      },
      settingItemIcon: {
        paddingRight: wp(5),
      },
      settingItemLabel: {
        // fontWeight: "bold",
        fontSize: fontSize.large,
        fontFamily: FontfamiliesNames.primaryFontSemiBold,
        color: themeRef.colors.secondaryColor,
      },
    });
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
  },
);

export const PageHeading = memo(
  ({
    disableBackButton = false,
    rightButton,
    middleComponenet,
    backButtonProps,
    backButtonStyle,
    backNavigationScreen,
  }) => {
    const navigation = useNavigation();
    const themeRef = useTheme();

    const navigatwBack = () => {
      if (!!backNavigationScreen) {
        navigation.navigate(backNavigationScreen);
      } else {
        navigation.goBack();
      }
    };

    const styles = StyleSheet.create({
      mainDiv: {
        // backgroundColor: "red",
        // marginTop: "50%",
      },
      backButtonIcon: {
        // backgroundColor: "lightblue",
        // paddingHorizontal: "3%",
      },
      backButtonDiv: {
        // backgroundColor: "lightblue",
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: wp(7),
        marginVertical: hp(2),
        marginBottom: hp(3),
        justifyContent: 'center',
      },
      backButtonLabel: {
        fontSize: fontSize.medium,
        fontFamily: FontfamiliesNames.primaryFontBold,
      },
    });

    return (
      <View style={styles.mainDiv}>
        {!disableBackButton && (
          <TouchableOpacity
            onPress={navigatwBack}
            style={[styles.backButtonDiv, backButtonStyle]}>
            <Icon
              name={backButtonProps.name}
              size={backButtonProps.size}
              color={backButtonProps.color}
              style={[styles.backButtonIcon]}
            />
            <Text
              style={[
                styles.backButtonLabel,
                {color: themeRef.colors.secondaryColor},
              ]}>
              {!!backButtonProps.backScreen
                ? backButtonProps.backScreen
                : 'Back'}
            </Text>
          </TouchableOpacity>
        )}
        {!!middleComponenet && middleComponenet}
        {!!rightButton && rightButton}
      </View>
    );
  },
);
