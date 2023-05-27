import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
//import {RNCamera} from 'react-native-camera';

import * as ImagePicker from 'react-native-image-picker';
import Sound from 'react-native-sound';

import Tflite from 'tflite-react-native';
const tflite = new Tflite();

const styles = StyleSheet.create({
  ImageSize: {
    width: 300,
    height: 300,
  },
});

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'camera', title: 'Take a Photo'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const MoneyRecognitionComponent = () => {
  const [result, setResult] = useState('');
  const [picture, setPicture] = useState();

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

  const choosePicture = async () => {
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        predict(response.assets[0].uri);
        setPicture(source);
      }
    });
  };

  const takePicture = () => {
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        predict(response.assets[0].uri);
        setPicture(source);
      }
    });
  };

  return (
    <View style={{borderWidth: 4, borderColor: 'red'}}>
      {result !== '' && <Text>{result} birr</Text>}

      <View>
        <TouchableOpacity onPress={takePicture}>
          <Text>Take Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={choosePicture}>
        <Text>Choose Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoneyRecognitionComponent;
