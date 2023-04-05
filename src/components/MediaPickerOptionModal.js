import {useTheme} from '@react-navigation/native';
import {fontWeights} from '../strings/FontfamiliesNames';
import {commonStyles, fontSize} from '../styles/commonStyles';
import BaseModal from './BaseModal';
import BaseText from './BaseText';
import {Alert, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SimpleButton from './SimpleButton';
import TextButton from './TextButton';
import {openCamera, openPicker} from 'react-native-image-crop-picker';

const openMediaPickerModal = async (mode, mediaType, selectionLimit = 1) => {
  // console.log({mode, mediaType, selectionLimit});
  try {
    if (mode == 'library') {
      const pickerResponse = await openPicker({
        mediaType,
        selectionLimit,
        cropping: true,
      });
      const {filename, sourceURL, height, width, path, localIdentifier, size} =
        pickerResponse;
      return {filename, sourceURL, height, width, path, localIdentifier, size};
    } else {
      if (Platform.OS == 'android') {
        const permission = await PermissionsAndroid.request(
          'android.permission.CAMERA',
        );
      }
      if (permission == 'never_ask_again') {
        Alert.alert(
          'Oops',
          'You never gave pemission to open camera.\nGive app permission from settings.',
        );
        return;
      }
      // console.log({permission});
      const cameraResponse = await openCamera({
        mediaType,
        cropping: true,
      });
      const {filename, sourceURL, height, width, path, localIdentifier, size} =
        cameraResponse;
      return {filename, sourceURL, height, width, path, localIdentifier, size};
    }
  } catch (error) {
    if (error.code != 'E_PICKER_CANCELLED') {
      Alert.alert('Oops', error.message);
    }
  }
};

const MediaPickerOptionModal = ({
  afterChoosehandler,
  visibility,
  closeActions,
  mediaType,
  selectionLimit,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    confirmHeading: {
      alignSelf: 'center',
      marginBottom: hp(2),
    },
  });

  const openModal = async mode => {
    const pickerResponse = await openMediaPickerModal(
      mode,
      mediaType,
      selectionLimit,
    );
    // console.log({pickerResponse});
    await afterChoosehandler({...pickerResponse});
  };

  return (
    <BaseModal visibility={visibility}>
      <BaseText
        size={fontSize.extralarge}
        weight={fontWeights.bold}
        color={themeRef.colors.appThemeColor}
        otherStyles={[styles.confirmHeading]}>
        Choose Action
      </BaseText>
      <SimpleButton
        title={'Choose From Library'}
        onPress={openModal.bind(this, 'library')}
      />
      <SimpleButton
        title={'Open Camera'}
        onPress={openModal.bind(this, 'camera')}
      />
      <TextButton
        title={'Cancel'}
        textStyle={[
          commonStyles.baseModalCancelBtn,
          {color: themeRef.colors.errorColor},
        ]}
        onPress={closeActions}
      />
    </BaseModal>
  );
};

export default MediaPickerOptionModal;
