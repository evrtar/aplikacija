import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';
interface IProps{
    value:number;
    unfiledColor:string;
    color:string;
    fill:string;
    title:string;
    marginLeft:number;
}
const ProgressCircle=(props:IProps):JSX.Element=>{
    return(
    <View>
        <Progress.Circle size={70} textStyle={{color:'white'}} color={props.color} unfilledColor={props.unfiledColor} fill={props.fill} showsText={true} formatText={()=>props.value}	/>
        <Text style={{...styles.progressTextStyle,marginLeft:props.marginLeft}}>{props.title}</Text>
    </View>)
}
const styles=StyleSheet.create({
    progressTextStyle:{
        fontSize:18,
        fontFamily:'Karla-Bold'
    }
})
export default ProgressCircle;