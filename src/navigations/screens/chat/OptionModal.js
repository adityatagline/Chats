import {TouchableOpacity, View} from 'react-native';
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

const OptionModal = ({cancelColor, modalVisibility, setModalVisibility}) => {
  return (
    <BaseModal visibility={modalVisibility}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <SimpleButton title={'Search in chat'} />
        <SimpleButton title={'Clear chats'} />
        <TextButton
          title={'Cancel'}
          textStyle={{
            marginVertical: hp(2),
            color: cancelColor,
            fontSize: fontSize.big,
          }}
          onPress={() => {
            setModalVisibility(false);
          }}
        />
      </View>
    </BaseModal>
  );
};

export default OptionModal;
