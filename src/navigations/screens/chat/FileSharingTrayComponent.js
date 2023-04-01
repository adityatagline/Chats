import React, {useEffect, useState, useRef} from 'react';
import {Animated} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconButton from '../../../components/IconButton';

const FileSharingTrayComponent = ({visibility, setterFunc}) => {
  const themeRef = useTheme();
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
            y: wp(90),
          },
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(10),
            y: wp(90),
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
            x: hp(10),
            y: wp(90),
          },
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fileSendingTray, {
          toValue: {
            x: hp(0),
            y: wp(90),
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
          style={{
            height: fileSendingTray.x,
            width: fileSendingTray.y,
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
          }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              opacity: fileSendingTrayScaleAndOpacity.y,
              transform: [
                {
                  scale: fileSendingTrayScaleAndOpacity.x,
                },
              ],
            }}>
            <IconButton name={'image'} color={themeRef.colors.appThemeColor} />
            <IconButton name={'film'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'document'}
              color={themeRef.colors.appThemeColor}
            />
            <IconButton name={'folder'} color={themeRef.colors.appThemeColor} />
            <IconButton
              name={'location'}
              color={themeRef.colors.appThemeColor}
            />
          </Animated.View>
        </Animated.View>
      ) : null}
    </>
  );
};

export default FileSharingTrayComponent;
