import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import FPPersonTable from './FPPersonTable';
import {createFormData} from "./FPRegister";
import {httpUrl, checkIfSiteIsUp, getRegistrationDB} from "./FPUtil";
export default function FPOffline() {

    const [personList, setPersonList] = useState(); 
    
    useEffect(() => {
        fetchPouch();
     }, []);

    function fetchPouch(){
        console.log("fecth Data");
        getRegistrationDB().allDocs().then(function (result) {
              var list = [];
              result.rows.forEach(e => {
                e.id = e._id;
                list.push(e.doc);
              });
              console.log(JSON.stringify(list));
              setPersonList(list);
          }).catch(function (err) {
            console.log(err);
          });
    } 

    function registerSync(){
        if(!checkIfSiteIsUp()){
            alert("No internet or site is still down");
        }else{
            getRegistrationDB().allDocs().then(function (result) {
                result.rows.forEach(e => {
                    const formData = createFormData(e.doc)
                    axios.post(httpUrl()+'/register', formData, {
                    headers: {
                        'content-type': 'multipart/form-data' 
                        }
                    })
                    .then(function (response) {
                        //remove if successfully posted
                        if(!response.data.error){
                            db.remove(e);
                        }
                    });
                });
            }).catch(function (err) {
                console.log(err);
            });
        }
    }

    return(
       <View>
            <Text>Note: Records will be deleted from local storage once it's registered successfully!</Text>
            <Button round onPress={registerSync}>
                <Text>Sync Offline Records to Server</Text>    
            </Button>
            <FPPersonTable compType='flatlist' personList={personList}/>  
       </View>
    );
}