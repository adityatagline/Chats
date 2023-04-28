import {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  View,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import ImageView from 'react-native-image-viewing';

const ImageCompWithLoader = ({
  source,
  containerStyles,
  ImageStyles,
  ImageProps,
  loaderColor,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showImage, setShowImage] = useState();

  return (
    <>
      <ImageView
        images={[showImage]}
        visible={!!showImage}
        onRequestClose={() => setShowImage()}
      />
      <TouchableOpacity
        style={containerStyles}
        onPress={() => setShowImage(source)}>
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
              zIndex: 1000,
            }}
          />
        )}
        <Image
          source={source}
          style={ImageStyles}
          {...ImageProps}
          onLoadEnd={() => setIsLoading(false)}
        />
      </TouchableOpacity>
    </>
  );
};

export default ImageCompWithLoader;
