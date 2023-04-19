import {useState} from 'react';
import {createContext} from 'react';
import storage from '@react-native-firebase/storage';

export const FirebaseStreamTaskContext = createContext({
  tasks: {},
  addTask: task => {},
  updateTask: async (task, stateDetails, senderFun) => {},
  deleteTask: async (taskId, username) => {},
});

var hardTask = {};

export const FirebaseStreamTaskContextProvider = ({children}) => {
  const [tasks, setTasks] = useState(hardTask);
  console.log({tasks});

  const addTask = (task, username, fileObject) => {
    console.log('running add');
    let taskId = task._id;
    if (!hardTask[username] || hardTask[username].length == 0) {
      hardTask = {
        ...hardTask,
        [username]: [{taskId, fileObject, task}],
      };
    } else {
      let taskArray = hardTask[username];
      let isExists = taskArray.find(item => item.taskId == taskId);
      isExists = !!isExists && Object.keys(isExists).length != 0;
      if (!isExists) {
        hardTask = {
          ...hardTask,
          [username]: [...taskArray, {taskId, task, fileObject}],
        };
      }
    }
    setTasks({...hardTask});
  };

  const updateTask = async (taskId, username, stateDetails) => {
    console.log('running updateTask');

    try {
      // let taskId = task._id;
      let taskArray = hardTask[username];
      taskArray = taskArray.map(item => {
        if (item.taskId == taskId) {
          return {...item, stateDetails};
        } else {
          return item;
        }
      });
      console.log({taskArray});
      hardTask = {
        ...hardTask,
        [username]: taskArray,
      };
      setTasks({...hardTask});
    } catch (error) {
      console.log({eroorInYpdateTask: error});
    }
  };

  const deleteTask = async (taskId, username) => {
    console.log('running deleteTask');
    // let taskId = task._id;

    let taskArray = hardTask?.[username];
    if (!taskArray || taskArray.length == 0) {
      return;
    }
    let taskFound = taskArray.find(item => item.taskId == taskId);
    let isInclude = !!taskFound && Object.keys(taskFound).length != 0;
    if (!!isInclude && !!taskArray) {
      taskArray = taskArray.filter(item => item.taskId != taskId);
      hardTask = {
        ...hardTask,
        [username]: taskArray,
      };
      setTasks({...hardTask});
      return true;
    }
    return false;
  };

  const contextValues = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
  return (
    <FirebaseStreamTaskContext.Provider value={contextValues}>
      {children}
    </FirebaseStreamTaskContext.Provider>
  );
};
