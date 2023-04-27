import {createSlice} from '@reduxjs/toolkit';
import {newUserDetails} from '../../src/navigations/screens/authentication/ValidationSchemas';
const initialValues = {
  homepageChats: [],
  individualChats: {},
  friends: {},
  unseenChats: {},
  strangers: {},
  groups: {},
  groupChats: {},
};

const Chatslice = createSlice({
  name: 'chatSlice',
  initialState: {...initialValues},
  reducers: {
    storeMessage: (state, action) => {
      let {otherUser} = action.payload.receiverObject;
      let personChat = state.individualChats[otherUser];
      // let chatName = !!newState.friends[otherUser]
      // ? newState.friends[otherUser].contactName
      // : otherUser;
      // console.log({stored: {...action.payload.chatObject, otherUser}});
      if (!personChat) {
        personChat = [{...action.payload.chatObject, otherUser}];
      } else {
        personChat = [{...action.payload.chatObject, otherUser}, ...personChat];
      }
      let homepageChats = state.homepageChats;
      let objectToSet = {
        ...action.payload.chatObject,
        ...action.payload.receiverObject,
        chatName: !!state.friends[otherUser]
          ? state.friends[otherUser].contactName
          : otherUser,
      };
      if (homepageChats.length == 0) {
        homepageChats = [{...objectToSet}];
      } else {
        let isIncluded = false;
        homepageChats.map((item, index) => {
          if (item.otherUser == otherUser) {
            isIncluded = true;
          }
        });

        if (isIncluded) {
          homepageChats = homepageChats.filter(
            item => item.otherUser != otherUser,
          );
        }
        homepageChats = [{...objectToSet}, ...homepageChats];
      }
      return {
        ...state,
        homepageChats: [...homepageChats],
        individualChats: !!state.individualChats
          ? {
              [otherUser]: [...personChat],
              ...state.individualChats,
            }
          : {[otherUser]: [...personChat]},
      };
    },
    storeFriends: (state, actions) => {
      // console.log({payload: actions.payload});
      let objectToSet = {};
      actions.payload.forEach(element => {
        objectToSet[element.username] = {...element};
      });
      return {
        ...state,
        friends: {
          ...objectToSet,
        },
      };
    },
    storeGroups: (state, action) => {
      let {groups} = action.payload;
      return {...state, groups};
    },
    updateGroup: (state, action) => {
      let {groupInfo} = action.payload;
      let newHomeArray = [...state.homepageChats];

      newHomeArray = newHomeArray.map(item => {
        if (!!item?.groupId && item.groupId == groupInfo.id) {
          console.log('found match', groupInfo.name);
          return {
            ...item,
            chatName: groupInfo.name,
          };
        } else {
          return item;
        }
      });

      return {
        ...state,
        groups: {
          ...state.groups,
          [groupInfo.id]: groupInfo,
        },
        homepageChats: newHomeArray,
      };
    },
    checkAndStoreNewMessages: (state, action) => {
      let messageArray = [...action.payload.messageArray].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      // console.log({messageArray});
      let newState = {...state};
      let {userInfo} = action.payload;

      messageArray.forEach(element => {
        let {otherUser} = element;
        // console.log({otherUser, element});

        let chatName = !!state.friends[otherUser]
          ? state.friends[otherUser].contactName
          : otherUser;
        // console.log({chatName});

        let itemFound = !!newState.individualChats[otherUser]
          ? newState.individualChats[otherUser].find(
              innerItem => innerItem.id == element.id,
            )
          : {};
        // console.log({itemFound});

        let isExistInIndividual =
          !!newState.individualChats[otherUser] &&
          !!itemFound &&
          Object.keys({...itemFound}).length != 0;

        itemFound = newState.homepageChats.find(
          innerItem => innerItem.id == element.id,
        );
        // console.log({itemFound});

        let isExistInHome =
          !!itemFound && Object.keys({...itemFound}).length != 0;
        // console.log({isExistInHome});

        itemFound = newState.homepageChats.find(
          innerItem => innerItem.otherUser == element.otherUser,
        );
        // console.log({itemFound});

        let isRecordExistInHome =
          !!itemFound && Object.keys({...itemFound}).length != 0;

        // console.log({element, userInfo});
        itemFound =
          // element.from != userInfo.username &&
          !!newState.unseenChats &&
          (!!newState.unseenChats[otherUser]
            ? !!newState.unseenChats[otherUser].find(
                unseenObj => unseenObj.id == element.id,
              )
            : false);

        let isExistinUnseenChats = !!itemFound;
        // console.log({isRecordExistInHome});
        // console.log({
        //   element,
        //   otherUser,
        //   chatName,
        //   isExistInIndividual,
        //   isExistInHome,
        //   isRecordExistInHome,
        //   friends: state.friends,
        //   unseenChats: newState.unseenChats,
        // });

        if (!isExistInIndividual) {
          // console.log({isExistInIndividual});
          let individualArray = state?.individualChats[otherUser] ?? [];
          individualArray = [{...element, chatName}, ...individualArray].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          newState = {
            ...newState,
            individualChats: {
              ...newState.individualChats,
              [otherUser]: individualArray,
            },
          };
        }
        if (!isExistInHome) {
          // console.log({isExistInHome, isRecordExistInHome});

          let newArrayForHome = [];
          if (!isRecordExistInHome) {
            newArrayForHome = [
              {...element, chatName},
              ...newState.homepageChats,
            ];
          } else {
            newArrayForHome = newState.homepageChats.filter(
              innerItem => innerItem.otherUser != element.otherUser,
            );
            newArrayForHome = [{...element, chatName}, ...newArrayForHome];
          }
          newArrayForHome = newArrayForHome.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          newState = {
            ...newState,
            homepageChats: [...newArrayForHome],
          };
        }
        if (!isExistinUnseenChats && element.from != userInfo.username) {
          let newUnseen = !!newState.unseenChats[otherUser]
            ? [{...element}, ...newState.unseenChats[otherUser]]
            : [{...element}];
          newUnseen = newUnseen.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          newState = {
            ...newState,
            unseenChats: {
              ...newState.unseenChats,
              [otherUser]: !!newState.unseenChats[otherUser]
                ? [{...element}, ...newState.unseenChats[otherUser]]
                : [{...element}],
            },
          };
        }
      });
      return {...newState};
    },
    storeMessageToGroup: (state, action) => {
      // console.log({state});
      try {
        let newState = {...state};
        let {message, groupInfo, userInfo} = action.payload;
        if (!state?.groups?.[groupInfo?.id]) {
          newState = {
            ...newState,
            groups: {
              ...newState.groups,
              [groupInfo.id]: groupInfo,
            },
          };
        }
        if (!newState?.groups?.[message.groupId]?.name) {
          return newState;
        }
        let isInclude =
          !!newState?.individualChats[message.groupId] &&
          newState.individualChats[message.groupId].find(
            item => item.id == message.id,
          );
        isInclude = !!isInclude && Object.keys(isInclude).length != 0;
        if (!!isInclude) {
          return newState;
        }
        let individualArray = newState?.individualChats[message.groupId] ?? [];
        individualArray = [{...message}, ...individualArray];
        individualArray = individualArray.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        let isIncludeInHome = newState?.homepageChats?.find(
          item => item.id == message.id,
        );
        isIncludeInHome =
          !!isIncludeInHome && Object.keys(isIncludeInHome).length != 0;
        let isRecordInHome = newState?.homepageChats.find(
          item => item.groupId == message.groupId,
        );
        isRecordInHome =
          !!isRecordInHome && Object.keys(isRecordInHome).length != 0;

        let homechatArray = [...newState.homepageChats];
        if (isRecordInHome) {
          homechatArray = homechatArray.filter(item => {
            if (
              !item?.groupId ||
              (!!item?.groupId && item?.groupId != message.groupId)
            ) {
              return item;
            }
          });
        }
        let lastMessage = individualArray.reverse()[0];
        homechatArray = [
          ...homechatArray,
          {...lastMessage, chatName: groupInfo.name},
        ];
        homechatArray = homechatArray.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        let isGroupExists =
          !!newState?.groups?.[message.groupId] &&
          Object.keys(newState.groups[message.groupId]).length != 0;
        // console.log({individualArray});
        if (!isGroupExists) {
          newState = {
            ...newState,
            groups: {
              ...newState.groups,
              [message.groupId]: {...groupInfo},
            },
          };
        }
        let isIncludedInUnseen =
          !!state?.unseenChats?.[message.groupId] &&
          state?.unseenChats?.[message.groupId].find(
            item => item.id == message.id,
          );
        isIncludedInUnseen =
          !!isIncludedInUnseen && Object.keys(isIncludedInUnseen).length != 0;
        let unseenChatArray = state?.unseenChats[message.groupId] ?? [];
        if (!isIncludedInUnseen && message.from != userInfo.username) {
          unseenChatArray = [...unseenChatArray, {...message}];
          unseenChatArray = unseenChatArray.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
        }
        // console.log({
        //   isInclude,
        //   isIncludeInHome,
        //   isRecordInHome,
        //   isGroupExists,
        //   isIncludedInUnseen,
        //   message,
        //   userInfo,
        // });
        newState = {
          ...newState,
          individualChats: {
            ...newState.individualChats,
            [message.groupId]: individualArray,
          },
          homepageChats: homechatArray,
          unseenChats: {
            ...state.unseenChats,
            [message.groupId]: unseenChatArray,
          },
        };
        return newState;
      } catch (error) {
        console.log({errorInRed: error, state, actionP: action.payload});
        return state;
      }
    },
    storeStranger: (state, action) => {
      // console.log('running storeStranger');
      const {userInfo} = action.payload;
      // console.log({infoInRed: userInfo});
      if (!!state.strangers[userInfo.username]) {
        return {...state};
      } else {
        return {
          ...state,
          strangers:
            Object.keys(state.strangers).length == 0
              ? {
                  [userInfo.username]: {...userInfo},
                }
              : {...state.strangers, [userInfo.username]: {...userInfo}},
        };
      }
    },
    changeMediaStatus: (state, action) => {
      // console.log({changeMediaStatus: action});
      let {downloadObj, chatObj} = action.payload;
      downloadObj = downloadObj.data;
      // console.log({downloadObj});
      let newArrayToSet = [...state.individualChats[chatObj.otherUser]].map(
        item => {
          if (item.id == chatObj.id) {
            return {
              ...item,
              uri: 'file:///' + downloadObj.path,
              isDownloaded: true,
            };
          } else {
            return {...item};
          }
        },
      );
      return {
        ...state,
        individualChats: {
          ...state.individualChats,
          [chatObj.otherUser]: [...newArrayToSet],
        },
      };
    },
    removeUnseenChats: (state, action) => {
      const {username, chatArray} = action.payload;
      let newState = {...state};
      let newArray = [];
      chatArray.forEach(element => {
        let isInclude = newState?.unseenChats?.[username]?.find(
          item => item.id == element.id,
        );
        isInclude = !!isInclude && Object.keys(isInclude).length != 0;
        if (!isInclude) {
          newArray.push(element);
        }
      });
      newState = {
        ...newState,
        unseenChats: {
          ...newState.unseenChats,
          [username]: newArray,
        },
      };
      return newState;
    },
    clearAllChats: (state, action) => {
      return {
        ...initialValues,
      };
    },
    addInGpChat: (state, action) => {
      const {groupId} = action.payload;
      let newState = {...state};
      let unseenChats = !!newState?.unseenChats?.[groupId]
        ? newState?.unseenChats?.[groupId]
        : [];
      let newGP = !!newState?.groupChats?.[groupId]
        ? newState?.groupChats?.[groupId]
        : [];

      unseenChats.forEach(element => {
        let isInGPChat = newState?.groupChats?.[groupId]?.find(
          obj => obj.id == element.id,
        );
        isInGPChat = !!isInGPChat && Object.keys(isInGPChat).length != 0;
        if (!isInGPChat) {
          newGP.push(element);
        }
      });

      newState = {
        ...newState,
        groupChats: {
          ...newState.groupChats,
          [groupId]: newGP,
        },
      };

      return newState;
    },
    clearUserChat: (state, action) => {
      let newState = {...state};
      const {username} = action.payload;
      let {[username]: removeUser, ...otherChats} = newState.individualChats;
      console.log({
        username,
        removeUser,
      });
      let newHomeArray = newState?.homepageChats;
      newHomeArray = newHomeArray.filter(item => {
        if (!!item?.otherUser && item.otherUser == username) {
          return {...item, message: ''};
        } else if (!!item?.groupId && item.groupId == username) {
          return {...item, message: ''};
        } else {
          return item;
        }
      });
      return {
        ...newState,
        individualChats: otherChats,
        homepageChats: newHomeArray,
      };
    },
    // clearUserChat: (state, action) => {
    //   let newState = {...state};
    //   const {username} = action.payload;
    //   let {[username]: removeUser, ...otherChats} = newState.individualChats;
    //   console.log({
    //     username,
    //     removeUser,
    //   });
    //   let newHomeArray = newState?.homepageChats;
    //   newHomeArray = newHomeArray.filter(item => {
    //     if (!!item?.otherUser && item.otherUser != username) {
    //       return item;
    //     } else if (!!item?.groupId && item.groupId != username) {
    //       return item;
    //     }
    //   });
    //   return {
    //     ...newState,
    //     individualChats: otherChats,
    //     homepageChats: newHomeArray,
    //   };
    // },
  },
});

export const {
  storeMessage,
  storeFriends,
  clearAllChats,
  checkAndStoreNewMessages,
  removeUnseenChats,
  storeStranger,
  changeMediaStatus,
  storeMessageToGroup,
  storeGroups,
  updateGroup,
  addInGpChat,
  clearUserChat,
  // clearGroupChat
} = Chatslice.actions;
export default Chatslice.reducer;
