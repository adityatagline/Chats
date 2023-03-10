import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {memo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useTheme} from '@react-navigation/native';
import {fontSize} from '../../../styles/commonStyles';
import FontfamiliesNames from '../../../strings/FontfamiliesNames';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const PageHeading = ({
  disableBackButton = false,
  rightButton,
  middleComponenet,
  backButtonProps,
  backButtonStyle,
}) => {
  const navigation = useNavigation();
  const themeRef = useTheme();

  return (
    <View style={styles.mainDiv}>
      {!disableBackButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
            {!!backButtonProps.backScreen ? backButtonProps.backScreen : 'Back'}
          </Text>
        </TouchableOpacity>
      )}
      {!!middleComponenet && middleComponenet}
      {!!rightButton && rightButton}
    </View>
  );
};

export default memo(PageHeading);

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
