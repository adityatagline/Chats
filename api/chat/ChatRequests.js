import RNFetchBlob from 'rn-fetch-blob';
import {databaseLinks} from '../../credentials/firebaseCredentials/FirebaseDatabaseLinks';
import {apiRequest} from '../global/BaseApiRequestes';
import {deleteFromFBStorage} from './firebaseSdkRequests';

export const getUserHomepageChats = async username => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/userHomepageChats/${username}.json`;
    const response = await apiRequest(url, 'GET');
    if (response.isError) {
      return {
        isError: true,
        error: response.error,
      };
    }
    return {
      isError: false,
      response: response.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const checkForUserInRecord = async (contactArray, currentUserName) => {
  // console.log('runnin');
  let contactArrayToReturn = [];
  // console.log({contactArray});
  try {
    for (let i = 0; i < contactArray.length; i++) {
      let phonenumbers = contactArray[i].phoneNumbers;
      let contact = contactArray[i];

      if (!phonenumbers) {
        continue;
      }

      for (let j = 0; j < phonenumbers.length; j++) {
        let phonenumber = phonenumbers[j].number.replaceAll(' ', '');
        phonenumber = phonenumber.replaceAll('(', '');
        phonenumber = phonenumber.replaceAll(')', '');
        phonenumber = phonenumber.replaceAll('-', '');
        phonenumber = phonenumber.replaceAll('+', '');
        if (!phonenumber) {
          continue;
        }
        phonenumber = phonenumber.slice(
          phonenumber.length - 10,
          phonenumber.length,
        );
        let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${phonenumber}.json`;
        const response = await apiRequest(url, 'GET');

        // url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${response.data.username}/isNewUser.json`;
        // const response2 = await apiRequest(url, 'GET');
        // if (!response2.data) {

        if (response.isError && response.error !== 'noData') {
          return {
            isError: true,
            error: response.error,
          };
        }
        // console.log({friendsAtHome2: response.data, currentUserName});

        // }

        if (!response.isError && response.data.username != currentUserName) {
          // console.log({currentUserName});

          let username = response.data.username;
          // console.log({usernameInScan: username});
          url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
          const response2 = await apiRequest(url, 'GET');
          if (response2.isError && response2.error !== 'noData') {
            return {
              isError: true,
              error: response2.error,
            };
          }
          if (!response2.isError) {
            contactArrayToReturn.push({
              username,
              email: response2.data.email,
              firstName: response2.data.firstName,
              lastName: response2.data.lastName,
              phone: response2.data.phone,
              profilePhoto: !!response2?.data?.profilePhotoObject
                ? response2.data.profilePhotoObject.uri
                : '',
              contactName: `${
                !!contact.givenName ? contact.givenName : ' - '
              } ${
                !!contact.familyName
                  ? contact.familyName
                  : !!contact.givenName
                  ? ''
                  : ' - '
              }`,
            });
          }
        }
      }
    }

    return {
      isError: false,
      users: [...contactArrayToReturn],
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const sendMessgae = async (
  senderUserInfo,
  receiverUserInfo,
  chatObject,
) => {
  try {
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const updateProfilePhotoInDB = async (username, newProfileObj) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/profilePhotoObject.json`;
    const getOldDetails = await apiRequest(url, 'GET');
    let oldObject;
    if (getOldDetails.isError && getOldDetails.error != 'noData') {
      return {
        ...getOldDetails,
      };
    }
    if (!getOldDetails.isError) {
      oldObject = getOldDetails.data;
    }
    const updateResponse = await apiRequest(url, 'PUT', {
      ...newProfileObj,
    });
    if (!!oldObject && Object.keys(oldObject).length != 0) {
      let path = oldObject.path;
      const deleteOld = await deleteFromFBStorage(path);
      // console.log({deleteOld});
    }
    return updateResponse;
  } catch (error) {
    // console.log({errorOnupdateProfilePhotoInDB: error});
    return {
      isError: true,
      error,
    };
  }
};

export const getStrangerInfoFromDB = async starngerUsername => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${starngerUsername}.json`;
    let response = await apiRequest(url, 'GET');
    console.log({url, response});
    if (!!response.isError) {
      return {...response};
    }
    const {firstName, lastName} = response.data;
    let dataToReturn = {
      username: starngerUsername,
      firstName,
      lastName,
      profilePhoto: !!response?.data?.profilePhotoObject
        ? response.data.profilePhotoObject.uri
        : '',
    };
    return {
      isError: false,
      data: dataToReturn,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const downloadMediaToDevice = async item => {
  try {
    // let conf = {
    //   path: item.uri,
    // };
    const iOS = RNFetchBlob.ios;
    console.log('running donwloads', item);
    let dirs = RNFetchBlob.fs.dirs;
    const task = RNFetchBlob.config({
      path:
        dirs.DocumentDir +
        `/${item.otherUser}/${item.mediaType}/${item.mediaName}`,
      IOSBackgroundTask: true,
    })
      .fetch('GET', item.uri)
      .then(res => {
        console.log({downloadResponse: res});
        iOS.previewDocument(res.path());
      });
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};
