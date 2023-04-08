import {useTheme} from '@react-navigation/native';
import {fontWeights} from '../strings/FontfamiliesNames';
import {commonStyles, fontSize} from '../styles/commonStyles';
import BaseModal from './BaseModal';
import BaseText from './BaseText';
import {
  Alert,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SimpleButton from './SimpleButton';
import TextButton from './TextButton';
import {
  openCamera,
  openCropper,
  openPicker,
} from 'react-native-image-crop-picker';
import {useEffect} from 'react';

export const openMediaPickerModal = async (
  mode,
  mediaType,
  selectionLimit = 1,
) => {
  console.log({mode, mediaType, selectionLimit});
  try {
    let pickerConfig = {
      mediaType,
      selectionLimit,
      // cropping: true,
      multiple: selectionLimit > 1,
      maxFiles: selectionLimit,
    };
    if (mediaType == 'photo') {
      pickerConfig.cropping = true;
    }
    if (mode == 'library') {
      const pickerResponse = await openPicker(pickerConfig);
      if (selectionLimit > 1) {
        return [...pickerResponse].map(item => {
          let returnObj = {...item};
          if (item.filename == undefined || item.filename == 'undefined') {
            returnObj['filename'] = item.path
              .split('/')
              .reverse()[0]
              .toString();
          }
          return {...returnObj};
        });
      } else {
        let {filename, sourceURL, height, width, path, localIdentifier, size} =
          pickerResponse;
        if (!filename || filename == undefined) {
          filename = path.split('/').reverse()[0];
        }
        console.log({filename});
        return {
          filename,
          sourceURL,
          height,
          width,
          path,
          localIdentifier,
          size,
        };
      }
    } else {
      let permission;
      if (Platform.OS == 'android') {
        permission = await PermissionsAndroid.request(
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
      const cameraResponse = await openCamera({
        mediaType,
        cropping: true,
      });
      let {filename, sourceURL, height, width, path, localIdentifier, size} =
        cameraResponse;
      if (!filename || filename == undefined) {
        filename = path.split('/').reverse()[0];
      }
      return [
        {filename, sourceURL, height, width, path, localIdentifier, size},
      ];
    }
  } catch (error) {
    // console.log({error});

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
  isProfilePhoto,
}) => {
  const themeRef = useTheme();
  const styles = StyleSheet.create({
    confirmHeading: {
      alignSelf: 'center',
      marginBottom: hp(2),
    },
  });

  const openModal = async mode => {
    try {
      const pickerResponse = await openMediaPickerModal(
        mode,
        mediaType,
        selectionLimit,
      );
      let mediaObj = pickerResponse;
      if (selectionLimit == 1 && mediaType == 'photo') {
        mediaObj = await openCropper({
          height: 480,
          width: 480,
          path: pickerResponse[0].path,
        });
      }
      console.log({mediaObj});
      await afterChoosehandler(mediaObj);
    } catch (error) {
      // console.log({error});
    }
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
