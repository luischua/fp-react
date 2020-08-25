import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Image, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import Constants from 'expo-constants';
import {log, httpUrl} from "./FPUtil";
import FPRecord from './FPRecord';

export default function FPBarcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [person, setPerson] = useState();
  const [retrieve, setRetrieve] = useState();
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setRetrieve(true);
    findPersonByID(data);
  };
  
  const findPersonByID = (id) => {
    log(httpUrl()+"/person/"+id);
    axios.get(httpUrl()+"/person/"+id, {timeout: 10000})
    .then(response => {
        setPerson(response.data);
        setRetrieve(false);    
    })
    .catch(error => {
        console.log(error);
    });
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex:1}}>
      <View
        style={{
          flex: .5,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject, styles.container]}>
            <Text style={styles.description}>Scan QR code</Text>
          </BarCodeScanner>
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} 
      </View>
      <View style={{flex:.5}}>
        <ScrollView>
          {retrieve &&
            <Text>Retrieving Record...</Text>
          }
          {person &&
            <FPRecord record={person} />
          }
        </ScrollView>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  description: {
    fontSize: width * 0.06,
    marginTop: '10%',
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
});