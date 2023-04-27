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

export const sendGPMessageToFB = async (
  groupId,
  chatObject,
  isFirst = false,
) => {
  try {
    // console.log({chatObject});
    let sendInGroup;
    if (isFirst) {
      sendInGroup = await firestore()
        .collection('groupChats')
        .doc(groupId)
        .set({[chatObject.id]: {...chatObject}});
    } else {
      sendInGroup = await firestore()
        .collection('groupChats')
        .doc(groupId)
        .update({[chatObject.id]: {...chatObject}});
    }

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
      if (messageObj.from == currentUser) {
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
    let storageRef = storage().ref(
      `/profilePhoto/${username}/profilePhoto${new Date().toString()}.${extension}`,
    );
    let response = await storageRef.putFile(imgObj.path);
    let uri = await storageRef.getDownloadURL();

    // console.log({response});

    return {
      isError: false,
      data: {
        path: response.metadata.fullPath,
        uri,
      },
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
  uploadContext,
  sendMediaMessage,
  username,
  fileObject,
  sendNoti,
) => {
  try {
    // console.log({imgObj, uploadContext});

    const fileRef = storage().ref(path);
    const uploadResponse = fileRef.putFile(imgObj.path);
    // console.log('running upload');
    uploadContext.addTask(uploadResponse, username, fileObject);
    // console.log('running upload');
    uploadResponse.on('state_changed', async stateDetails => {
      try {
        if (
          stateDetails.bytesTransferred == stateDetails.totalBytes ||
          stateDetails.state == 'success'
        ) {
          let uri = await storage().ref(path).getDownloadURL();
          // console.log({uri});

          let isDeleted = await uploadContext.deleteTask(
            uploadResponse._id,
            username,
          );
          // console.log({isDeleted});
          if (isDeleted) {
            let sendResponse = await sendMediaMessage(
              {path: stateDetails.metadata.fullPath, uri},
              fileObject.type,
            );
            await sendNoti();
          }
        } else {
          uploadContext.updateTask(uploadResponse._id, username, stateDetails);
        }
      } catch (error) {
        console.log({errorInOn: error});
      }
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

export const sendLastSeen = async (username, otherUser, chatObject) => {
  try {
    let send = await firestore()
      .collection('chats')
      .doc('individual')
      .collection(username)
      .doc('lastSeen')
      .set(
        {[otherUser]: chatObject},
        {
          merge: true,
        },
      );

    return {
      isError: false,
      data: send,
    };
  } catch (error) {
    console.log({errorsendLastSeen: error});
    return {
      isError: true,
      error,
    };
  }
};

export const sendGPLastSeen = async (username, groupId, chatObject) => {
  try {
    let send = await firestore()
      .collection('groupChats')
      .doc(groupId)
      .collection('lastSeen')
      .doc(username)
      .set(chatObject, {
        merge: true,
      });

    return {
      isError: false,
      data: send,
    };
  } catch (error) {
    console.log({errorsendLastSeen: error});
    return {
      isError: true,
      error,
    };
  }
};

export const clearAllIndividualChats = async (username, otherUser) => {
  try {
    let response = await firestore()
      .collection('chats')
      .doc('individual')
      .collection(username)
      // .doc(otherUser)
      .get();
    console.log({response: response.docs});

    for (let i = 0; i < response.docs.length; i++) {
      const element = response.docs[i];
      console.log({element: element});
      if (
        !!element?.data()?.otherUser &&
        element?.data()?.otherUser == otherUser
      ) {
        let deleteRes = await firestore()
          .collection('chats')
          .doc('individual')
          .collection(username)
          .doc(element.id)
          .delete();
        console.log('deleting ...');
      }
    }

    // response.forEach(async element => {
    //   console.log({element: element.data()});
    //   if (
    //     !!element?.data()?.otherUser &&
    //     element?.data()?.otherUser == otherUser
    //   ) {
    //     let deleteRes = await firestore()
    //       .collection('chats')
    //       .doc('individual')
    //       .collection(username)
    //       .doc(element.id)
    //       .delete();
    //     console.log('deleting ...');
    //   }
    // });

    console.log('deleted');
    return {
      isError: false,
      data: response,
    };
  } catch (error) {
    console.log({errorInCLear: error});
    return {
      isError: true,
      error,
    };
  }
};

export const clearAllGroupChats = async (username, groupId) => {
  try {
    let response = await firestore()
      .collection('groupChats')
      .doc(groupId)
      // .doc(otherUser)
      .get();
    console.log({response: response?.data()});

    let responseObj = response?.data();
    let objToReturn = {};
    for (const id in responseObj) {
      console.log({id});
      if (responseObj[id].members.includes(username)) {
        console.log('includes');
        let newMemberArray = responseObj[id].members.filter(
          item => item != username,
        );
        objToReturn[id] = {
          ...objToReturn[id],
          members: newMemberArray,
        };
      }
    }
    if (!objToReturn || Object.keys(objToReturn).length == 0) {
      objToReturn = responseObj;
    }
    console.log({objToReturn});
    response = await firestore()
      .collection('groupChats')
      .doc(groupId)
      // .doc(otherUser)
      .set(objToReturn);

    console.log('deleted');
    return {
      isError: false,
      data: response,
    };
  } catch (error) {
    console.log({errorInCLear: error});
    return {
      isError: true,
      error,
    };
  }
};
