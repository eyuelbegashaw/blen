import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';

import Tflite from 'tflite-react-native';
const tflite = new Tflite();

import Sound from 'react-native-sound';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [result, setResult] = useState('');

  const takePicture = async () => {
    const options = {quality: 0.5, base64: true};
    const data = await cameraRef.current.takePictureAsync(options);
    console.log(data.uri); // Access the captured image URI here
    predict(data.uri);
  };

  const predict = image => {
    tflite.loadModel(
      {
        model: 'model_unquant.tflite',
        labels: 'labels.txt',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('load', res);
          tflite.runModelOnImage(
            {
              path: image,
              imageMean: Platform.OS === 'android' ? 128 : 0,
              imageStd: Platform.OS === 'android' ? 128 : 1,
              numResults: 1,
              threshold: 0.05,
            },
            (error, response) => {
              if (err) {
                console.log(error);
              } else {
                const result = response[0];
                const label = result.label.split(' ');
                //const confidence = result.confidence;
                //const x = label.split(' ');
                console.log(label);
                setResult(label[1]);
                playSound(label[1]);
              }
            },
          );
        }
      },
    );
  };

  const playSound = birr => {
    let sound = '';
    if (birr == '5') {
      sound = 'five';
    } else if (birr == '10') {
      sound = 'ten';
    } else if (birr == '50') {
      sound = 'fifty';
    } else if (birr == '100') {
      sound = 'hundred';
    } else if (birr == '200') {
      sound = 'twohundred';
    }
    let whoosh = new Sound(`${sound}.mp3`, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      //loaded successfully
      console.log(
        'duration in seconds: ' +
          whoosh.getDuration() +
          'number of channels: ' +
          whoosh.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  return (
    <View style={{height: '90%'}}>
      <TouchableOpacity onPress={takePicture}>
        <RNCamera
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          ref={cameraRef}>
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        </RNCamera>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;
