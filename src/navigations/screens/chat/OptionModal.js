import {StyleSheet, TouchableOpacity, View} from 'react-native';
import BaseText from '../../../components/BaseText';
import BaseModal from '../../../components/BaseModal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextButton from '../../../components/TextButton';
import {fontWeights} from '../../../strings/FontfamiliesNames';
import {fontSize} from '../../../styles/commonStyles';
import SimpleButton from '../../../components/SimpleButton';
import {useState} from 'react';
import FloatingOptionModal from '../../../components/FloatingOptionModal';

const OptionModal = ({
  cancelColor,
  modalVisibility,
  setModalVisibility,
  themeRef,
  clearAllChats,
  onSearchPress,
}) => {
  const Seperator = () => {
    return (
      <View
        style={[
          styles.seperator,
          {
            backgroundColor: themeRef.colors.secondaryColor,
          },
        ]}></View>
    );
  };

  return (
    // <BaseModal visibility={modalVisibility}>
    //   <View
    //     style={{
    //       alignItems: 'center',
    //     }}>
    //     <SimpleButton title={'Search in chat'} />
    //     <SimpleButton title={'Clear chats'} />
    //     <TextButton
    //       title={'Cancel'}
    //       textStyle={{
    //         marginVertical: hp(2),
    //         color: cancelColor,
    //         fontSize: fontSize.big,
    //       }}
    //       onPress={() => {
    //         setModalVisibility(false);
    //       }}
    //     />
    //   </View>
    // </BaseModal>
    <FloatingOptionModal
      visibility={modalVisibility}
      onOutsidePressHandler={() => setModalVisibility(false)}
      height={hp(15)}
      width={wp(50)}
      canClosable>
      <TextButton
        title={'Search in chat'}
        textStyle={{
          color: themeRef.colors.appThemeColor,
          fontSize: fontSize.big,
        }}
        onPress={onSearchPress}
      />
      <Seperator />
      <TextButton
        title={'Clear chats'}
        textStyle={{
          color: themeRef.colors.appThemeColor,
          fontSize: fontSize.big,
        }}
        onPress={
          clearAllChats
          // setModalVisibility(false);
        }
      />
      <Seperator />
      <TextButton
        title={'Cancel'}
        textStyle={{
          color: cancelColor,
          fontSize: fontSize.big,
        }}
        onPress={() => {
          setModalVisibility(false);
        }}
      />
    </FloatingOptionModal>
  );
};

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: 'black',
    height: 0.5,
    marginHorizontal: wp(5),
    marginVertical: hp(0.2),
  },
});

export default OptionModal;
