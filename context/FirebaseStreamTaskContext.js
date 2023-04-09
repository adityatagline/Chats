import {useState} from 'react';
import {createContext} from 'react';
import storage from '@react-native-firebase/storage';

export const FirebaseStreamTaskContext = createContext({
  tasks: {},
  addTask: task => {},
  updateTask: async (task, stateDetails, senderFun) => {},
});

export const FirebaseStreamTaskContextProvider = ({children}) => {
  const [tasks, setTasks] = useState({});

  const addTask = taskObj => {
    console.log({taskObj});
    if (tasks.length == 0) {
      setTasks([{task: taskObj}]);
    } else {
      let obj = tasks.find(item => {
        if (item._id == taskObj._id) {
          return item;
        }
      });
      if (!obj || Object.keys(obj).length == 0) {
        setTasks([...tasks, {task: taskObj}]);
      }
    }
  };

  const updateTask = async (taskObj, stateDetails, senderFunction, itemObj) => {
    console.log({id: stateDetails.task._id, taskid: taskObj._id});
    let newArrayToSet = tasks[itemObj.otherUser].map(item => {
      if (item.task._id == stateDetails.task._id) {
        return {task: item.task, stateDetails};
      } else {
        return item;
      }
    });
    setTasks(newArrayToSet);
    if (stateDetails.bytesTransferred == stateDetails.totalBytes) {
      // mediaObj, type
      const downloadurl = await storage()
        .ref(stateDetails.metadata.fullPath)
        .getDownloadURL();
      //   await senderFunction();
    }
  };

  const contextValues = {
    tasks,
    addTask,
    updateTask,
  };
  return (
    <FirebaseStreamTaskContext.Provider value={contextValues}>
      {children}
    </FirebaseStreamTaskContext.Provider>
  );
};
