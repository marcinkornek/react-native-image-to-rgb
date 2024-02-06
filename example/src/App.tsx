import * as React from 'react';

import { StyleSheet, View, Text, Button, Image, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { convertToRGB } from 'react-native-image-to-rgb';

type ImageRes = {
  uri: string;
  width: number;
  height: number;
};

export default function App() {
  const [uri, setUri] = React.useState<string | undefined>('');
  const [imageRes, setImageRes] = React.useState<ImageRes | undefined>(
    undefined
  );
  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [genTime, setGenTime] = React.useState<string | undefined>(undefined);
  const [inputVal, setInputVal] = React.useState<string | undefined>(
    'https://magazine.fbk.eu/wp-content/uploads/2018/03/annalisa_armani_100x100px.jpg'
  );

  React.useEffect(() => {
    if (uri) {
      Image.getSize(uri, (width, height) => {
        setImageRes({ uri: uri, width, height });
      });
    }
  }, [uri]);

  React.useEffect(() => {
    const convert = async () => {
      const uriString = uri as string;
      try {
        setResult(undefined);
        setGenTime(undefined);
        const handleStartTime = performance.now();
        const rgbArray = await convertToRGB(uriString);
        const detectionEndTime = performance.now(); // End timing after model detection
        const duration = detectionEndTime - handleStartTime; // Calculate the full duration
        setResult(rgbArray.length.toString());
        setGenTime(duration.toFixed(2).toString());
      } catch (e) {
        console.error('error', e);
      }
    };

    if (uri) convert();
  }, [uri]);

  const pickPhotoFromGallery = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    setUri(image?.assets?.[0]?.uri);
  };

  const usePhotoFromTextInput = () => {
    setUri(inputVal);
  };

  return (
    <View style={styles.container}>
      <Button title="Pick photo from gallery" onPress={pickPhotoFromGallery} />
      <TextInput
        placeholder="Photo uri"
        value={inputVal}
        style={styles.input}
        onChangeText={(text) => setInputVal(text)}
      />
      <Button title="use photo from form" onPress={usePhotoFromTextInput} />
      {uri ? <Image source={{ uri }} style={styles.box} /> : null}
      {imageRes ? (
        <Text>
          Image resolution: {imageRes.width}x{imageRes.height}
        </Text>
      ) : null}
      {uri && result ? <Text>Generated RGB array length: {result}</Text> : null}
      {uri && genTime ? <Text>Generated in: {genTime}ms</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 20,
  },
});
