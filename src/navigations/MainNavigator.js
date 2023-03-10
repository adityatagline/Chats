import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Store, {PersistStore} from '../../redux/Store';
import StackNavigator from './StackNavigator';

export default MainNavigator = () => {
  return (
    <Provider store={Store}>
      <PersistGate persistor={PersistStore} loading={null}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
};
