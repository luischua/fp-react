import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//optimize navigation
import { enableScreens } from 'react-native-screens';
import FPSearch from './FPSearch';          
import HomeScreen from './HomeScreen'
import FPRegister from './FPRegister'
import FPBarcode from './FPBarcode'
import FPOffline from './FPOffline'
import {getTranslations} from "./FPUtil";
const Tab = createBottomTabNavigator();
//enableScreens(true);
const i18n = getTranslations();

export default function FPNavigator() {
  return (
    <NavigationContainer>
        <Tab.Navigator tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name={i18n.t("Search")} component={FPSearch} />
        <Tab.Screen name={i18n.t("Register")} component={FPRegister} />   
        <Tab.Screen name="Scan" component={FPBarcode} />
        <Tab.Screen name="Offline" component={FPOffline} />   
        </Tab.Navigator>
    </NavigationContainer>
  );
}