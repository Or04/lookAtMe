import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import UserType from '../constants/Usertype'
import Colors from '../constants/Colors'







export default class UserTypeObject extends React.Component {
    constructor() {
        super()
        this.state = {
            userType: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }



    componentDidMount() {

        this.setState({
            userType: this.props.item.key == 'administrator' ? UserType.ADMINISTRATOR : this.props.item.key == 'advertiser' ? UserType.ADVERTISER : this.props.item.key == 'consumer' ? UserType.CONSUMER : false
        })

    }

    render() {
        if (typeof this.props.item.key != 'undefined') {
            return (
                <TouchableWithoutFeedback onPress={() => {
                    if (this.mountFlag) {
                        this.props.root.props.screenProps.app.setState({
                            userType: this.state.userType
                        })
                    }
                }

                }>

                    <View 
                    
                    style={this.props.root.props.screenProps.app.state.userType == this.state.userType ? { ...styles.wrapper, ...this.props.style, borderColor: Colors.selected,borderWidth:2 } : { ...styles.wrapper, ...this.props.style }}
                    
                    >
                        <Text>{this.props.item.value}</Text>
                        <Image
                            style={styles.userIcon}
                            resizeMode={'contain'}
                            source={
                                this.state.userType == 1 ? require('../assets/administratorUser.png') : this.state.userType == 2 ? require('../assets/advertiserUser.png') : require('../assets/consumerUser.png')
                            }
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

}



const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7fffd4',
        width: '30%',
        marginHorizontal:3
    },
    userIcon: {
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2
    }


})