import React from 'react';
import Constants from 'expo-constants';

const env = 'emulator'
const appUrl = Constants.manifest.extra.appUrl
export function httpUrl(){
    if(env == 'test'){
        return 'http://localhost:8080'
    }
    if(env == 'production'){
        return 'http://localhost:8080'
    }
    if(env == 'emulator'){
        return Platform.select({
            ios: 'http://localhost:8080',
            android: 'http://10.0.2.2:8080',
        });
    }
}