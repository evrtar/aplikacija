import React,{useReducer} from 'react';
import {View,Text,FlatList,TouchableOpacity, StyleSheet,ScrollView,Image} from 'react-native';
import Spinner from '../components/Spinner';
import SearchInput from '../components/SearchInput';
import firebase from 'firebase';
import {getSizeOfDatabase} from '../helper/firebaseHelper';
import Entypo from 'react-native-vector-icons/Entypo';
import {position} from '../helper/styleHelper';
import axios from 'axios';
import {IProduct} from '../helper/interface';
interface IField{
    fields:IProduct;
}
interface IState{
    hits:IField[];
    flag:boolean;
    searchValue:string;
    spinnerFlag:boolean;
    itemPressed:string;
}
type setSearchValue={
    readonly type:"setSearchValue";
    readonly payload:string;
}
type setProduct={
    readonly type:"setProduct";
    readonly payload:IField[];
}
type setFlag={
    readonly type:"setFlag";
    readonly payload:boolean;
}
type setSpinnerFlag={
    readonly type:"setSpinnerFlag";
    readonly payload:boolean;
}
type setPressedItem={
    readonly type:"setPressedItem";
    readonly payload:string;
}
type Actions=setProduct|setFlag|setSearchValue|setSpinnerFlag|setPressedItem;
function reducer(state:IState,action:Actions):IState{
    switch(action.type){
        case "setProduct":
            return{...state,hits:action.payload};
        case "setSearchValue":
            return{...state,searchValue:action.payload};
        case "setSpinnerFlag":
            return{...state,spinnerFlag:action.payload,flag:action.payload?false:true};
        case "setPressedItem":
            return{...state,itemPressed:action.payload};
        default:
            return state;
    }
}

const ApiNutritionx=():JSX.Element=>{
    const [state,dispatch]=useReducer<React.Reducer<IState,Actions>>(reducer,{itemPressed:'',spinnerFlag:false,searchValue:'',flag:false,
        hits:[{
            fields:
            {brand_name:'',item_id:'',item_name:'',nf_calories:0,nf_total_fat:0,nf_protein:0}
        },
    ]
    });

    const getApi=async():Promise<void>=>{
        dispatch({type:"setSpinnerFlag",payload:true});
        await axios("https://nutritionix-api.p.rapidapi.com/v1_1/search/"+state.searchValue+"?fields=item_name,item_id,brand_name,nf_calories,nf_total_fat,nf_protein,nix_item_id", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
                "x-rapidapi-key": "d61a1eb47fmsh0d8daf8b10d2ab6p183bd9jsn351c8602f81b"
            }
        })
        .then(data => {
            {dispatch({type:"setProduct",payload:data.data.hits})}})
        .then(()=>{dispatch({type:"setSpinnerFlag",payload:false})})
        .catch(error => {console.log(error);}) 
    }
    const addMeal=(item:IField):void=>{
        var date:Date=new Date();
      
        dispatch({type:"setPressedItem",payload:item.fields.item_id});
        let counter:number=getSizeOfDatabase('Meal');
        firebase.database().ref('Meal/'+firebase.auth().currentUser?.uid+'/'+counter).set({
            uid:firebase.auth().currentUser?.uid,
            name:item.fields.item_name,
            calories:item.fields.nf_calories,
            fat:item.fields.nf_total_fat,
            protein:item.fields.nf_protein,
            date:{
                day:date.getDate(),
                month:date.getMonth()+1
            }
        })
    }
    const checkPressedItem=(id:string):string=>{

        return(id===state.itemPressed? "green":"black")
    }
    const showData=():JSX.Element | undefined=>{
        if(!state.spinnerFlag){
            if(state.flag){
            return(
            <ScrollView style={{backgroundColor:'#f0fff0'}}>
                <FlatList
                data={state.hits}

                renderItem={({item}:{item:IField} )=>(
                        
                <View style={styles.flatListContainer}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.textStyle}>{item.fields.item_name}</Text>
                    </View>
                    <View style={styles.rowStyle}>
                        <View style={{padding:5}}>
                            <Text style={styles.insideTextStyle}>Brand:{item.fields.brand_name}</Text>
                            <Text style={styles.insideTextStyle}>Calories:{item.fields.nf_calories}cal</Text>
                            <Text style={styles.insideTextStyle}>Protein:{item.fields.nf_protein}g</Text>
                            <Text style={styles.insideTextStyle}>Fat:{item.fields.nf_total_fat}g</Text>
                        </View>
                        <View style={styles.tickContainerStyle}>
                            <TouchableOpacity onPress={()=>{addMeal(item)}}>
                                <Entypo name="check" size={30} color={checkPressedItem(item.fields.item_id)}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)} 
                keyExtractor={(item,index)=>index.toString()}
            /></ScrollView>)}
            else{
                return(<View style={{backgroundColor:'#efefef'}}><Image style={styles.imageStyle} source={require('../images/chief.png')}/></View>)
            }
        }
    }
    return(state.spinnerFlag?
    <View style={{...position.positionCenterColumn,flex:1}}><Spinner size={30}/></View>
    :
    <View style={{backgroundColor:'#fffafa'}}>
        <View style={styles.containterStyle}>
            <SearchInput 
            onPress={()=>getApi()} 
            name="search-web" 
            placeholder={'hamburger'} 
            value={state.searchValue} 
            onChangeText={(searchValue)=>dispatch({type:'setSearchValue',payload:searchValue})}
            />
        </View>
        <View>
            {showData()}
        </View>
    </View>)
}
const styles=StyleSheet.create({
    containterStyle:{
        padding:5,
        borderRadius:30,
        borderWidth:3,
        marginBottom:10,
        borderColor:"#228b22",
        flexDirection:'row',
        marginTop:"5%",
        backgroundColor:'#f5f5f5'
    },
    textStyle:{
        fontSize:17,
        fontFamily:'Karla-BoldItalic', 
    },
    insideTextStyle:{
        fontFamily:'Karla-Italic',
        fontSize:17
    },
    imageStyle:{
        width:"100%",
        height:"93%"
    },
    tickContainerStyle:{
        padding:30,
        justifyContent:'center',
        alignItems:'center'
    },
    flatListContainer:{
        backgroundColor:'#f0fff0',
        marginBottom:20,
        padding:10,
        flex:1,
        borderBottomWidth:3,
        borderColor:'white'
    },
    rowStyle:{
        flexDirection:'row'
    }
})
export default ApiNutritionx;