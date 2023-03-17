import {createSlice} from '@reduxjs/toolkit';
import {act} from 'react-test-renderer';
import {isTemplateLiteralTypeNode} from 'typescript';
import {getUsernameFromEmail} from '../../src/components/CommonFunctions';

const Chatslice = createSlice({
  name: 'chatSlice',
  initialState: {
    aliasNames: {
      ['yash-dhola-tagline--gmail-com']: 'yashdholacollage and',
      ['kevin-tagline--gmail-com']: 'kevin solanki clg',
    },
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
  },
  reducers: {
    storeMessage: (state, action) => {
      console.log({state, action});
      let {username, chatName} = action.payload.receiverObject;
      let personChat = state.individualChats[username];
      if (!personChat) {
        personChat = [{...action.payload.chatObject}];
      } else {
        personChat = [{...action.payload.chatObject}, ...personChat];
      }
      let homeScreenChats = state.homepageChats;
      console.log('running 1');
      let objectToSet = {
        ...action.payload.chatObject,
        ...action.payload.receiverObject,
      };
      if (homeScreenChats.length == 0) {
        homeScreenChats = [{...objectToSet}];
      } else {
        console.log('running 3');

        let isIncluded = false;
        homeScreenChats.map((item, index) => {
          if (item.username == username) {
            isIncluded = true;
          }
        });

        if (isIncluded) {
          homeScreenChats = homeScreenChats.filter(
            item => item.username != username,
          );
        }
        homeScreenChats = [{...objectToSet}, ...homeScreenChats];
      }
      return {
        ...state,
        homepageChats: [...homeScreenChats],
        individualChats: !!state.individualChats
          ? {
              ...state.individualChats,
              [username]: [...personChat],
            }
          : {[username]: [...personChat]},
      };
    },
    storeFriends: (state, actions) => {
      console.log({payload: actions.payload});
      let objectToSet = {};
      actions.payload.forEach(element => {
        let username = getUsernameFromEmail(element.email);
        objectToSet[username] = {...element, username};
      });
      return {
        ...state,
        friends: {
          ...objectToSet,
        },
      };
    },
  },
});

export const {storeMessage, storeFriends} = Chatslice.actions;
export default Chatslice.reducer;
