import {createSlice} from '@reduxjs/toolkit';
const initialValues = {
  homepageChats: [
    // {
    //   message:
    //     'adjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjs',
    //   from: 'adityat-tagline--gmail-com',
    //   to: 'yash-dhola-tagline--gmail-com',
    //   time: '2023-02-05T05:26:24.160Z',
    // },
    // {
    //   message: 'adjajs',
    //   to: 'adityat-tagline--gmail-com',
    //   from: 'yash-dhola-tagline--gmail-com',
    //   time: '2023-02-09T05:26:24.160Z',
    // },
    // {
    //   message: 'adjiucjnNAJN;audjs',
    //   from: 'adityat-tagline--gmail-com',
    //   to: 'kevin-tagline--gmail-com',
    //   time: '2023-01-09T05:26:24.160Z',
    // },
    // {
    //   message: 'adjSHDLUhaduhIUNAJN;audjs',
    //   to: 'adityat-tagline--gmail-com',
    //   from: 'kevin-tagline--gmail-com',
    //   time: '2023-02-05T05:26:24.160Z',
    // },
    // {
    //   message: 'adjasdlahscbacjk jacbaAJN;audjs',
    //   from: 'adityat-tagline--gmail-com',
    //   to: 'yash-dhola-tagline--gmail-com',
    //   time: '2023-02-09T01:26:24.160Z',
    // },
    // {
    //   message:
    //     'adjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjs',
    //   to: 'adityat-tagline--gmail-com',
    //   from: 'yash-dhola-tagline--gmail-com',
    //   time: '2023-02-09T05:26:24.160Z',
    // },
    // {
    //   message:
    //     'adjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjs',
    //   from: 'adityat-tagline--gmail-com',
    //   to: 'kevin-tagline--gmail-com',
    //   time: '2023-02-09T05:26:24.160Z',
    // },
    // {
    //   message:
    //     'adjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjsadjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjs',
    //   to: 'adityat-tagline--gmail-com',
    //   from: 'kevin-tagline--gmail-com',
    //   time: '2023-02-09T05:26:24.160Z',
    // },
    // {
    //   message:
    //     'adjasdlahscbacjk jacbaiucjnacbihcAJSADIASHDLUhaduhIUNAJN;audjs',
    //   to: 'adityat-tagline--gmail-com',
    //   from: 'dhruvi-tagline--gmail-com',
    //   time: '2023-02-09T05:26:24.160Z',
    // },
  ],
  individualChats: {},
  friends: {},
  unseenChats: [],
};

const Chatslice = createSlice({
  name: 'chatSlice',
  initialState: {...initialValues},
  reducers: {
    storeMessage: (state, action) => {
      let {otherUser} = action.payload.receiverObject;
      let personChat = state.individualChats[otherUser];
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
      let newState = {...state};

      action.payload.messageArray.forEach(element => {
        let {otherUser} = element;
        console.log({otherUser});

        let chatName = !!newState.friends[otherUser]
          ? newState.friends[otherUser].contactName
          : otherUser;
        console.log({chatName});

        let itemFound = !!newState.individualChats[otherUser]
          ? newState.individualChats[otherUser].find(
              innerItem => innerItem.id == element.id,
            )
          : {};
        console.log({itemFound});

        let isExistInIndividual =
          !!newState.individualChats[otherUser] &&
          !!itemFound &&
          Object.keys({...itemFound}).length != 0;

        console.log({isExistInIndividual});

        itemFound = newState.homepageChats.find(
          innerItem => innerItem.id == element.id,
        );
        console.log({itemFound});

        let isExistInHome =
          !!itemFound && Object.keys({...itemFound}).length != 0;
        console.log({isExistInHome});

        itemFound = newState.homepageChats.find(
          innerItem => innerItem.otherUser == element.otherUser,
        );
        console.log({itemFound});

        let isRecordExistInHome =
          !!itemFound && Object.keys({...itemFound}).length != 0;
        console.log({isRecordExistInHome});

        if (!isExistInIndividual) {
          console.log({isExistInIndividual});

          newState = {
            ...newState,
            individualChats: {
              ...newState.individualChats,
              [otherUser]: !!newState.individualChats[otherUser]
                ? [{...element}, ...newState.individualChats[otherUser]]
                : [{...element}],
            },
          };
        }
        if (!isExistInHome) {
          console.log({isExistInHome, isRecordExistInHome});

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
      });
      return {...newState};
    },
    removeUnseenChats: (state, action) => {
      let newArrayToSet = [...state.unseenChats];
      newArrayToSet = newArrayToSet.filter(item => item != action.payload);
      return {
        ...state,
        unseenChats: [...newArrayToSet],
      };
    },
    clearAllChats: (state, actions) => {
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
} = Chatslice.actions;
export default Chatslice.reducer;
