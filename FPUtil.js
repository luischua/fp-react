import React from 'react';
import Constants from 'expo-constants';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import axios from 'axios';
import PouchDB from 'pouchdb-react-native';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: { 
        "Search": "Search", 
        "Register": "Register"
    },
  zh: { 
        "Search": "搜索", 
        "Register": "注册"
    },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
//i18n.locale = "zh";
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export function getTranslations(){
    return i18n;
}

//const env = Constants.manifest.extra.env
const env = 'test'
export function httpUrl(){
    if(env === 'test'){
        return 'http://fpapp.cleverapps.io'
    }
    if(env === 'production'){
        return 'http://localhost:8080'
    }
    if(env === 'emulator'){
        return Platform.select({
            ios: 'http://localhost:8080',
            android: 'http://10.0.2.2:8080',
        });
    }
}

export async function checkIfSiteIsUp(){
    log("check site "+httpUrl())
    try{
        const response = await axios.get(httpUrl(), {timeout: 4000})
    } catch(error) {
        log("Check Error")
        log(error.response.status)        
        if(error.response.status  == 404){
            return true;
        }
    }
    return false;
}

const db = new PouchDB('regist')
export function getRegistrationDB(){
    return db;
}

export function log(data){
    console.log(JSON.stringify(data));
}