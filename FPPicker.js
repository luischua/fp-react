import React from 'react';
import { Image, Modal, TouchableOpacity} from 'react-native';
import { Button, Text, Card, CardItem, Left, Right} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {httpUrl} from "./FPUtil";
import FPCamera from "./FPCamera";

export default function FPPicker(props){

    const [visible, setVisible] = React.useState(false); 
    toggle = () => {
      setVisible(!visible);
    };

    const cancelPicker = () => {
        props.setPicker(null);
    }
      
    const openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        //alert(pickerResult.uri)
        props.setPicker(pickerResult.uri);
        if(props.verifyId){
            verifyFingerprint(pickerResult.uri)
        }
    };

    const verifyFingerprint = (uri) => {
        alert("Verify" + props.verifyId + "Fingerprint"+uri);
        const formData = new FormData(); 
        formData.append('fingerprint', {uri: uri, type: 'image/tiff', name: 'fingerprint.tiff'});        
        formData.append('id', props.verifyId);
        axios.post(httpUrl()+'/verify', formData, {
        headers: {
            'content-type': 'multipart/form-data' 
            }
        })
        .then(function (response) {
          alert(response.data);
          if(response.data === true){
            props.setResult("Match");
          }else{
            props.setResult("Not Match");    
          }
          console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            props.setResult("Verifying Problem");   
        });
    }

    return(
    <>    
        <Card>
            <CardItem header bordered>
                <Text>{props.name}</Text>    
            </CardItem>
            { props.picker   
                ?
                <>     
                    <CardItem>
                        <Image source={{uri: props.picker}} style={{height:100, width: 200, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                        <Button round
                            onPress={cancelPicker}
                        >
                            <Text>Remove</Text>    
                        </Button>
                    </CardItem>
                </>    
                :
                <CardItem>
                    <Left>     
                        <Button round
                            onPress={toggle}>
                            <Text>Capture from {props.device}</Text>    
                        </Button>
                    </Left>
                    <Right>
                        <Button round
                            onPress={openImagePickerAsync}
                        >
                            <Text>Pick from Gallery</Text>    
                        </Button>
                    </Right>
                </CardItem>    
            }
        </Card>
        <Modal
            animationType = "fade"
            transparent={false}
            visible={visible}
        >
            { props.device === "Camera" &&
                <FPCamera photoImage={photo => {
                    props.setPicker(photo.uri); 
                    toggleOverlay();
                    }}/>
            }
            { props.device === "Scanner" &&
                <Text>Not yet available</Text>
            }
            <TouchableOpacity onPress={toggle}>
            <Text>Close</Text>
            </TouchableOpacity>  
        </Modal>
    </>    
    )
}