import {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  NativeModules,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addReminderToStore,
  editReminderToStore,
  removeReminderToStore,
} from '../../../redux/todo/actions';

export default ToDoTasks = () => {
  const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
  const remindersInStore = useSelector(state => state.todo);
  const dispatch = useDispatch();

  const [reminder, setReminder] = useState('');
  const [editReminderID, setEditReminderID] = useState();

  const addTask = () => {
    dispatch(addReminderToStore({id: Math.random() * 100000, reminder}));
    setReminder();
  };

  const readyForEdit = reminder => {
    console.log('reminder');
    console.log(reminder);
    setReminder(reminder.reminder);
    setEditReminderID(reminder.id);
  };
  const editReminder = () => {
    dispatch(editReminderToStore({reminder, id: editReminderID}));
    setReminder();
    setEditReminderID();
  };
  const removeReminder = id => {
    dispatch(removeReminderToStore({id}));
    setReminder();
  };

  const ListComponent = ({reminder}) => (
    <View style={styles.listDiv}>
      <Text style={[styles.reminder, {flex: 1}]}>{reminder.reminder}</Text>
      <Button
        title="Edit"
        color={'darkslategray'}
        onPress={readyForEdit.bind(this, reminder)}
      />
      <Button
        title="Remove"
        color={'lightcoral'}
        onPress={removeReminder.bind(this, reminder.id)}
      />
    </View>
  );

  return (
    <View style={[styles.mainDiv, {paddingTop: StatusBarHeight}]}>
      <Text style={styles.heading}>Want to give me reminder ?</Text>
      <TextInput
        value={reminder}
        onChangeText={setReminder}
        style={[styles.reminder, styles.addBox]}
      />
      <Button
        title={!!editReminderID ? 'Done' : 'Add'}
        onPress={!!editReminderID ? editReminder : addTask}
      />
      {remindersInStore.reminders.length != 0 && (
        <FlatList
          data={remindersInStore.reminders}
          renderItem={({item}) => <ListComponent reminder={item} />}
        />
      )}
      <StatusBar
        backgroundColor={'white'}
        barStyle="dark-content"
        translucent={true}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 20,
  },
  heading: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  reminder: {
    backgroundColor: 'lightgray',
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 7,
    overflow: 'hidden',
    paddingHorizontal: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  addBox: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 2,
    marginVertical: 20,
  },
  listDiv: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
