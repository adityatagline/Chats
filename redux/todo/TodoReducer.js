export const todoActionTypes = {
  ADD_REMINDER: 'ADD',
  EDIT_REMINDER: 'EDIT',
  REMOVE_REMINDER: 'REMOVE',
};

export const initialTodos = {
  reminders: [
    {
      id: 1,
      reminder: 'coffee',
    },
    {
      id: 2,
      reminder: 'coffee for him',
    },
    {
      id: 3,
      reminder: 'tea',
    },
    {
      id: 4,
      reminder: 'tea and toast',
    },
  ],
};

export default StoreReducer = (state = {...initialTodos}, action) => {
  console.log(state, action);
  let arrayToReturn;
  switch (action.type) {
    case todoActionTypes.ADD_REMINDER:
      console.log('adding');
      return {
        ...state,
        reminders: [{...action.payload}, ...state.reminders],
      };
    case todoActionTypes.EDIT_REMINDER:
      arrayToReturn = state.reminders.map(item => {
        if (item.id == action.payload.id) {
          return {...item, reminder: action.payload.reminder};
        } else {
          return {...item};
        }
      });
      return {
        ...state,
        reminders: [...arrayToReturn],
      };

    case todoActionTypes.REMOVE_REMINDER:
      arrayToReturn = state.reminders.filter(
        item => item.id != action.payload.id,
      );
      return {
        ...state,
        reminders: [...arrayToReturn],
      };

    default:
      return {...state};
  }
};
