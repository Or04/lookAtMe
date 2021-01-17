import React from 'react'
import {View,Text,StyleSheet} from 'react-native'



export default class Header extends React.Component{
    constructor(){
        super()
    }


    render(){
        return(
            <View style={styles.headerWrapper}>
                <Text >this is header</Text>
            </View>

        )
    }
}




const styles=StyleSheet.create({
    headerWrapper:{
        width:'100%',
        height:50,
        alignItems:'center',
        justifyContent:'center'

    }




})