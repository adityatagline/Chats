import {useTheme} from '@react-navigation/native';
import {useRef, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonStyles, StatusBarHeight} from '../../../styles/commonStyles';
import IconButton from '../../../components/IconButton';

export default ProfileModal = () => {
  const themeRef = useTheme();
  const authenticationSlice = useSelector(state => state.authenticationSlice);
  const modalDimensionRef = useRef(new Animated.ValueXY({x: 0, y: 0}));

  const styles = StyleSheet.create({
    mainDiv: {
      position: 'absolute',
      top: hp(4.8),
      right: wp(15),
    },
    profilePhotoStyle: {
      height: hp(4),
      width: hp(4),
      // backgroundColor: 'red',
    },
  });

  return (
    <Animated.View style={[styles.mainDiv]} ref={modalDimensionRef}>
      {/* <IconButton name={'ellipsis-vertical'} size={25} /> */}
      <TouchableOpacity>
        <Image
          source={{uri: authenticationSlice.user.profilePhoto}}
          style={styles.profilePhotoStyle}
          borderRadius={12}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
