import React from 'react';
import {SafeAreaView, View} from 'react-native';

//Components
import CameraScreen from './components/cameras';
import NavBar from './components/navigation';

function App(): JSX.Element {
  return (
    <View style={{height: '100%'}}>
      <CameraScreen />
      <NavBar />
    </View>
  );
}

export default App;
