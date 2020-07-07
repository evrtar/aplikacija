import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Header,Left,Body,} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
interface IProps {
    navigation:any;
    name:string;
    icon:boolean;
    backgroundColor:string;
}
const HeaderF=(props:IProps):JSX.Element=>{
    
    const showIcon=():JSX.Element|undefined=>{
        if(props.icon){
            return(<Left>
               <Icon name="bars" size={30} color={'white'}  onPress={()=>props.navigation.openDrawer()}/>
            </Left>)
        }
    }
    return(
        <View >
            <Header androidStatusBarColor='#000000' style={{backgroundColor:props.backgroundColor}} >
                <View style={{marginTop:10}}>
                {showIcon()}
                </View>
                <View style={{marginTop:10,flex:1}}>
                <Body>
                <View style={styles.container}>
                    <Text style={styles.bodyStyle}>{props.name}</Text>
                    </View>
                </Body>
                </View>
            </Header>
        </View>
    )
}
const styles=StyleSheet.create({
    bodyStyle:{
        fontSize:20,
        color:'white',
        fontFamily:"Fondamento-Regular"
    },
    headerStyle:{
        backgroundColor:'#2e8b57',
        
    },
    container:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    }
})

export default HeaderF;