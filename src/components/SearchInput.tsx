import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View,TextInput,StyleSheet,TouchableOpacity,Text} from 'react-native';
interface IProps{
    name:string;
    value:string;
    placeholder:string;
    onChangeText?: (text: string) => void;
    onPress?:()=>void;
}
const SearchInput=(props:IProps):JSX.Element=>{
    return(<View style={styles.containerStyle}>
            <TouchableOpacity onPress={props.onPress}>
                <MaterialCommunityIcons style={styles.iconStyle} name={props.name} size={30}/>
                </TouchableOpacity>
        <TextInput
            autoCorrect={false}
            placeholder={props.placeholder}
            style={styles.inputStyle}
            value={props.value}
            onChangeText={props.onChangeText}/>
    </View>)
}
const styles=StyleSheet.create({
    iconStyle:{
        paddingLeft:20,
        flex:1,
        fontFamily:'Fondamento-Regular',
        color:'#000000'
    },
    inputStyle:{
        color:'#000000',
        paddingRight:5,
        paddingLeft:5,
        fontSize:19,
        lineHeight:23,
        flex:2,
    },
    containerStyle:{
        height:40,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    }
})
export default SearchInput;