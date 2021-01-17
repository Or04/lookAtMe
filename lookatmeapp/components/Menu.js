import React from 'react'
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import UserType from '../constants/Usertype'
import MenuOption from '../constants/MenuOption'
import MenuObject from '../components/MenuObject'





export default class Menu extends React.Component {
    constructor() {
        super()
    }


    componentDidMount() {



    }


    render() {

        if (!this.props.isConnected && !this.props.userEmail) {
            return <View style={styles.wrapper}></View>
        } else if (this.props.isConnected && this.props.userEmail && !this.props.userType) {
            return (
                <View style={styles.wrapper}>

                </View>
            )
        } else if (this.props.app.state.isConnected && this.props.app.state.userEmail && this.props.app.state.userType) {
            if (this.props.app.state.userType == UserType.ADMINISTRATOR) {
                return (
                    <View style={styles.wrapper}>
                        <MenuObject
                            iconName={'user'} text={'משתמש'} menuOption={MenuOption.USERINFO} app={this.props.app}
                        />
                        <MenuObject

                            iconName={'tags'}
                            text={'קטגוריות'} menuOption={MenuOption.CATEGORIES} app={this.props.app} />
                        <MenuObject
                            iconName={'desktop'} text={'לוחות'} menuOption={MenuOption.DIGITALBOARDS} app={this.props.app} />
                        <MenuObject
                            iconName={'city'}
                            text={'ערים'} menuOption={MenuOption.CITIES} app={this.props.app} />
                        <MenuObject
                            iconName={'users-cog'} text={'מובחר'} menuOption={MenuOption.PREMIUM} app={this.props.app} />
                    </View>
                )
            } else if (this.props.app.state.userType == UserType.CONSUMER) {
                return (
                    <View style={styles.wrapper}>
                        <MenuObject iconName={'user'} text={'משתמש'} menuOption={MenuOption.USERINFO} app={this.props.app} />
                        <MenuObject iconName={'search'} text={'חיפוש'} menuOption={MenuOption.SEARCHADVERTISEMENTS} app={this.props.app} />
                        <MenuObject iconName={'adversal'} text={'מודעות שלי'} menuOption={MenuOption.CONSUMERADVERTISEMENTS} app={this.props.app} />
                    </View>
                )
            } else if (this.props.app.state.userType == UserType.ADVERTISER) {
                return (
                    <View style={styles.wrapper}>
                        <MenuObject iconName={'user'} text={'משתמש'} menuOption={MenuOption.USERINFO} app={this.props.app} />

                        <MenuObject iconName={'ad'} text={'מודעות'} menuOption={MenuOption.ADVERTISERADVERTISEMENTS} app={this.props.app} />
                    </View>
                )
            }
        } else {
            return (
                <View style={styles.wrapper}>
                    <TouchableWithoutFeedback>
                        <View style={styles.menuOptionBox}></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.menuOptionBox}></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.menuOptionBox}></View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 70,
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'space-evenly',
        paddingHorizontal: 15,
        paddingBottom: 4,
        alignItems:'center',
        borderTopWidth:1,
        borderTopColor:'gray'
    },
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