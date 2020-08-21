import React from 'react';
import * as Font from 'expo-font';
import FPNavigator from './FPNavigator'
import { Text} from 'react-native';

export default function App() {
  const [loaded, error] = Font.useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  });

  if (!loaded) {
    return <Text>{error}</Text>;
  }

  return <FPNavigator/>;
}