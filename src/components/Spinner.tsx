import React from 'react';
import {View, ActivityIndicator,StyleSheet} from 'react-native';
interface IProps{
    size:number;
}
const Spinner = (props:IProps):JSX.Element=>{
    return(
        <View style={styles.spinnerStyle}>
            <ActivityIndicator size={props.size} color={'#000000'}/>
        </View>
    )
}
const styles = StyleSheet.create({
    spinnerStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default Spinner;