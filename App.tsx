import React from 'react';


import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';



import SplashScreen from './src/screens/SplashScreen';
import LogInScreen from './src/screens/LogInScreen';

//Drawer
import CalculatorScreen from './src/screens/CalculatorScreen';
import TabViewExample from './src/slidingTabLayout/TabLayout';
import StatisticScreen from './src/screens/StatisticScreen'


//Custom Drawer

import DrawerContent from './src/customDrawer/DrawerContent';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();


const AuthStackScreen=()=>{
  return(
    <NavigationContainer>
    <AuthStack.Navigator screenOptions={{headerShown:false}}
    initialRouteName="SplashScreen">
      <AuthStack.Screen name="SplashScreen" component={SplashScreen}/>
      <AuthStack.Screen name="LogInScreen" component={LogInScreen}/>
      <AuthStack.Screen name="App" component={App}/>
    </AuthStack.Navigator>
    </NavigationContainer>
 )
}
const App=()=>{
  return(
      <Drawer.Navigator drawerStyle={{borderWidth:1,borderRadius:15,backgroundColor:'#2e8b57'}} drawerContent={props => <DrawerContent {...props}/>}
      initialRouteName="CalculatorScreen" 
      >
      <Drawer.Screen name="CalculatorScreen" component={CalculatorScreen}/>
      <Drawer.Screen name="TabViewExample" component={TabViewExample}/>
      <Drawer.Screen name="StatisticScreen" component={StatisticScreen}/>
  </Drawer.Navigator>
  )
}
export default AuthStackScreen;

