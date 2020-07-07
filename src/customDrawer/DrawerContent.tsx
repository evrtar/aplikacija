import React,{ useEffect,useState } from 'react';
import {View,StyleSheet,Text,Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import firebase from 'firebase';
import {DrawerItem} from '@react-navigation/drawer';
interface IProps{
    navigation:any;
}
interface IState{
    email:string;
    uri:string;
}
const DrawerContent=(props:IProps):JSX.Element=>{
    const [user,setUser] = useState<IState>({email:'user@gmail.com',uri:'https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png'});
    const [itemPressed,setItemPressed] = useState<number>(0);
    
    const logOut=async():Promise<void>=>{
        await firebase.auth().signOut()
        .then(()=>setUser({email:'',uri:'not empty'}))
        .then(()=>props.navigation.closeDrawer())
    }

    useEffect(()=>{
        getGender()
    },[firebase.auth().currentUser?.email])
    const getGender=async():Promise<void>=>{
        const email:string|undefined|null=firebase.auth().currentUser?.email;
        await firebase.database().ref('BMI/'+firebase.auth().currentUser?.uid).once('value')
        .then(snap=>{
            if(snap.val()){
                let value:string=snap.val().gender
                ?
                "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
                :
                "https://www.pinclipart.com/picdir/big/167-1674167_top-causes-of-infertility-in-women-icon-design.png";
                if(email){
                    setUser({email:email,uri:value});
                }
            }
        }).catch((error)=>console.log(error))
    }

    
    const checkPressedItem=(id:number):string=>{
        return(id===itemPressed?"#228b22":"#696969");
    }
    return(
        <View style={styles.container}>
            <View style={{flex:1}}>                
                <View style={styles.container2}>
                    <Image style={{width:40,height:40}} source={{uri:user.uri}}/>
                    <Text style={{color:'#fffafa'}}>{user.email}</Text>
                </View>
            </View>

            <View style={{flex:7,backgroundColor:'#fffafa'}}>     
                <DrawerItem
                icon={({size}) =>(
                    <FontAwesome 
                    name="calculator" 
                    color={checkPressedItem(0)}
                    size={size}
                    />
                )}
                labelStyle={{ color: checkPressedItem(0),marginLeft:2,fontFamily:"Fondamento-Regular"}}
                label="BMI" 
                onPress={()=>{props.navigation.navigate('CalculatorScreen');
                setItemPressed(0)}}
                />
                <DrawerItem
                icon={({size}) => (
                    <MaterialCommunityIcons 
                    name="food" 
                    color={checkPressedItem(1)}
                    size={size}
                    />
                )}
                labelStyle={{ color: checkPressedItem(1),marginLeft:2,fontFamily:"Fondamento-Regular"}}
                label="Food" 
                onPress={()=>{props.navigation.navigate('TabViewExample');setItemPressed(1)}}
                />
                <DrawerItem
                icon={({size}) => (
                    <Octicons 
                    name="graph" 
                    color={checkPressedItem(2)}
                    size={size}
                    />
                )}
                labelStyle={{ color: checkPressedItem(2),marginLeft:2,fontFamily:"Fondamento-Regular"}}
                label="Statistic" 
                onPress={()=>{props.navigation.navigate('StatisticScreen');setItemPressed(2)}}
                />

                <View style={styles.container1}>
                <DrawerItem
                icon={({size}) => (
                    <Feather
                    name="log-out" 
                    color={checkPressedItem(4)}
                    size={size}
                    />
                )}
                labelStyle={{ color:checkPressedItem(4),marginLeft:2,fontFamily:"Fondamento-Regular"}}
                label="Log out" 
                onPress={()=>{logOut();setItemPressed(4)}}
                />
                </View>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container1:{
        position: 'absolute',
        bottom:0
    },
    container:{
        flex:1,
    },
    container2:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    }
})
export default DrawerContent;