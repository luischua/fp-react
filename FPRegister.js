import React from 'react';
import { Image, TouchableOpacity, Modal } from 'react-native';
import { Container, Header, Content, Title, Form, Item, Input, Label, Button, Text, Icon, DatePicker} from 'native-base';
import { Formik } from 'formik';
import axios from 'axios';
import moment from 'moment';
import FPPicker from "./FPPicker";
import FPRecord from "./FPRecord";
import {httpUrl} from "./FPUtil";
export default function FPRegister(props) {
  const [visible, setVisible] = React.useState(false); 
  const [idPicker, setIdPicker] = React.useState(); 
  const [fingerprintPicker, setFingerprintPicker] = React.useState(); 
  const [person, setPerson] = React.useState(); 

  const toggle = () => {
    setVisible(!visible);
  };

  const triggerRegister = (values, {setSubmitting, setErrors, setStatus, resetForm}) => {
    
    const formData = new FormData(); 
    //alert("Values"+values.name+values.birthDate+idPicker+fingerprintPicker)
    formData.append('idpic', {uri: idPicker, type: 'image/jpeg', name: 'id.jpg'});
    formData.append('fingerprint', {uri: fingerprintPicker, type: 'image/tiff', name: 'fingerprint.tiff'});        
    formData.append('name', values.name);
    formData.append('birthdate', moment(values.birthDate).format('YYYY-MM-DD')); 
    axios.post(httpUrl()+'/register', formData, {
    headers: {
        'content-type': 'multipart/form-data' 
        }
    })
    .then(function (response) {
        toggle();
        setPerson(response.data);
        setIdPicker(null);
        setFingerprintPicker(null);
        resetForm(initialValues)
        setStatus({success: true})
        console.log(response);
    })
    .catch(function (error) {
        setStatus({success: false})
        setSubmitting(false)
        setErrors({submit: error.message})
        console.log(error);
    });
  }

  const initialValues = { 
    name: '',
    birthDate: null,
  }

  return (
    <Container> 
    <Header>
        <Title>Register</Title>
    </Header>
    <Content>
        <FPPicker name="ID Photo" device="Camera"
        picker={idPicker} setPicker={setIdPicker}/>
        
        <FPPicker name="Fingerprint Image" device="Scanner"
        picker={fingerprintPicker} setPicker={setFingerprintPicker}/>
       
        <Formik
            initialValues={initialValues}
            onSubmit={triggerRegister}
        >
            {({ handleChange, handleBlur, setFieldValue, handleSubmit, values}) => (
            <Form>
                <Item>
                    <Label>Name</Label>
                    <Input
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name} 
                    />
                </Item>
                <Item>
                    <Label>BirthDate</Label>
                    <DatePicker
                        animationType={"fade"}
                        androidMode={"spinner"}
                        placeHolderText={!values.birthDate ? "Select Date" : null}
                        textStyle={{ color: "green" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        formatChosenDate={date => {return moment(date).format('YYYY-MM-DD');}}
                        defaultDate={values.birthDate}
                        onDateChange={(date) => setFieldValue("birthDate", date)}
                        />
                </Item>
                <Button rounded
                    onPress={handleSubmit}>
                    <Text>Sumbit</Text>       
                </Button>
            </Form>     
            )}
        </Formik> 
 
        <Modal
            animationType = "fade"
            transparent={false}
            visible={visible}
        >
            <Text>Thank you for registering.</Text>
            {person &&
                <FPRecord record={person} />
            }    
            <TouchableOpacity onPress={toggle}>
                <Text>New Registration</Text>
            </TouchableOpacity>  
        </Modal>
    </Content>
    </Container>    
  );
}