import React,{useReducer,useEffect} from 'react';
import {View,Text,StyleSheet,ScrollView,Dimensions} from 'react-native';
import firebase from 'firebase';
import Reinput from 'reinput';
import Header from '../components/Header';
import * as Progress from 'react-native-progress';
import {position} from '../helper/styleHelper'
import TableComponent from '../components/TableComponent';
import {IFood} from '../helper/interface';
import {deleteElement} from '../helper/firebaseHelper';
import { TouchableOpacity } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');
interface IProps{
    navigation:any;
}
interface IState{
    weight:string;
    height:string;
    bmi:number;
    showBMIFlag:boolean;
}
type setWeight={
    readonly type:"setWeight";
    readonly payload:string;
}
type setHeight={
    readonly type:"setHeight";
    readonly payload:string;
}
type setBMI={
    readonly type:"setBMI";
    readonly payload:number;
}
type clear={
    readonly type:"clear";
}
type Actions=setWeight|setHeight|setBMI|clear;
function reducer(state:IState,action:Actions):IState{
    switch(action.type){
        case "setWeight":
            return {...state,weight:action.payload};
        case "setHeight":
            return {...state,height:action.payload};
        case "setBMI":
            return {...state,bmi:action.payload,showBMIFlag:true};
        case "clear":
            return{...state,height:'',weight:''}
        default:
            return state;
    }
}
const CalculatorScreen=(props:IProps):JSX.Element=>{
    const [state,dispatch] = useReducer<React.Reducer<IState,Actions>>(reducer,{weight:'',height:'',bmi:0,showBMIFlag:false});
    useEffect(()=>{
        checkMeal();
    },[])
    const calculateBMI=():void=>{
        let result:number=0;
        if(parseInt(state.height) && parseInt(state.weight)){
            result=parseFloat((parseFloat(state.weight)/(parseFloat(state.height)*parseFloat(state.height))).toFixed(2));
            dispatch({type:'setBMI',payload:result});
        }
    }


    const showBMI=():JSX.Element|undefined=>{
        if(state.showBMIFlag){
            return(
                <View style={position.positionCenterColumn}>
                    <Progress.Bar width={200} style={styles.proggresBarStyle} progress={state.bmi/100} color={'#2e8b57'}/>
                    <Text style={styles.BMIStyle}>BMI={state.bmi}kg/m2</Text>
                </View>)
        }
    }

    const checkMeal=async():Promise<void>=>{
        let counter:number=0;
        await firebase.database().ref('Meal/'+firebase.auth().currentUser?.uid).once('value').then((snap)=>{
            if(snap.val()){
                
                const data:Array<IFood>=Object.values(snap.val());
                let elemement:IFood;
                for(elemement of data){
                    if(!checkDate(elemement.date.day,elemement.date.month)){
                        deleteElement(counter,'Meal/');
                    }
                    counter++;
                }
            }
        })
    }
    const checkDate=(dayF:number,monthF:number):boolean=>{
        const day:number = new Date().getDate();
        const month:number = new Date().getMonth() + 1;
        return(day===dayF && month===monthF?true:false);
    }
    const addToFirebase=():void=>{
        let counter:number=0;
        const currentUser:string|undefined=firebase.auth().currentUser?.uid;
        firebase.database().ref('BMI/'+currentUser).on('value',snap=>{

            if(snap.val() && counter===0){
                firebase.database().ref('BMI/'+currentUser).update(JSON.parse(JSON.stringify({
                    bmi:state.bmi,
                    weight:state.weight,
                    height:state.height
                })));
                counter++;
            }
            if(snap.val()===null && counter===0){
                firebase.database().ref('BMI/'+currentUser).set({
                    bmi:state.bmi,
                    weight:state.weight,
                    height:state.height
                });
                counter++;
            }
        })
        dispatch({type:"clear"});
    }
    
    return (<ScrollView style={position.container}>
        <Header navigation={props.navigation} name="Calculator" icon={true} backgroundColor="#2e8b57"/>
        <View style={styles.reinputContainer}>
            <Reinput label='Weight' activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} onChangeText={(weight:string)=>dispatch({type:"setWeight",payload:weight})}/>
            <Reinput label='Height' activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} marginBottom={-10} onChangeText={(height:string)=>dispatch({type:"setHeight",payload:height})}/>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',padding:10}}>
            <View style={{padding:10}}>
                <TouchableOpacity onPress={()=>calculateBMI()}>
                    <Text style={{color:"#2e8b57",fontSize:17,fontFamily:'Karla-Bold'}}>Calculate</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>addToFirebase()}>
                <Text style={{color:"#2e8b57",fontSize:17,fontFamily:'Karla-Bold'}}>Save BMI</Text>
            </TouchableOpacity>
        </View>
        {showBMI()}
        <TableComponent 
            tableHead={['Category','BMI range - kg/m2']}
            
            tableData={[['Severe Thinness','< 16'],['Moderate Thinness','16 - 17']
                                        ,['Mild Thinness','17-18.5'],['Normal','18.5-25']
                                        ,['OverWeight','25-30'],['Obese Class I','30-35']
                                        ,['Obese Class II','35-40'],['Obese Class III','>40']]} 
                        
        />
        </ScrollView>)
}
const styles=StyleSheet.create({
    proggresBarStyle:{
        marginTop:20
    },
    BMIStyle:{
        fontSize:16,
        color:'#000000',
        fontFamily:'Fondamento-Regular'
    },
    reinputContainer:{
        marginTop:20,
        width:width/2,
        marginLeft:width/4
    }
})
export default CalculatorScreen;