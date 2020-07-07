import React,{useReducer} from 'react';
import {View,StyleSheet,Dimensions, ImageBackground,TouchableOpacity,Text} from 'react-native';
import Reinput from 'reinput';
import firebase from 'firebase';

import  {getSizeOfDatabase} from '../helper/firebaseHelper';
import {IFood} from '../helper/interface'
import { position } from '../helper/styleHelper';
const { width,height} = Dimensions.get('window');

type setName={
    readonly type:"setName";
    readonly payload:string;
}
type setCalories={
    readonly type:"setCalories";
    readonly payload:string;
}
type setFat={
    readonly type:"setFat";
    readonly payload:string;
}
type setProtein={
    readonly type:"setProtein";
    readonly payload:string;
}
type Actions=setName|setCalories|setFat|setProtein;
function reducer(state:IFood,action:Actions):IFood{
    switch(action.type){
        case "setName":
            return {...state,name:action.payload};
        case "setCalories":
            return {...state,calories:action.payload};
        case "setFat":
            return {...state,fat:action.payload};
        case "setProtein":
            return {...state,protein:action.payload};
        default:
            return state;
    }
}
const ManualInput=():JSX.Element=>{
    const [state,dispatch] = useReducer<React.Reducer<IFood,Actions>>(reducer,{date:{month:0,day:0},name:'',calories:'',fat:'',protein:''})

    const addMealToDatabase=():void=>{
        const date:Date=new Date();
        const counter:number=getSizeOfDatabase('Meal');
        firebase.database().ref('Meal/'+firebase.auth().currentUser?.uid+'/'+counter).set({
            uid:firebase.auth().currentUser?.uid,
            name:state.name,
            fat:state.fat,calories:state.calories,
            protein:state.protein,
            date:{day:date.getDate(),month:date.getMonth()+1}
        })
    }


    
    return(<View style={styles.containerStyle}>
        <ImageBackground style={{width:width,height:height+150}} source={{uri:"https://cdn4.vectorstock.com/i/1000x1000/82/63/healthy-diet-icon-vector-13498263.jpg"}}>
            <View>
            <View style={styles.reinputStyle}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Reinput label='Name' marginBottom={0}  activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} onChangeText={(name:string)=>dispatch({type:"setName",payload:name})}/> 
                    </View>
                    <View style={{flex:1,marginLeft:50}}>
                        <Reinput label='Calories' marginBottom={0}  activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} onChangeText={(calories:string)=>dispatch({type:"setCalories",payload:calories})}/>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                        <Reinput label='Protein' marginBottom={0}  activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} onChangeText={(protein:string)=>dispatch({type:"setProtein",payload:protein})}/>
                    </View>
                    <View style={{flex:1,marginLeft:50}}>
                        <Reinput label='Fat' marginBottom={0}  activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} onChangeText={(fat:string)=>dispatch({type:"setFat",payload:fat})}/>
                    </View>
                </View>
            </View>
            <View style={{...position.positionCenter,bottom:10}}>
                <TouchableOpacity onPress={()=>addMealToDatabase()}>
                    <Text style={styles.buttonTextStyle}>
                        ADD MEAL
                    </Text>
                </TouchableOpacity>
            </View>
            </View>
            </ImageBackground>
    </View>)
}
const styles=StyleSheet.create({
    containerStyle:{
        flex:1,
        backgroundColor:'#fffafa',
    },
    reinputStyle:{
        width:width,
        paddingTop:20
    },
    buttonTextStyle:{
        fontSize:22,
        fontFamily:'Karla-Bold',
        color:"green"
    }
})
export default ManualInput;