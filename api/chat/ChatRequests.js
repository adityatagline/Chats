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
              token: response2.data?.token,
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
    console.log({starngerUsername});
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
      token: response?.data?.token,
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
      members: memberArray,
    };
    let sendInitialMessage = await sendGPMessageToFB(
      randomGroupId,
      initMsg,
      isFirst,
    );
    // console.log({sendInitialMessage});
    let newMemberInfo = {};

    memberArray.forEach(async element => {
      let memberInfo = await getStrangerInfoFromDB(element);
      if (!memberInfo.isError) {
        newMemberInfo[element] = memberInfo.data;
      } else {
        newMemberInfo[element] = {username: element};
      }
    });

    response = {
      ...sendInitialMessage,
      message: initMsg,
      groupInfo: {
        ...groupObj,
        members: newMemberInfo,
        memberUsernames: memberArray,
      },
    };
    console.log({resposeCreateGP: response});
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
            token: userDetails.data?.token,
            profilePhoto: !!userDetails?.data?.profilePhotoObject
              ? userDetails.data.profilePhotoObject.uri
              : '',
          };
        }
      }
      objToReturn[groupid] = {
        ...groupData.data,
        members: groupUsers,
        memberUsernames: groupData.data.members,
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

export const makeAdmin = async (username, groupId, currentUser) => {
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
    if (!!response.isError) {
      return response;
    }
    let messageStr = `"${currentUser.username}" assigned Admin post to "${username}"`;
    let objToGenID =
      currentUser.username + groupId + messageStr.length > 10
        ? messageStr.slice(0, 10)
        : messageStr + new Date().toString();

    let msgid = objToGenID.toString();
    let initMsg = {
      message: messageStr,
      messageType: 'announcement',
      from: groupId,
      date: new Date().toString(),
      groupId: groupId,
      id: msgid,
      members: response.data.members,
    };
    let sendInitialMessage = await sendGPMessageToFB(groupId, initMsg, false);
    console.log({sendInitialMessage});

    response = {
      ...sendInitialMessage,
      gpResponse: response,
      message: initMsg,
    };
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const removeAdmin = async (username, groupId, currentUser) => {
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
    if (!!response.isError) {
      return response;
    }
    let messageStr = `"${currentUser.username}" removed "${username}" from Admin post`;
    let objToGenID =
      currentUser.username + groupId + messageStr.length > 10
        ? messageStr.slice(0, 10)
        : messageStr + new Date().toString();

    let msgid = objToGenID.toString();
    let initMsg = {
      message: messageStr,
      messageType: 'announcement',
      from: groupId,
      date: new Date().toString(),
      groupId: groupId,
      id: msgid,
      members: response.data.members,
    };
    let sendInitialMessage = await sendGPMessageToFB(groupId, initMsg, false);
    console.log({sendInitialMessage});

    response = {
      ...sendInitialMessage,
      gpResponse: response,
      message: initMsg,
    };
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const removeMember = async (username, groupId, currentUser) => {
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
    if (newAdminArray.length == 0) {
      newAdminArray = [newMemberArray[0]];
    }

    response = await apiRequest(url, 'PUT', {
      ...response.data,
      admins: newAdminArray,
      members: newMemberArray,
    });
    if (!!response.isError) {
      return response;
    }

    let messageStr =
      currentUser.username == username
        ? `"${username}" left the group.`
        : `"${currentUser.username}" removed "${username}" from this group`;
    let objToGenID =
      currentUser.username + groupId + messageStr.length > 10
        ? messageStr.slice(0, 10)
        : messageStr + new Date().toString();

    let msgid = objToGenID.toString();
    let initMsg = {
      message: messageStr,
      messageType: 'announcement',
      from: groupId,
      date: new Date().toString(),
      groupId: groupId,
      id: msgid,
      members: newMemberArray,
    };
    let sendInitialMessage = await sendGPMessageToFB(groupId, initMsg, false);
    // console.log({sendInitialMessage});

    response = {
      ...sendInitialMessage,
      gpResponse: response,
      message: initMsg,
    };

    return response;
  } catch (error) {
    console.log({errorInRemove: error});
    return {
      isError: true,
      error,
    };
  }
};

export const addMembers = async (memberArray, groupId, currentUser) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    let newMemberArray = [...response.data.members, ...memberArray];
    response = await apiRequest(url, 'PUT', {
      ...response.data,
      members: newMemberArray,
    });
    if (!response.isError) {
      memberArray.forEach(async member => {
        url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${member}.json`;
        response = await apiRequest(url, 'GET');
        if (!response.isError) {
          let groups = !!response?.data?.groups ? response?.data?.groups : [];
          groups.push(groupId);
          response = await apiRequest(url, 'PUT', {
            ...response.data,
            groups,
          });
          if (!response.isError) {
            let messageStr = `"${currentUser.username}" added "${member}" in this group`;
            let objToGenID =
              currentUser.username + groupId + messageStr.length > 10
                ? messageStr.slice(0, 10)
                : messageStr + new Date().toString();

            let msgid = objToGenID.toString();
            let initMsg = {
              message: messageStr,
              messageType: 'announcement',
              from: groupId,
              date: new Date().toString(),
              groupId: groupId,
              id: msgid,
              members: newMemberArray,
            };
            let sendInitialMessage = await sendGPMessageToFB(
              groupId,
              initMsg,
              false,
            );
            console.log({sendInitialMessage});

            response = {
              ...sendInitialMessage,
              gpResponse: response,
              message: initMsg,
            };
          } else {
            console.log({error6: response.error});
          }
        } else {
          console.log({error7: response.error});
        }
      });
    } else {
      console.log({error8: response.error});
    }
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const changeGroupName = async (groupId, newName, currentUser) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/groups/${groupId}.json`;

    let response = await apiRequest(url, 'GET');
    if (response.isError) {
      return response;
    }
    let oldName = response.data.name;
    response = await apiRequest(url, 'PUT', {
      ...response.data,
      name: !!newName ? newName : response.data.name,
    });
    if (response.isError) {
      return response;
    }
    let messageStr = `"${currentUser.username}" changed group name from "${oldName}" to "${newName}"`;
    let objToGenID =
      currentUser.username + groupId + messageStr.length > 10
        ? messageStr.slice(0, 10)
        : messageStr + new Date().toString();

    let msgid = objToGenID.toString();
    let initMsg = {
      message: messageStr,
      messageType: 'announcement',
      from: groupId,
      date: new Date().toString(),
      groupId: groupId,
      id: msgid,
      members: response.data.members,
    };
    let sendInitialMessage = await sendGPMessageToFB(groupId, initMsg, false);
    console.log({sendInitialMessage});

    response = {
      ...sendInitialMessage,
      gpResponse: response,
      message: initMsg,
    };
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const getAllBackups = async username => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/backups/${username}.json`;
    let response = await apiRequest(url, 'GET');
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const updateBackup = async (username, chatSliceRef) => {
  try {
    let chatString = JSON.stringify({
      individualChats: chatSliceRef.individualChats,
      homepageChats: chatSliceRef.homepageChats,
    });
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/backups/${username}.json`;
    let previous = await apiRequest(url, 'GET');
    let backupArr = {};
    if (!previous.isError || !!previous?.data) {
      backupArr = {...previous.data};
    }
    const dateStr = new Date().toString();
    backupArr[dateStr] = chatString;
    let response = await apiRequest(url, 'PUT', backupArr);

    return response;
  } catch (error) {
    console.log({errorupdateBackup: error});
    return {
      isError: true,
      error,
    };
  }
};

export const deleteBackupFromDB = async (username, backupId) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/backups/${username}/${backupId}.json`;
    let previous = await apiRequest(url, 'GET');
    if (!!previous.isError) {
      return previous;
    }
    let response = await apiRequest(url, 'DELETE');
    console.log({response});
    if (!!response.isError && response.error != 'noData') {
      return response;
    }
    return {
      isError: false,
      data: previous.data,
    };
  } catch (error) {
    console.log({errorupdateBackup: error});
    return {
      isError: true,
      error,
    };
  }
};

export const blockUsersInDB = async (username, userArray) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/blocked.json`;
    let previous = await apiRequest(url, 'GET');
    if (!!previous.isError && previous.error != 'noData') {
      return previous;
    }
    let array = !!previous?.data ? previous.data : [];
    array = array.filter(item => !userArray.includes(item));
    array = [...array, ...userArray];
    let response = await apiRequest(url, 'PUT', array);
    return response;
  } catch (error) {
    console.log({errorBlock: error});
    return {
      isError: true,
      error,
    };
  }
};

export const unBlockUsersInDB = async (username, otherUser) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/blocked.json`;
    let previous = await apiRequest(url, 'GET');
    if (!!previous.isError && previous.error != 'noData') {
      return previous;
    }
    let arrayToReturn = !!previous?.data ? previous.data : [];
    arrayToReturn = arrayToReturn.filter(item => item != otherUser);
    let response = await apiRequest(url, 'PUT', arrayToReturn);
    return response;
  } catch (error) {
    console.log({errorBlock: error});
    return {
      isError: true,
      error,
    };
  }
};
