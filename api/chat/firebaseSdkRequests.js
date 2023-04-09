import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useContext} from 'react';
import {FirebaseStreamTaskContext} from '../../context/FirebaseStreamTaskContext';

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

export const sendGPMessageToFB = async (groupId, chatObject) => {
  try {
    const sendInGroup = await firestore()
      .collection('groupChats')
      .doc(groupId)
      .collection('chats')
      .doc(chatObject.id)
      .set({...chatObject});

    return {
      isError: false,
      data: sendInGroup,
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
    let response = await uploadFileToFirebase(
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
    // console.log({errorinuploadProfilePic: error});

    return {
      isError: true,
      error,
    };
  }
};

export const uploadFileToFirebase = async (
  imgObj,
  path,
  contextRef,
  sendMediaMessage,
) => {
  try {
    console.log({imgObj, contextRef});

    const uploadResponse = storage().ref(path).putFile(imgObj.path);
    console.log('running upload');
    contextRef.addTask(uploadResponse);
    console.log('running upload');
    uploadResponse.on('state_changed', async stateDetails => {
      contextRef.updateTask(uploadResponse, stateDetails, sendMediaMessage);
    });
  } catch (error) {
    console.log({errorinuploadFileToFirebase: error});
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
