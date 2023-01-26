import {Text, StyleSheet, View, StatusBar, Dimensions} from 'react-native';
import {colorStrings} from '../../strings/ColorStrings';

const dimension = Dimensions.get('screen');
export default CircleBackground = () => {
  return (
    <View style={[styles.mainDiv]}>
      <View style={styles.chatBox1}></View>
      <View style={[styles.chatBox1, styles.chatBox2]}></View>
      <View style={[styles.chatBox1, styles.chatBox3]}></View>
      <View style={styles.dummyBack}>
        <View style={styles.back1}></View>
        <View style={[styles.back1, styles.back2]}></View>
        <View style={[styles.back1, styles.back3]}></View>
      </View>
      {/* <View style={styles.triangle1}></View> */}
      <StatusBar
        backgroundColor={'transparent'}
        barStyle="dark-content"
        translucent={true}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainDiv: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: -70,
  },
  chatBox1: {
    backgroundColor: colorStrings.onboardingBackgroundColor1,
    height: dimension.height * 0.68,
    width: dimension.width,
    borderBottomRightRadius: 150,
    // top: -dimension.height * 0.22,
    // borderTopRightRadius: 150,
    position: 'absolute',
  },
  chatBox2: {
    backgroundColor: colorStrings.onboardingBackgroundColor2,
    // backgroundColor: 'red',
    top: dimension.height * 0.03,
    zIndex: -50,
  },
  chatBox3: {
    backgroundColor: colorStrings.lightThemeAppThemeColor,
    // backgroundColor: 'yellow',
    top: dimension.height * 0.06,
    zIndex: -70,
  },
  dummyBack: {
    backgroundColor: 'red',
    backgroundColor: colorStrings.onboardingBackgroundColor1,
    position: 'absolute',
    height: dimension.height * 0.25,
    width: dimension.width * 0.66,
    top: dimension.height * 0.68,
    left: 0,
    zIndex: -40,
  },
  back1: {
    backgroundColor: colorStrings.onboardingBackgroundColor2,
    // backgroundColor: 'yellow',
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 150,
    // borderTopRightRadius: 150,
    position: 'absolute',
  },
  back2: {
    backgroundColor: colorStrings.lightThemeAppThemeColor,
    top: dimension.height * 0.03,
  },
  back3: {
    backgroundColor: 'white',
    top: dimension.height * 0.06,
  },
});
