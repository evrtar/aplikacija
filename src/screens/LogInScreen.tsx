import React,{useReducer, useEffect} from 'react';
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native';
import firebase from 'firebase';
import Header from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {position} from '../helper/styleHelper';
import Spinner from '../components/Spinner';
import Reinput from 'reinput';
interface IProps{
    navigation:any;
}


interface IState{
    email:string;
    password:string;
    age:string;
    genderFlag:boolean;
    error:string;
    registrationFlag:boolean;
    loadingFlag:boolean;
    iconOrTextFlag:boolean;
}
type setEmail={
    readonly type:"setEmail";
    readonly payload:string;
}
type setPassword={
    readonly type:"setPassword";
    readonly payload:string;
}
type setAge={
    readonly type:"setAge";
    readonly payload:string;
}
type setChecked={
    readonly type:"setChecked";
}
type setRegistrationFlag={
    readonly type:"setRegistrationFlag";
}
type authenticationFailed={
    readonly type:"authenticationFailed";
    readonly payload:string;
}
type authetificationSuccess={
    readonly type:"authetificationSuccess";
}
type setLoading={
    readonly type:"setLoading";
}
type iconOrText={
    readonly type:"iconOrText";
}
type setError={
    readonly type:"setError"
    readonly payload:string;
}
type Actions=setEmail|setPassword|setRegistrationFlag|authenticationFailed
|authetificationSuccess|setLoading|setChecked|iconOrText|setAge|setError;
function reducer(state:IState,action:Actions):IState{
    switch(action.type){
        case "setEmail":
            return{...state,email:action.payload};
        case "setPassword":
            return{...state,password:action.payload};
        case "setAge":
            return{...state,age:action.payload};
        case "setChecked":
            return{...state,genderFlag:!state.genderFlag}
        case "setRegistrationFlag":
            return{...state,registrationFlag:!state.registrationFlag};
        case "authenticationFailed":
            return{...state,email:'',password:'',loadingFlag:false,age:'',error:action.payload}
        case "authetificationSuccess":
            return{...state,iconOrTextFlag:false,registrationFlag:false,email:'',password:'',loadingFlag:false,age:'',error:''};
        case "setLoading":
            return{...state,loadingFlag:true};
        case "iconOrText":
            return{...state,iconOrTextFlag:!state.iconOrTextFlag}
        case "setError":
            return{...state,error:action.payload};
        default:
            return state;
    }
}
const LogInScreen=(props:IProps):JSX.Element=>{
    const [state,dispatch] = useReducer<React.Reducer<IState,Actions>>(reducer,{error:'',age:'',iconOrTextFlag:false,genderFlag:true,
                                        loadingFlag:false,email:'',password:'',registrationFlag:false})


    useEffect(()=>{
        firebase.auth().signOut();
    },[])




    const tryToLogIn=async():Promise<void>=>{
        dispatch({type:"setError",payload:''});
        dispatch({type:"setLoading"})
        await firebase.auth().signInWithEmailAndPassword(state.email,state.password)
            .then(()=>dispatch({type:"authetificationSuccess"}))
            .then(()=>props.navigation.navigate('App'))
            .catch(()=>dispatch({type:"authenticationFailed",payload:"Authentification Failed"}))
    }
    
    
    const addToFirebase=():void=>{
        firebase.database().ref('BMI/'+firebase.auth().currentUser?.uid).set({
            uid:firebase.auth().currentUser?.uid,
            age:state.age,
            gender:state.genderFlag,
            weight:0,
            height:0
        }) 
    }
    const tryToRegister=async():Promise<void>=>{
        dispatch({type:"setError",payload:''});
        dispatch({type:"setLoading"});
        await firebase.auth().createUserWithEmailAndPassword(state.email,state.password)
        .then(()=>dispatch({type:"authetificationSuccess"}))
        .then(()=>addToFirebase())
        .then(()=>props.navigation.navigate('App'))
        .catch(()=>dispatch({type:"authenticationFailed",payload:'Authentification Failed'}));
    }
    //checking which icon is pressed
    const checkedM=():JSX.Element | undefined=>{
        if(state.genderFlag)
        return(<View><FontAwesome name="check-circle" size={20}/></View>)
    }
    const checkedF=():JSX.Element | undefined=>{
        if(!state.genderFlag)
        return(<View><FontAwesome name="check-circle" size={20}/></View>)
    }
    const checkFlag=():JSX.Element | undefined=>{
        return(state.iconOrTextFlag ?
        <TouchableOpacity onPress={()=>{dispatch({type:"setRegistrationFlag"});dispatch({type:"iconOrText"})}}>
            <FontAwesome name="hand-o-left" size={50}/>
        </TouchableOpacity>
        :
        <View>
            <TouchableOpacity onPress={()=>{dispatch({type:"setRegistrationFlag"});dispatch({type:"iconOrText"})}}>
                <Text style={styles.textStyle}>Don't have an account?</Text>
            </TouchableOpacity>
        </View>)
    }
    const showButton=():JSX.Element | undefined=>{
        if(!state.registrationFlag){
            return(state.loadingFlag?
                    <View><Spinner size={30}/></View>
                    :
                    <View style={{...position.positionCenterColumn,marginTop:20}}>
                        <TouchableOpacity onPress={()=>tryToLogIn()}>
                            <Text style={styles.registerAndLogInStyle}>Log In</Text>
                        </TouchableOpacity>
                    </View>)
        }
        else{
            return(state.loadingFlag?
                    <View><Spinner size={30}/></View>
                    :
                    <View>
                        <Reinput icon={<MaterialCommunityIcons name="calendar-month-outline" size={30}/>} activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17}
                        label="Age" onChangeText={(age:string)=>dispatch({type:"setAge",payload:age})}/>
                        <View style={styles.genderContainer}>
                            <View>
                                <TouchableOpacity onPress={()=>dispatch({type:"setChecked"})}>
                                        <FontAwesome name="male" size={30}/>
                                </TouchableOpacity>
                                {checkedM()}
                            </View>
                                <Text style={styles.orStyle}>or</Text>
                            <View>
                                <TouchableOpacity onPress={()=>dispatch({type:"setChecked"})}>
                                    <FontAwesome name="female" size={30}/>
                                </TouchableOpacity>
                                {checkedF()}
                            </View>
                        </View>
                        <View style={{...position.positionCenterColumn,marginTop:20}}>
                            <TouchableOpacity onPress={()=>tryToRegister()}>
                                <Text style={styles.registerAndLogInStyle}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
    }
    const text=()=>{
        return(<View><Text>Ovo je nekakav tekst</Text></View>)
    }
    return(<View style={position.container}>
            <Header name="Health Calculator" navigation={props.navigation} icon={false} backgroundColor="#2e8b57"/>
            <View>
                <Reinput icon={<MaterialCommunityIcons name="email" size={30}/>} label='Email'
                 activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17}
                    onChangeText={(email:string)=>dispatch({type:"setEmail",payload:email})}/>

                <Reinput icon={<MaterialCommunityIcons name="account-key" size={30}/>} secureTextEntry={true} label='Password'
                 activeColor='#2e8b57' fontFamily='Karla-Bold'fontSize={17} 
                 onChangeText={(password:string)=>dispatch({type:"setPassword",payload:password})}/>

                {showButton()}

                <View style={{...position.positionCenterColumn,marginTop:10}}>
                    <Text style={styles.errorStyle}>{state.error}</Text>
                </View>
                
                <View style={{...position.positionCenterColumn,marginTop:40,padding:20}}>
                    {checkFlag()}
                </View>
               
            </View>
        </View>)
}
const styles=StyleSheet.create({
    textStyle:{
        fontSize:16,
        fontFamily:'Karla-Bold',
        color:'#000000'
    },
    errorStyle:{
        color:'red',
        fontFamily:'Karla-Bold',
        fontSize:15
    },
    registerAndLogInStyle:{
        fontSize:20,
        fontFamily:'Karla-Bold',
        color:'green'
    },
    orStyle:{
        fontSize:20,
        fontFamily:'Fondamento-Regular'
    },
    genderContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    }
})
export default LogInScreen;