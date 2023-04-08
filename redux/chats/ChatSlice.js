import {createSlice} from '@reduxjs/toolkit';
import {newUserDetails} from '../../src/navigations/screens/authentication/ValidationSchemas';
const initialValues = {
  homepageChats: [],
  individualChats: {},
  friends: {},
  unseenChats: {},
  strangers: {},
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
    checkAndStoreNewMessages: (state, action) => {
      let messageArray = [...action.payload.messageArray].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      // console.log({messageArray});
      let newState = {...state};

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

        itemFound =
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

          newState = {
            ...newState,
            individualChats: {
              ...newState.individualChats,
              [otherUser]: !!newState.individualChats[otherUser]
                ? [
                    {...element, chatName},
                    ...newState.individualChats[otherUser],
                  ]
                : [{...element, chatName}],
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
          newState = {
            ...newState,
            homepageChats: [...newArrayForHome],
          };
        }
        if (!isExistinUnseenChats) {
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
    storeStranger: (state, action) => {
      console.log('running storeStranger');
      const {userInfo} = action.payload;
      console.log({infoInRed: userInfo});
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
    removeUnseenChats: (state, action) => {
      let newArrayToSet = [...state.unseenChats];
      newArrayToSet = newArrayToSet.filter(item =>
        action.payload.idArray.includes(item.id),
      );
      // console.log({newArrayToSet});
      return {
        ...state,
        unseenChats: [...newArrayToSet],
      };
    },
    clearAllChats: (state, action) => {
      return {
        ...initialValues,
      };
    },
  },
});

export const {
  storeMessage,
  storeFriends,
  clearAllChats,
  checkAndStoreNewMessages,
  removeUnseenChats,
  storeStranger,
} = Chatslice.actions;
export default Chatslice.reducer;
