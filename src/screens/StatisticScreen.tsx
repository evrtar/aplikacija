import React, { useEffect, useReducer } from 'react';
import {View,Text,ScrollView,StyleSheet } from 'react-native';
import firebase from 'firebase';
import Spinner from '../components/Spinner';
import ProgressCircle from '../components/ProgressCircle';
import Header from '../components/Header';
import {position,textStyle} from '../helper/styleHelper';

import {getSizeOfDatabase} from '../helper/firebaseHelper'
import { TouchableOpacity } from 'react-native-gesture-handler';
interface IProps{
    navigation:any;
}
interface IData{
  calories:string;
  protein:string;
  fat:string;
  uid:string;
  name:string;
}
interface IState{
  dataFromFirebase:IData[];
  optimalCalories:number;
  optimalProtein:number;
  optimalFat:number;
  counter:number;
  bmi:string;
  loading:boolean;
  myProtein:number;
  myCalories:number;
  myFat:number;
}
type setDataFromFirebase={
  readonly type:"setDataFromFirebase";
  payload:IData[];
}
type setLoading={
  readonly type:"setLoading";
  readonly payload:boolean;
}
type setBMI={
  readonly type:"setBMI";
  readonly payload:string;
}

type setOptimalValue={
  readonly type:"setOptimalValue";
  readonly optimalProtein:number;
  readonly optimalCalories:number;
  readonly optimalFat:number;
}
type setCounter={
  readonly type:"setCounter";
  readonly payload:number;
}
type setMyIntake={
  readonly type:"setMyIntake";
  readonly myCalories:number;
  readonly myFat:number;
  readonly myProtein:number;
}
type Actions=setDataFromFirebase|setLoading|setOptimalValue|setCounter|setBMI|setLoading|setMyIntake;
function reducer(state:IState,action:Actions):IState{
    switch(action.type){
      case "setDataFromFirebase":
        return {...state,dataFromFirebase:action.payload};
      case "setOptimalValue":
        return {...state,optimalCalories:action.optimalCalories,optimalFat:action.optimalFat,optimalProtein:action.optimalProtein};
      case "setCounter":
          return{...state,counter:action.payload};
      case "setLoading":
        return{...state,loading:action.payload};
      case "setBMI":
          return{...state,bmi:action.payload};
      case "setMyIntake":
        return{...state,myCalories:action.myCalories,myFat:action.myFat,myProtein:action.myProtein,loading:false};
      default:
        return state;
    }
}
const StatisticScreen=(props:IProps):JSX.Element=>{
  const [state,dispatch] = useReducer<React.Reducer<IState,Actions>>(reducer,{bmi:'',loading:false,myCalories:0,myFat:0,myProtein:0,
  counter:0,optimalFat:0,optimalProtein:0,optimalCalories:0,
  dataFromFirebase:[]});
    useEffect(()=>{
      calculateOptimalDailyInput();
      setDataFromFirebase();
    },[])
    
    const setDataFromFirebase=async():Promise<void>=>{
      let counter=getSizeOfDatabase('Meal');
      let protein:number=0;
      let fat:number=0;
      let calories:number=0;

      let arrayOfMeals:IData[]=[];
      await firebase.database().ref('Meal/'+firebase.auth().currentUser?.uid).once('value')
      .then((snap)=>{
        if(snap.val()){
          arrayOfMeals=snap.val();
          let count:number=0;
          while(count<counter){
            protein+=Number(arrayOfMeals[count].protein);
            calories+=Number(arrayOfMeals[count].calories);
            fat+=Number(arrayOfMeals[count].fat);
            count++;
          }
          dispatch({type:"setMyIntake",myCalories:calories,myProtein:protein,myFat:fat});
        }
      })
      .catch((error)=>console.log(error))
    }
    const refreshScreen=():void=>{
      dispatch({type:"setLoading",payload:true})
       setDataFromFirebase();
    } 
    //Mifflin-St Jeor Equation:
    const calculateOptimalDailyInput=async():Promise<void>=>{
      const currentUser:string|undefined=firebase.auth().currentUser?.uid;
      let weight:number=0;
      let height:number=0;
      let age:number=0;
      let gender:boolean=false;
      await firebase.database().ref('BMI/'+currentUser).once('value')
      .then((snap)=>{
        weight=Number(snap.val().weight);
        height=Number(snap.val().height)*100;
        age=Number(snap.val().age);
        gender=snap.val().gender;
      }).then(()=>{
          const optimalProtein:number=parseFloat(calculateOptimalProtein(age,gender).toFixed(2));
          const optimalCalories:number=parseFloat(calculateOptimalCalories(age,gender,height,weight).toFixed(2));
          const optimalFat:number=parseFloat((optimalCalories*0.3).toFixed(2));
          dispatch({type:"setOptimalValue",optimalCalories:optimalCalories,optimalFat:optimalFat,optimalProtein:optimalProtein});
        })
      .catch((error)=>console.log(error));   
    }

    const calculateOptimalCalories=(age:number,gender:boolean,height:number,weight:number):number=>{
      return(gender?
          13.4*weight+4.8*height-5.7*age+88.36
          :
          9.247*weight+3*height-4.33*age+447.593
        )
    }
    const calculateOptimalProtein=(age:number,gender:boolean):number=>{
      let optimalProtein:number=0;
      if(gender){
        return(age>=14 && age<=18? optimalProtein=52:optimalProtein=56);
      }
      else{
        return(age>=14 && age<=18? optimalProtein=46:optimalProtein=46)
      }
    }
    return(state.loading?
    <View style={{flex:1,justifyContent:"center",alignItems:'center',flexDirection:'row'}}><Spinner size={80}/></View>
      :
        <ScrollView style={position.container}>
        <Header navigation={props.navigation} name={"Intake"} icon={true}  backgroundColor={"#2e8b57"}/>
          <View style={position.positionCenter}>
            <Text style={textStyle.titleStyle}>Optimal daily intake</Text>
          </View>
          <View style={styles.progressStyle}>
            <ProgressCircle value={state.optimalProtein} title="Protein" unfiledColor="#5f9ea0" fill="#5f9ea0" color="#5f9ea0" marginLeft={7}/>
            <ProgressCircle value={state.optimalCalories} title="Calories" unfiledColor="#d2691e" fill="#d2691e" color="#d2691e" marginLeft={4}/>
            <ProgressCircle value={state.optimalFat} title="Fat" unfiledColor="#b22222" fill="#b22222" color="#b22222" marginLeft={23}/>
          </View>
            <View style={{...position.positionCenter,marginTop:50}}>
              <Text style={textStyle.titleStyle}>Your daily intake</Text>
            </View>
          <View style={styles.progressStyle}>
            <ProgressCircle value={state.myProtein} title="Protein" unfiledColor="#5f9ea0" fill="#5f9ea0" color="#5f9ea0" marginLeft={7}/>
            <ProgressCircle value={state.myCalories} title="Calories" unfiledColor="#d2691e" fill="#d2691e" color="#d2691e" marginLeft={4}/>
            <ProgressCircle value={state.myFat} title="Fat" unfiledColor="#b22222" fill="#b22222" color="#b22222" marginLeft={23}/>
          </View>
          <View style={{...position.positionCenter,marginTop:50}}>
          <TouchableOpacity onPress={()=>refreshScreen()}>
            <Text style={textStyle.titleStyle}>Refresh</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )
}
const styles = StyleSheet.create({
  progressStyle:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'stretch',
    paddingRight:5,
    paddingLeft:5,
    marginTop:40
  }
})
export default StatisticScreen;