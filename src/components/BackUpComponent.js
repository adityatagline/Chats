import {View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BaseText from './BaseText';
import {fontWeights} from '../strings/FontfamiliesNames';
import {commonStyles, fontSize} from '../styles/commonStyles';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import IconButton from './IconButton';

const BackUpComponent = ({
  item,
  isLast = false,
  themeRef,
  isExpandedDef = false,
  setIsExpanded,
  onDownloadPress = () => {},
  onDeletePress = () => {},
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: themeRef.colors.appThemeColor,
          marginHorizontal: isExpandedDef ? wp(2) : wp(8),
          paddingHorizontal: wp(7),
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
        }}
        onPress={() => setIsExpanded(item)}>
        <BaseText
          color={themeRef.colors.primaryColor}
          weight={fontWeights.medium}
          size={fontSize.extrasmall}>
          {!!isLast ? 'Last Backup' : 'Backup from'}
        </BaseText>
        <BaseText
          color={themeRef.colors.primaryColor}
          weight={fontWeights.bold}>
          {new Date(item.date).toDateString()} at{' '}
          {new Date(item.date).toLocaleTimeString()}
        </BaseText>
      </TouchableOpacity>
      {isExpandedDef && !isLast && (
        <View style={[commonStyles.rowCenter]}>
          <IconButton
            name={'cloud-download-outline'}
            size={25}
            containerStyle={{
              marginHorizontal: wp(2),
            }}
            onPress={onDownloadPress.bind(this, item)}
            color={themeRef.colors.appThemeColor}
          />
          <IconButton
            name={'trash-outline'}
            size={25}
            containerStyle={{
              marginHorizontal: wp(2),
            }}
            onPress={onDeletePress.bind(this, item)}
            color={themeRef.colors.appThemeColor}
          />
        </View>
      )}
    </View>
  );
};

export default BackUpComponent;
