import React, {useEffect, useState, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconButton from '../../../components/IconButton';
import MediaPickerOptionModal from '../../../components/MediaPickerOptionModal';

const FileSharingTrayComponent = ({
  visibility,
  setterFunc,
  onImagePress,
  onVideoPress,
  onDocPress,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    mainDiv: {
      backgroundColor: themeRef.colors.primaryColor,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      elevation: 4,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowColor: themeRef.colors.secondaryColor,
    },
    trayDiv: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  });
  const [isAdded, setIsAdded] = useState(false);

  const fileSendingTray = useRef(
    new Animated.ValueXY({
      x: hp(0),
      y: wp(0),
    }),
  ).current;
  const fileSendingTrayScaleAndOpacity = useRef(
    new Animated.ValueXY({
      x: 0.5,
      y: 0,
    }),
  ).current;

  useEffect(() => {
    const expandFileSendingTray = () => {
      setIsAdded(true);
      setterFunc(true);
      Animated.sequence([
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(60),
          },
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(8),
            y: wp(60),
          },
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTrayScaleAndOpacity, {
          toValue: {
            x: 1,
            y: 1,
          },
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };
    const closeFileSendingTray = () => {
      Animated.sequence([
        Animated.timing(fileSendingTrayScaleAndOpacity, {
          toValue: {
            x: 0.5,
            y: 0,
          },
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(8),
            y: wp(60),
          },
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(60),
          },
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(0),
          },
          duration: 10,
          useNativeDriver: false,
        }),
      ]).start();
      setTimeout(() => {
        setIsAdded(false);
      }, 700);
    };
    if (visibility) {
      expandFileSendingTray();
    } else {
      closeFileSendingTray();
    }
  }, [visibility]);

  return (
    <>
      {!!isAdded ? (
        <Animated.View
          style={[
            styles.mainDiv,
            {
              height: fileSendingTray.x,
              width: fileSendingTray.y,
            },
          ]}>
          <Animated.View
            style={[
              styles.trayDiv,
              {
                opacity: fileSendingTrayScaleAndOpacity.y,
                transform: [
                  {
                    scale: fileSendingTrayScaleAndOpacity.x,
                  },
                ],
              },
            ]}>
            <IconButton
              name={'image'}
              color={themeRef.colors.appThemeColor}
              onPress={onImagePress}
            />
            <IconButton
              name={'film'}
              color={themeRef.colors.appThemeColor}
              onPress={onVideoPress}
            />
            <IconButton
              name={'document'}
              color={themeRef.colors.appThemeColor}
              onPress={onDocPress}
            />
            {/* <IconButton
              name={'location'}
              color={themeRef.colors.appThemeColor}
            /> */}
          </Animated.View>
        </Animated.View>
      ) : null}
    </>
  );
};

export default FileSharingTrayComponent;
