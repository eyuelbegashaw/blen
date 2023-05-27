import {useState, useEffect} from 'react';
import {Button, TouchableOpacity, Text} from 'react-native';

const Navigation = () => {
  const [labels] = useState([
    'ገንዘብ መለያ',
    'ካርድ መሙያ',
    'አማርኛ ማንበቢያ',
    'እንግሊዘኛ ማንበቢያ',
  ]);
  const [text, setText] = useState('ገንዘብ መለያ');
  const [pointer, setPointer] = useState(0);

  const changeText = () => {
    if (pointer === 3) {
      setText(labels[0]);
      setPointer(0);
    } else {
      setText(labels[pointer + 1]);
      setPointer(pointer + 1);
    }
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
