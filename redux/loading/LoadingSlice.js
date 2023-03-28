import {createSlice} from '@reduxjs/toolkit';

const LoadingSlice = createSlice({
  name: 'LoadingSlice',
  initialState: {
    loading: true,
    waitingMessage: 'Please wait ...',
  },
  reducers: {
    setLoadingState: (state, action) => {
      // console.log({state, action});
      return {
        loading: action.payload.loading,
        waitingMessage: !!action.payload.waitingMessage
          ? action.payload.waitingMessage
          : 'Please wait ...',
      };
    },
  },
});

export const {setLoadingState} = LoadingSlice.actions;
export default LoadingSlice.reducer;
