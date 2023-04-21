import {useState} from 'react';
import {ActivityIndicator, Platform, View, Image, Animated} from 'react-native';

const ImageCompWithLoader = ({
  source,
  containerStyles,
  ImageStyles,
  ImageProps,
  loaderColor,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={containerStyles}>
      {isLoading && (
        <ActivityIndicator
          size={Platform.OS == 'android' ? 25 : 'small'}
          color={loaderColor}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            zIndex: -1000,
          }}
        />
      )}
      <Image
        source={source}
        style={ImageStyles}
        {...ImageProps}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
};

export default ImageCompWithLoader;
