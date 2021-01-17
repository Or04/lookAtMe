//setstate 
import React from 'react'
import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class MenuObject extends React.Component {
    constructor() {
        super()

        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                if (this.mountFlag) {
                    this.props.app.setState({ menuOption: this.props.menuOption })
                }
            }}>
                {typeof this.props.iconName != 'undefined' ?
                    <FontAwesome5
                        name={this.props.iconName}
                        size={20}
                        solid
                        color={this.props.app.state.menuOption == this.props.menuOption ? 'black':'#c3c3b1'}
                    />
                    :
                    <View style={styles.menuOptionBox} style={this.props.app.state.menuOption == this.props.menuOption ? { ...styles.menuOptionBox, borderColor: Colors.selected } : { ...styles.menuOptionBox }}>
                        <Text>{this.props.text}</Text>
                    </View>}

            </TouchableWithoutFeedback>
        )
    }
}



const styles = StyleSheet.create({
    menuOptionBox: {
        flex: 1,
        borderWidth: 1,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor: Colors.menuOpion,
        borderColor: '#00000050',
        justifyContent: 'center',
        alignItems: 'center'
    }
})