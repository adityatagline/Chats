import {createSlice} from '@reduxjs/toolkit';

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
  },
  reducers: {},
});

export default Chatslice.reducer;
