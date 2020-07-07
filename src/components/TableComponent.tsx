import React from 'react';
import {View,StyleSheet} from 'react-native';
import { Table,Row,Rows } from 'react-native-table-component';
interface IProps{
    tableHead:string[];
    tableData:string[][];
}
const TableComponent=(props:IProps):JSX.Element=>{
    return(<View style={styles.containerStyle}>
    <Table borderStyle={styles.tableStyle}>
        <Row textStyle={styles.textStyle} data={props.tableHead}/>
        <Rows textStyle={styles.textStyle} data={props.tableData}/>
    </Table>
    </View>)
}
const styles=StyleSheet.create({
    textStyle:{
        marginLeft:20,
        fontFamily:'Karla-Regular',
        fontSize:16,
        color:'#000000'
    },
    containerStyle:{
        backgroundColor:'white',
        margin:"4%"
    },
    tableStyle:{
        borderWidth: 3,
        borderColor: '#228b22'
    }

})
export default TableComponent;