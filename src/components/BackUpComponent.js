import {View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import BaseText from './BaseText';
import {fontWeights} from '../strings/FontfamiliesNames';
import {fontSize} from '../styles/commonStyles';

const BackUpComponent = ({item, isLast = false, themeRef}) => (
  <View
    style={{
      backgroundColor: themeRef.colors.appThemeColor,
      marginHorizontal: widthPercentageToDP(8),
      paddingHorizontal: widthPercentageToDP(7),
      paddingVertical: hp(1.5),
      borderRadius: hp(2),
      shadowColor: themeRef.colors.appThemeColor,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 7,
      marginVertical: isLast ? 0 : hp(0.5),
    }}>
    <BaseText
      color={themeRef.colors.primaryColor}
      weight={fontWeights.medium}
      size={fontSize.extrasmall}>
      Last Backup
    </BaseText>
    <BaseText color={themeRef.colors.primaryColor} weight={fontWeights.bold}>
      {new Date(item.date).toDateString()} at{' '}
      {new Date(item.date).toLocaleTimeString()}
    </BaseText>
  </View>
);

export default BackUpComponent;
