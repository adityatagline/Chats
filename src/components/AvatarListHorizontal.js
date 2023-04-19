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
import {imageUrlStrings} from '../strings/ImageUrlStrings';
import {useSelector} from 'react-redux';

const AvatarListHorizontal = ({
  listArray,
  nameField,
  uriField,
  haveRemoveBtn = false,
  onRemoveHandler,
  themeRef,
  onlyUsername = false,
}) => {
  const {friends} = useSelector(state => state.chatSlice);
  const {user} = useSelector(state => state.authenticationSlice);
  const RenderAvatar = ({item}) => {
    // console.log({item});
    return (
      <View
        style={{
          width: wp(17),
          //   backgroundColor: 'yellow',
          marginHorizontal: wp(1),
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View>
          <ImageCompWithLoader
            source={
              !!item[uriField]
                ? {
                    uri: item[uriField],
                  }
                : imageUrlStrings.profileSelected
            }
            resizeMode="contain"
            ImageStyles={{
              height: wp(12),
              width: wp(12),
              borderRadius: 500,
            }}
          />
          {item.username != user.username && (
            <IconButton
              name={'close'}
              color={themeRef.colors.primaryColor}
              size={20}
              containerStyle={{
                backgroundColor: themeRef.colors.appThemeColor,
                position: 'absolute',
                borderRadius: 500,
                height: hp(3.5),
                width: hp(3.5),
                alignItems: 'center',
                justifyContent: 'center',
                bottom: 0,
                right: -hp(1.5),
                borderWidth: 2,
                borderColor: themeRef.colors.primaryColor,
              }}
              onPress={onRemoveHandler.bind(this, item)}
            />
          )}
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
        renderItem={({item}) => <RenderAvatar item={friends[item]} />}
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
