import RNFetchBlob from 'rn-fetch-blob';
import {databaseLinks} from '../../credentials/firebaseCredentials/FirebaseDatabaseLinks';
import {apiRequest} from '../global/BaseApiRequestes';
import {deleteFromFBStorage, sendGPMessageToFB} from './firebaseSdkRequests';

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
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials.json`;
    let allUsers = await apiRequest(url, 'GET');
    allUsers = allUsers.data;
    let usersArray = [];
    for (const number in allUsers) {
      usersArray.push(number);
    }
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
        if (!usersArray.includes(phonenumber)) {
          continue;
        }
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
          // console.log({response2});
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

export const updateGPProfilePhotoInDB = async (groupId, newProfileObj) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}/profilePhotoObject.json`;
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

export const getStrangerInfoFromDB = async (
  starngerUsername,
  isCurrentUser = false,
) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${starngerUsername}.json`;
    let response = await apiRequest(url, 'GET');
    // console.log({url, response});
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
      phone: response?.data?.phone,
    };
    return {
      isError: false,
      data: isCurrentUser
        ? {...response.data, username: starngerUsername}
        : dataToReturn,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const downloadMediaToDevice = async (item, handleDownload) => {
  try {
    let dirs = RNFetchBlob.fs.dirs;
    const path =
      dirs.DownloadDir +
      `/chats/media/${item.otherUser}/${item.mediaType}/${item.mediaName}`;
    RNFetchBlob.config({
      IOSBackgroundTask: true,
      addAndroidDownloads: {
        path,
        notification: true,
        useDownloadManager: true,
      },
    })
      .fetch('GET', item.uri)
      .then(Response => {
        // console.log({Response, path: Response.path()});
        // handleDownload(
        //   {
        //     isError: false,
        //     data: {
        //       path: Response.path(),
        //       data: Response.data,
        //     },
        //   },
        //   item,
        // );
      });
  } catch (error) {
    handleDownload(
      {
        isError: true,
        error,
      },
      item,
    );
  }
};

export const createNewGroupInDB = async (
  memberArray,
  groupName,
  currentUser,
  isFirst,
) => {
  try {
    let randomGroupId =
      groupName + 'id' + Math.floor(Math.random() * 66666666666);
    let url = `${
      databaseLinks.REALTIME_DATBASE_ROOT
    }groups/${randomGroupId.toString()}.json`;
    let groupObj = {
      name: groupName,
      id: randomGroupId,
      members: memberArray,
      admins: [currentUser.username],
    };
    let response = await apiRequest(url, 'PUT', groupObj);
    if (!!response.isError) {
      return response;
    }
    // console.log({response});

    for (let i = 0; i < memberArray.length; i++) {
      let member = memberArray[i];
      url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${member}/groups.json`;
      let memberGroups = await apiRequest(url, 'GET');
      let newArrayToSet = [];
      // console.log({memberGroups});

      if (!!memberGroups.isError && memberGroups.error == 'noData') {
        newArrayToSet = [randomGroupId];
      } else if (!!memberGroups.isError && memberGroups.error != 'noData') {
        response = memberGroups;
        return;
      } else {
        newArrayToSet = [...memberGroups.data, randomGroupId];
      }
      let setGroups = await apiRequest(url, 'PUT', newArrayToSet);
      response = setGroups;
      // console.log({setGroups});
      if (!!setGroups.isError) {
        return;
      }
    }
    let objToGenID =
      currentUser.username +
        randomGroupId +
        `"${currentUser.username}" created this group`.length >
      10
        ? `"${currentUser.username}" created this group`.slice(0, 10)
        : `"${currentUser.username}" created this group` +
          new Date().toString();

    let msgid = objToGenID.toString();
    let initMsg = {
      message: `"${currentUser.username}" created this group`,
      messageType: 'announcement',
      from: randomGroupId,
      date: new Date().toString(),
      groupId: randomGroupId,
      id: msgid,
    };
    let sendInitialMessage = await sendGPMessageToFB(
      randomGroupId,
      initMsg,
      isFirst,
    );
    // console.log({sendInitialMessage});

    response = {...sendInitialMessage, message: initMsg, groupInfo: groupObj};
    return response;
  } catch (error) {
    // console.log({error});
    return {
      isError: true,
      error,
    };
  }
};

export const getGroupsOfUser = async username => {
  try {
    let objToReturn = {};
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/groups.json`;
    let userGroups = await apiRequest(url, 'GET');

    if (!!userGroups.isError) {
      return userGroups;
    }
    for (let i = 0; i < userGroups.data.length; i++) {
      let groupUsers = {};
      const groupid = userGroups.data[i];
      url = `${databaseLinks.REALTIME_DATBASE_ROOT}groups/${groupid}.json`;
      let groupData = await apiRequest(url, 'GET');
      // console.log({groupData, url});
      if (groupData.isError) {
        return groupData;
      }
      for (let j = 0; j < groupData.data.members.length; j++) {
        const username = groupData.data.members[j];
        url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
        let userDetails = await apiRequest(url, 'GET');
        if (userDetails.isError) {
          return userDetails;
        }
        if (!groupUsers[username]) {
          groupUsers[username] = {
            firstName: userDetails.data.firstName,
            username,
            phone: userDetails.data.phone,
          };
        }
      }
      objToReturn[groupid] = {
        ...groupData.data,
        members: groupUsers,
      };
    }
    // console.log({objToReturn});
    return {
      isError: false,
      data: objToReturn,
    };
  } catch (error) {
    // console.log('try catch error', error);
    return {
      isError: true,
      error,
    };
  }
};

export const getGroupInfo = async groupId => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;
    let response = await apiRequest(url, 'GET');
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const checkIsMember = async (username, groupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/groups.json`;
    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    // console.log({url, response, groupId});
    let isMember = response?.data?.includes(groupId);
    return {
      isError: false,
      data: {
        isMember,
        groups: response.data,
      },
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const makeAdmin = async (username, groupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    let newAdminArray = response.data?.admins;
    newAdminArray = [...newAdminArray, username];
    response = await apiRequest(url, 'PUT', {
      ...response.data,
      admins: newAdminArray,
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const removeAdmin = async (username, groupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    let newAdminArray = response.data?.admins;
    newAdminArray = newAdminArray.filter(item => item != username);
    response = await apiRequest(url, 'PUT', {
      ...response.data,
      admins: newAdminArray,
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const removeMember = async (username, groupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    let newAdminArray = response.data?.admins;
    newAdminArray = newAdminArray.filter(item => item != username);
    let newMemberArray = response.data?.members;
    newMemberArray = newMemberArray.filter(item => item != username);

    response = await apiRequest(url, 'PUT', {
      ...response.data,
      admins: newAdminArray,
      members: newMemberArray,
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const addMembers = async (memberArray, groupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    response = await apiRequest(url, 'PUT', {
      ...response.data,
      members: [...response.data.members, memberArray],
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const changeGroupName = async (groupId, newName) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }

    response = await apiRequest(url, 'PUT', {
      ...response.data,
      name: !!newName ? newName : response.data.name,
    });
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};
