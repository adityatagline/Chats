import firestore from '@react-native-firebase/firestore';

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
