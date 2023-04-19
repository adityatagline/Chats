import {useContext} from 'react';
import {View} from 'react-native';
import {FirebaseStreamTaskContext} from '../../../../context/FirebaseStreamTaskContext';
import {FlatList} from 'react-native';
import BaseText from '../../../components/BaseText';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {fontSize} from '../../../styles/commonStyles';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconButton from '../../../components/IconButton';

const UploadingTrayComponent = ({username}) => {
  const themeRef = useTheme();

  const contextRef = useContext(FirebaseStreamTaskContext);
  // console.log({contextRef});

  function RenderTask({item}) {
    // console.log({item});
    const bytesTransferred = item?.stateDetails?.bytesTransferred;
    const totalBytes = item?.stateDetails?.totalBytes;
    let transferRatio =
      !bytesTransferred || !totalBytes
        ? 0
        : (bytesTransferred / totalBytes) * 100;
    transferRatio = transferRatio.toFixed(2);
    let {filename} = item.fileObject;
    let ext = filename.split('.').reverse()[0];
    filename = filename.replace(`.${ext}`, '');
    return (
      <View
        style={{
          backgroundColor: themeRef.colors.appThemeColor,
          paddingVertical: hp(1),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(2),
          borderRadius: hp(2),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Ionicons
          name={'cloud-upload'}
          size={20}
          color={themeRef.colors.primaryColor}
        />

        <View
          style={{
            // backgroundColor: 'red',
            marginHorizontal: wp(2),
            maxWidth: wp(32),
          }}>
          <BaseText
            weight={fontWeights.bold}
            size={fontSize.medium}
            color={themeRef.colors.primaryColor}
            otherProp={{
              numberOfLines: 1,
            }}>
            {filename}
          </BaseText>
          <BaseText
            weight={fontWeights.semiBold}
            size={fontSize.small}
            color={themeRef.colors.card}>
            {transferRatio} %
          </BaseText>
        </View>
        <View
          style={{
            backgroundColor: themeRef.colors.primaryColor,
            alignSelf: 'center',
            paddingHorizontal: wp(2),
            paddingVertical: hp(0.5),
            borderRadius: hp(1.5),
            opacity: 0.7,
          }}>
          <BaseText
            size={fontSize.extrasmall}
            weight={fontWeights.semiBold}
            otherStyles={{
              textTransform: 'uppercase',
              letterSpacing: wp(0.1),
            }}
            color={themeRef.colors.appThemeColor}>
            {ext}
          </BaseText>
        </View>
        <IconButton
          name={'close'}
          size={25}
          color={themeRef.colors.primaryColor}
          containerStyle={{
            marginLeft: wp(2),
          }}
        />
      </View>
    );
  }

  if (
    !!contextRef?.tasks[username] &&
    contextRef?.tasks[username].length != 0
  ) {
    return (
      <View
        style={{
          // backgroundColor: 'green',
          marginHorizontal: wp(3),
          marginVertical: hp(2),
          // height: 200,
        }}>
        <FlatList
          horizontal
          data={contextRef?.tasks[username]}
          renderItem={RenderTask}
          keyExtractor={(item, index) => index + 666777}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default UploadingTrayComponent;
