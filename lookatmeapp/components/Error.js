import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Colors from '../constants/Colors'





export default class Wating extends React.Component{
    render(){
        return(
            <View style={styles.error}>
                <Text >{this.props.errorText}</Text>
            </View>
        )
    }
}


const styles=StyleSheet.create({
    error:{
        width:'100%',
        height:40,
        justifyContent:'center',
        borderWidth:2,
        borderColor:Colors.error,
        alignItems:'center',
        borderRadius:3
    }
})