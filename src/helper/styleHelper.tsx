import {StyleSheet} from 'react-native';
export const position=StyleSheet.create({
    positionCenter:{
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
    },
    positionCenterColumn:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column'
    },
    container:{
        flex:1,
        backgroundColor:'#fffafa'
    },
})
export const textStyle=StyleSheet.create({
    titleStyle:{
        fontSize:19,
        fontFamily:'Karla-Regular',
      }
})