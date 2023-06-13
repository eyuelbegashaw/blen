import {useState, useEffect, useContext} from 'react';
import Sound from 'react-native-sound';
import {TouchableOpacity, Text} from 'react-native';
import TextContext from '../context/globalState';

const Navigation = () => {
  const {text, setText} = useContext(TextContext);
  const [pointer, setPointer] = useState(0);

  const [labels] = useState([
    'ገንዘብ ማወቂያ',
    'ካርድ መሙያ',
    'አማርኛ ማንበቢያ',
    'እንግሊዘኛ ማንበቢያ',
  ]);

  useEffect(() => {
    playSound();
  }, []);

  useEffect(() => {
    playSound();
  }, [text]);

  const changeText = () => {
    if (pointer === 3) {
      setText(labels[0]);
      setPointer(0);
    } else {
      setText(labels[pointer + 1]);
      setPointer(pointer + 1);
    }
  };

  const playSound = () => {
    let sound = '';
    if (text == 'ገንዘብ ማወቂያ') {
      sound = 'money';
    } else if (text == 'ካርድ መሙያ') {
      sound = 'card';
    } else if (text == 'አማርኛ ማንበቢያ') {
      sound = 'amharic';
    } else if (text == 'እንግሊዘኛ ማንበቢያ') {
      sound = 'english';
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
    <TouchableOpacity
      onPress={changeText}
      style={{
        height: '20%',
        marginTop: 10,
        backgroundColor: '#cccc00',
      }}>
      <Text
        style={{
          fontSize: 35,
          textAlign: 'center',
          paddingTop: 10,
          color: '#4d4d4d',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Navigation;
