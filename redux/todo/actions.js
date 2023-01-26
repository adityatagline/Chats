import {todoActionTypes} from './TodoReducer';

export const addReminderToStore = reminder => {
  return {
    type: todoActionTypes.ADD_REMINDER,
    payload: {...reminder},
  };
};

export const editReminderToStore = reminder => {
  return {
    type: todoActionTypes.EDIT_REMINDER,
    payload: {...reminder},
  };
};

export const removeReminderToStore = id => {
  return {
    type: todoActionTypes.REMOVE_REMINDER,
    payload: id,
  };
};
