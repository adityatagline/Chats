import {createStore, combineReducers} from 'redux';
import todoReducer from './todo/TodoReducer';

const Stores = combineReducers({
  todo: todoReducer,
});

export default configureStore = createStore(Stores);
