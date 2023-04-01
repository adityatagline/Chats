import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {dimensions, fontSize} from '../../../styles/commonStyles';
import {animateNoChat, removeNoChat} from './ChatPageAnimationFuncs';

const NoChatAnimatedCompoenet = ({visibility, themeRef}) => {
  const noChatRef = useRef(
    new Animated.ValueXY({x: 0, y: dimensions.height * 0.15}),
  ).current;
  const [noChatRefValue, setNoChatRefValue] = useState();

  useEffect(() => {
    if (!!noChatRefValue && !visibility) {
      clearInterval(noChatRefValue);
      removeNoChat(noChatRef, {x: 0, y: dimensions.height * 0.1}, 700);
      setNoChatRefValue();
    } else if (!!visibility && !noChatRefValue) {
      setNoChatRefValue(
        animateNoChat(noChatRef, {x: 0.6, y: dimensions.height * 0.16}, 500),
      );
    }
  }, [visibility]);

  return (
    <Animated.Text
      ref={noChatRef}
      style={[
        styles.noChatText,
        {color: themeRef.colors.secondaryColor},
        {
          opacity: noChatRef.x,
          top: noChatRef.y,
        },
      ]}>
      No recent chats ..
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  noChatText: {
    fontSize: fontSize.medium,
    backgroundColor: '#F0F0F0',
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default NoChatAnimatedCompoenet;
