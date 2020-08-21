import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//optimize navigation
import { enableScreens } from 'react-native-screens';
import FPSearch from './FPSearch';          
import HomeScreen from './HomeScreen'
import FPRegister from './FPRegister'
import FPBarcode from './FPBarcode'

const Tab = createBottomTabNavigator();
//enableScreens(true);

export default function FPNavigator() {
  return (
    <NavigationContainer>
        <Tab.Navigator tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Search" component={FPSearch} />
        <Tab.Screen name="Register" component={FPRegister} />   
        <Tab.Screen name="Scan" component={FPBarcode} />           
        </Tab.Navigator>
    </NavigationContainer>
  );
}