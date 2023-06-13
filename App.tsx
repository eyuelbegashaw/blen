import React, {useState} from 'react';
import {View} from 'react-native';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

//Global context
import TextContext from './context/globalState';

//Components
import CameraScreen from './components/cameras';
import NavBar from './components/navigation';

function App(): JSX.Element {
  const [text, setText] = useState('ገንዘብ ማወቂያ');
  return (
    <TextContext.Provider value={{text, setText}}>
      <View style={{height: '100%'}}>
        <CameraScreen />
        <NavBar />
      </View>
    </TextContext.Provider>
  );
}

export default App;
