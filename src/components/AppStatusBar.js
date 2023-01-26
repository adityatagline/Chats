import {StatusBar} from 'react-native';

export const AppStatusBar = ({
  backgroundColor = 'transparent',
  barStyle,
  translucent = true,
  dark = false,
}) => {
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={!!barStyle ? barStyle : `${!dark ? 'dark' : 'light'}-content`}
      translucent={translucent}
    />
  );
};
