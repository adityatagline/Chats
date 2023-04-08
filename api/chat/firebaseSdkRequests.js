import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const sendMessageToFirestore = async (
  senderUsername,
  receiverUsername,
  chatObject,
) => {
  try {
    const sendToSender = await firestore()
      .collection('chats')
      .doc('individual')
      .collection(senderUsername)
      .doc(chatObject.id)
      .set({...chatObject, otherUser: receiverUsername});

    const sendToReceiver = firestore()
      .collection('chats')
      .doc('individual')
      .collection(receiverUsername)
      .doc(chatObject.id)
      .set({...chatObject, otherUser: senderUsername});

    return {
      isError: false,
      data: sendToSender,
    };
  } catch (error) {
    // console.log({firebaseErrr: error});
    return {
      isError: true,
      error,
    };
  }
};

export const checkAndDeleteMessage = async (messageArray, currentUser) => {
  try {
    messageArray.forEach(async messageObj => {
      let idObj = JSON.parse(messageObj.id);
      if (idObj.su == currentUser) {
        return;
      }

      // console.log({messageObj});
      let isExistAtUser = await firestore()
        .collection('chats')
        .doc('individual')
        .collection(currentUser)
        .doc(messageObj.id)
        .get();
      isExistAtUser = !!isExistAtUser.data();

      let isExistAtOtherUser = await firestore()
        .collection('chats')
        .doc('individual')
        .collection(messageObj.otherUser)
        .doc(messageObj.id)
        .get();
      isExistAtOtherUser = !!isExistAtOtherUser.data();

      if (!!isExistAtUser) {
        let deleteMessageAtUser = await firestore()
          .collection('chats')
          .doc('individual')
          .collection(currentUser)
          .doc(messageObj.id)
          .delete();
      }
      if (!!isExistAtOtherUser) {
        let deleteMessageAtOtherUser = await firestore()
          .collection('chats')
          .doc('individual')
          .collection(messageObj.otherUser)
          .doc(messageObj.id)
          .delete();
      }
    });
  } catch (error) {}
};

export const uploadProfilePic = async (imgObj, username) => {
  // console.log({imgObj});
  // return;
  try {
    let filename = !!imgObj.filename ? imgObj.filename : imgObj.path;
    let extension = filename.split('.').reverse()[0].toString();
    let response = await uploadImageToFBStorage(
      imgObj,
      `/profilePhoto/${username}/profilePhoto${new Date().toString()}.${extension}`,
    );
    // console.log({response});
    if (response.isError) {
      return {
        isError: true,
        error: response.error,
      };
    }
    return {
      isError: false,
      data: response.data,
    };
  } catch (error) {
    console.log({errorinuploadProfilePic: error});

    return {
      isError: true,
      error,
    };
  }
};

export const uploadImageToFBStorage = async (imgObj, path) => {
  try {
    const uploadResponse = await storage().ref(path).putFile(imgObj.path);
    const downloadurl = await storage()
      .ref(uploadResponse.metadata.fullPath)
      .getDownloadURL();
    return {
      isError: false,
      data: {
        path: uploadResponse.metadata.fullPath,
        uri: downloadurl,
      },
    };
  } catch (error) {
    console.log({errorinuploadImageToFBStorage: error});
    return {
      isError: true,
      error,
    };
  }
};

export const deleteFromFBStorage = async path => {
  try {
    const deleteResponse = await storage().ref(path).delete();
    // console.log({deleteResponse});
    return {
      isError: false,
      data: deleteResponse,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};
