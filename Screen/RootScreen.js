import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashSreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import Maintabscreen from './Maintabscreen';
import OtpScreen from './OtpScreen';
import scan from './scan';

const RootStack = createNativeStackNavigator();

const RootScreen = props => (
  <RootStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="splashScreen">
    <RootStack.Screen name="splashScreen" component={SplashSreen} />
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
    <RootStack.Screen name="OtpScreen" component={OtpScreen} />
    <RootStack.Screen name="Maintabscreen" component={Maintabscreen} />
    <RootStack.Screen name="scan" component={scan} />
  </RootStack.Navigator>
);

export default RootScreen;
