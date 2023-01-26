import {memo} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Avatar from '../../../components/Avatar';
import HeadingLarge from '../../../components/HeadingLarge';
import {commonStyles, dimensions} from '../../../styles/commonStyles';

const StatusList = ({statusArray, nameColor, containerStyle}) => {
  const styles = StyleSheet.create({
    ...commonStyles,
    name: {
      color: nameColor,
      fontSize: 16,
    },
    statusDiv: {
      //   backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    listDiv: {
      height: dimensions.height * 0.15,
      alignItems: 'center',
      paddingHorizontal: 15,
    },
  });
  const renderStatus = ({item}) => (
    <View style={styles.statusDiv}>
      <Avatar source={item.avatar} haveBorder />
      <HeadingLarge text={item.name} style={[styles.suggestion, styles.name]} />
    </View>
  );
  return (
    <View style={[containerStyle]}>
      <FlatList
        horizontal
        renderItem={renderStatus}
        data={statusArray}
        keyExtractor={(item, index) => item.name + Math.random() * 60000}
        contentContainerStyle={styles.listDiv}
      />
    </View>
  );
};

export default memo(StatusList);
