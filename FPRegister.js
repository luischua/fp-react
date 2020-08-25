import React, {useState} from 'react';
import { Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { Container, Header, Content, Title, Form, Item, Input, Label, Button, Text, Icon, DatePicker} from 'native-base';
import { Formik } from 'formik';
import axios from 'axios';
import moment from 'moment';
import FPPicker from "./FPPicker";
import FPRecord from "./FPRecord";
import {log, httpUrl, checkIfSiteIsUp, getRegistrationDB} from "./FPUtil";
import DateTimePicker from '@react-native-community/datetimepicker';
import {v4} from 'uuid';

export function createFormData(form){
    const formData = new FormData(); 
    formData.append('idpic', {uri: form.idPicker, type: 'image/jpeg', name: 'id.jpg'});
    formData.append('fingerprint', {uri: form.fingerprintPicker, type: 'image/tiff', name: 'fingerprint.tiff'});        
    formData.append('name', form.name);
    if(form.birthDate != null){
        formData.append('birthdate', moment(form.birthDate).format('YYYY-MM-DD'));
    } 
    return formData;
  }

export default function FPRegister(props) {
  const [visible, setVisible] = useState(false); 
  const [idPicker, setIdPicker] = useState(); 
  const [fingerprintPicker, setFingerprintPicker] = useState(); 
  const [person, setPerson] = useState(); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePicker, setDatePicker] = useState(new Date());

  const toggle = () => {
    setVisible(!visible);
  };

  const initialValues = { 
    name: '',
    birthDate: '',
  }

  const triggerRegister = (values, {setSubmitting, setErrors, setStatus, resetForm}) => {
    
    const formValue = {
        id: v4(),
        idpic: idPicker,
        fingerprintPicker: fingerprintPicker,
        name: values.name,
        birthDate: moment(values.birthDate).format('YYYY-MM-DD')
    }
    log(formValue)
    if(formValue.name == ''){
        alert("missing Name")
        return
    }
    if(formValue.idpic == null){
        alert("missing ID Pic")
        return
    }
    if(formValue.fingerprintPicker == null){
        alert("missing Fingerprint")
        return
    }
    checkIfSiteIsUp().then((siteReachable) => {
        log("reachable: "+siteReachable);
        if(!siteReachable){
            log("Saving to PouchDB");
            getRegistrationDB().post(formValue);
        }else{
            log("Trigger Post");
            const formData = createFormData(formValue)
            axios.post(httpUrl()+'/register', formData, {
            headers: {
                'content-type': 'multipart/form-data' 
                }
            })
            .then(function (response) {
                toggle();
                if(response.data.error){
                    //setStatus({success: false})
                    //setSubmitting(false)
                    //setErrors({submit: response.data.error})
                }else{
                    //setStatus({success: true})
                    setPerson(response.data.person);
                    setIdPicker(null);
                    setFingerprintPicker(null);
                    resetForm(initialValues)
                    log(response);
                }
            })
            .catch(function (error) {
                //setStatus({success: false})
                //setSubmitting(false)
                //setErrors({submit: error.message})
                log(error);
                alert(error);
            });
        }
    });
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
                    <Input 
                        value={values.birthDate} 
                    />
                    <Button rounded
                        onPress={()=>{
                            log("Pick Press")
                            setShowDatePicker(true);
                        }}>
                        <Text>Pick Date</Text>       
                    </Button>
                    {showDatePicker &&
                        <DateTimePicker
                            value={datePicker}
                            display="spinner"
                            onChange={(selectedDate) => {
                                setShowDatePicker(false);
                                var pickedDate = new Date(selectedDate.nativeEvent.timestamp);
                                log(pickedDate);
                                setDatePicker(pickedDate);
                                var dateString = moment(pickedDate).format('YYYY-MM-DD');
                                log("Change Date"+dateString)
                                setFieldValue("birthDate", dateString);
                            }}
                        />
                    }
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