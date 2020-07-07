import React,{useEffect,useReducer} from 'react';
import {View,Image,StatusBar,StyleSheet,Dimensions} from 'react-native';
import firebase from 'firebase';
const { width, height } = Dimensions.get('window');
interface IProps{
    navigation:any;
}
interface IState{
    loading:boolean;
    flag:boolean;
}
type setUser={
    readonly type:"setUser";
}
type setLoading={
    readonly type:"setLoading";
}
type clear={
    readonly type:"clear";
}
type Actions=setUser|setLoading|clear;
function reducer(state:IState,action:Actions):IState{
    switch(action.type){
        case "setUser":
            return {...state,flag:true}
        case "setLoading":
            return {...state,loading:true}
        case "clear":
            return {...state,loading:false,flag:false}
        default:
            return state;
    }
}
const SplashScreen=(props:IProps):JSX.Element=>{
    const [state,dispatch]=useReducer<React.Reducer<IState,Actions>>(reducer,{loading:false,flag:false});
    
    useEffect(()=>{
        const firebaseConfig = {
            apiKey: "AIzaSyD4TLZmbhfWA9BkPAEZIkMquDqtWWuC-oA",
            authDomain: "healthcalculator-f77e7.firebaseapp.com",
            databaseURL: "https://healthcalculator-f77e7.firebaseio.com",
            projectId: "healthcalculator-f77e7",
            storageBucket: "healthcalculator-f77e7.appspot.com",
            messagingSenderId: "1079436822244",
            appId: "1:1079436822244:web:eb943d246b8bd4fa6d0ef1",
            measurementId: "G-8HES4JB15D"
          };
          if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                dispatch({type:"setUser"})
            }
            dispatch({type:"setLoading"})
        });
        },[])
    const check=():void=>{
        if(state.loading){
            if(state.flag){
                props.navigation.navigate('App');
                dispatch({type:"clear"})
            }
            else{
                props.navigation.navigate('LogInScreen')
                dispatch({type:"clear"})
            }
        }
    }
    return(<View style={{flex:1}}>
            {check()}
            <StatusBar backgroundColor="#000000"/>
            <Image style={styles.imageStyle} source={require('../images/doctor.jpg')}/>
        </View>)
}
const styles=StyleSheet.create({
    imageStyle:{
        width:width,
        height:height
    }
})
export default SplashScreen;