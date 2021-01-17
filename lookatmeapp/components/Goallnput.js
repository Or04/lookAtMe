import React from 'react'
import {View,Text,StyleSheet, Button} from 'react-native';



export default GoalInput=props=>{

    


    return (
        <View style={{padding:10,borderWidth:1,marginTop:5,marginBottom:5}}>
            <Text>{props.children.item.value}</Text>
            <Button title='Delete' onPress={props.removeText.bind(null,props.children.index)}/>
        </View>
    )
}






const styles = StyleSheet.create({

})