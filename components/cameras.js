import React, {useRef, useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

import TextRecognition from 'react-native-text-recognition';
import Tts from 'react-native-tts';

import Tflite from 'tflite-react-native';
const tflite = new Tflite();

import RNFS from 'react-native-fs';

import Sound from 'react-native-sound';
import {presets} from '../babel.config';

import TextContext from '../context/globalState';
//import TesseractOcr, {LANG_ENGLISH} from 'react-native-tesseract-ocr';

const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'camera', title: 'Take a Photo'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const CameraScreen = () => {
  const {text} = useContext(TextContext);
  const [img, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const takePicture = async () => {
    setImage('');
    const options = {quality: 0.5, base64: true};
    const data = await cameraRef.current.takePictureAsync(options);
    if (text == 'ገንዘብ ማወቂያ') {
      predictMoney(data.uri);
    } else if (text == 'እንግሊዘኛ ማንበቢያ') {
      readEnglish(data.uri);
    }
  };

  const predictMoney = async image => {
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
                //console.log(label);
                //setResult(label[1]);
                playSound(label[1]);
              }
            },
          );
        }
      },
    );
  };

  const readEnglish = async image => {
    const tessOptions = {};
    const result = TesseractOcr.recognize(image, LANG_ENGLISH, tessOptions);
    console.log(result);
    //const response = await TextRecognition.recognize(image);
    //Tts.speak(response.join());
  };

  const FillCard = async image => {
    setLoading(true);
    console.log('calling card');
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpg',
      name: 'image.jpg',
    });
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post(
      'https://blen-5t0a.onrender.com/hello',
      formData,
      config,
    );

    console.log(response);

    const imm = await axios.get('https://blen-5t0a.onrender.com/boom');
    setImage('image');
    setLoading(false);
  };

  const choosePicture = async () => {
    setImage('');
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (text == 'ገንዘብ ማወቂያ') {
          predictMoney(response.assets[0].uri);
        } else if (text == 'እንግሊዘኛ ማንበቢያ') {
          readEnglish(response.assets[0].uri);
        } else if (text == 'ካርድ መሙያ') {
          FillCard(response.assets[0].uri);
        }
      }
    });
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
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        </RNCamera>
      </TouchableOpacity>
      <TouchableOpacity onPress={choosePicture}>
        <Text>choose </Text>
        {loading && <ActivityIndicator />}
      </TouchableOpacity>
      {img && (
        <Image
          style={styles.tinyLogo}
          source={{
            uri: `https://blen-5t0a.onrender.com/boom?time=${new Date()}`,
          }}
          key={img}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 50,
  },
  tinyLogo: {
    width: 370,
    height: 40,
    marginLeft: 7,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default CameraScreen;
