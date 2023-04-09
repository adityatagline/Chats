import {FlatList, StyleSheet, View} from 'react-native';
import BaseText from './BaseText';
import ImageCompWithLoader from './ImageCompWithLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {fontWeights} from '../strings/FontfamiliesNames';
import {fontSize} from '../styles/commonStyles';
import IconButton from './IconButton';

const AvatarListHorizontal = ({
  listArray,
  nameField,
  uriField,
  haveRemoveBtn = false,
  onRemoveHandler,
  themeRef,
}) => {
  const RenderAvatar = ({item}) => {
    // console.log({item});
    return (
      <View
        style={{
          width: wp(17),
          //   backgroundColor: 'yellow',
          marginHorizontal: wp(1),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <ImageCompWithLoader
            source={{uri: item[uriField]}}
            resizeMode="contain"
            ImageStyles={{
              height: wp(12),
              width: wp(12),
              borderRadius: hp(2.5),
            }}
          />
          <IconButton
            name={'close'}
            color={themeRef.colors.primaryColor}
            size={20}
            containerStyle={{
              backgroundColor: themeRef.colors.appThemeColor,
              position: 'absolute',
              borderRadius: hp(1.6),
              height: hp(4),
              width: hp(4),
              alignItems: 'center',
              justifyContent: 'center',
              bottom: 0,
              right: -hp(1),
              borderWidth: 2,
              borderColor: themeRef.colors.primaryColor,
            }}
            onPress={onRemoveHandler.bind(this, item)}
          />
        </View>
        <BaseText
          otherProp={{
            numberOfLines: 2,
          }}
          otherStyles={{
            textAlign: 'center',
          }}
          color={themeRef.colors.secondaryColor}
          weight={fontWeights.semiBold}
          size={fontSize.small}>
          {item[nameField]}
        </BaseText>
        {/* <BaseText>{item[uriField]}</BaseText> */}
      </View>
    );
  };

  return (
    <View style={styles.mainDiv}>
      <FlatList
        data={listArray}
        renderItem={RenderAvatar}
        keyExtractor={(item, index) => index + 'avatar'}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainDiv: {
    // backgroundColor: 'red',
    marginVertical: hp(1.5),
  },
});

export default AvatarListHorizontal;
