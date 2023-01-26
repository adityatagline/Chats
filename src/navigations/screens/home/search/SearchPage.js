import {Text, StyleSheet, View, StatusBar, NativeModules} from 'react-native';

export default SearchPage = ({isLeft}) => {
  const StatusBarHeight = NativeModules.StatusBarManager.HEIGHT;
  return (
    <View style={[styles.mainDiv, {paddingTop: StatusBarHeight}]}>
      <Text>SearchPage</Text>
      git push -u origin main{' '}
    </View>
  );
};
const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: 'red',
    flex: 1,
  },
});
