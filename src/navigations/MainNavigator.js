import {Provider} from 'react-redux';
import Store from '../../redux/Store';
import StackNavigator from './StackNavigator';

export default MainNavigator = () => {
  return (
    <Provider store={Store}>
      <StackNavigator />
    </Provider>
  );
};
