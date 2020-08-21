import React from 'react';
import {Image, Text} from 'react-native';
import { Container, Card, CardItem, Thumbnail, Button, Left, Right, Body} from 'native-base';
import { Modal, TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';
import FPPicker from "./FPPicker";
import { QRCode } from 'react-native-custom-qr-codes';

export default function FpRecord(props){
  
  const [visible, setVisible] = React.useState(false); 
  toggleOverlay = () => {
    setVisible(!visible);
  };

  const [fingerprintPicker, setFingerprintPicker] = React.useState(); 
  const [match, setMatch] = React.useState("Processing....."); 
  const record = props.record;

  return (
    <>
      <Card style={{elevation: 3}}>
        <CardItem>
          <Left>
            <QRCode
              content={"Test"}
              codeStyle='dot'
              outerEyeStyle='square' 
              innerEyeStyle='circle'
              linearGradient={['rgb(153, 255, 153)','rgb(51, 51, 204)']}
              gradientDirection={[0,170,0,0]}
              logo={require('./assets/favicon.png')}
              size={150}
              logoSize={30}
            />
          </Left>
          <Body>
              <Text>Name: {record.name}</Text>
              <Text>Bday: {record.birthDate}</Text>
          </Body>
        </CardItem>
        <CardItem>
            <Image
              source={{uri: `data:image/${record.idImageExtension};base64,${record.idImage}`,}}
              style={{height: 200, width: 200, flex: 1}}
            />
        </CardItem>  
        { record.verifiedStatus
            ?<>
              <CardItem>
                <Text>
                    Verified: 
                    { record.verifiedStatus === 'SUCCESS'
                      ?<Text> {record.verifiedStatus} </Text>
                      :<Text> {record.verifiedStatus} </Text>
                    }
                    on {record.lastVerified}
                </Text>
              </CardItem>
              { record.verifiedStatus === 'SUCCESS' &&
                <>
                  <CardItem>
                    <FPPicker name="Fingerprint To Verify" device="Scanner"
                    picker={fingerprintPicker} setPicker={setFingerprintPicker}
                    verifyId={record.id} setResult={setMatch}/>         
                  </CardItem>
                  {fingerprintPicker &&
                    <CardItem>
                        <Text>
                          Result: {match}
                        </Text>
                    </CardItem>
                  }
                </>
              }
            </>
            :<Text> To be verified </Text>  
        }

      </Card>
      <Modal
        animationType = "fade"
        transparent={false}
        visible={visible}
      >
        <Image
          source={{uri: `data:image/png;base64,${record.qrImage}`}}
          style={{height: 100, width: 200, flex: 1}}
        />
        <Text>Scan QR from another phone</Text>
        <TouchableOpacity onPress={toggleOverlay}>
          <Text>Close</Text>
        </TouchableOpacity>  
      </Modal>
    </>
  );
}
