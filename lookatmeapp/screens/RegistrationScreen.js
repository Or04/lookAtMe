//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, KeyboardAvoidingView, Image, Platform } from 'react-native'
import Colors from '../constants/Colors'
import Error from '../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../modules/ServerApi'
import User from '../components/User'
import Input from '../components/Input'
import InputTypes from '../constants/InputTypes'
import logoapp from '../assets/logoapp.png'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'





export default class RegistrationScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            firstNameText: '',
            lastNameText: '',
            error: false,
            waiting: false,
            focus: false
        }

        this.mountFlag = true
        Keyboard.addListener('keyboardDidHide', () => {
            if (this.mountFlag) {
                this.setState({
                    focus: false
                })
            }
        })

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {

    }

    updateFirstNameHandler(input) {
        this.setState({ firstNameText: input })
    }

    updateLastNameHandler(input) {
        this.setState({ lastNameText: input })
    }


    userRegistrationHandler = async () => {

        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        error: false
                    }))
                })
            }
            this.emailInput.getText()
            this.firstNameInput.getText()
            this.lastNameInput.getText()
            this.passwordInput.getText()
            this.passwordValidatorInput.getText()

            if (this.emailInput.getText() && this.firstNameInput.getText() && this.lastNameInput.getText() && this.passwordInput.getText() && this.passwordValidatorInput.getText()) {
                if (this.passwordInput.getText() == this.passwordValidatorInput.getText()) {
                    this.props.navigation.navigate({
                        routeName: 'RegistrationSelectCity',
                        params: {
                            userInfo: {
                                email: this.emailInput.getText(),
                                firstName: this.firstNameInput.getText(),
                                lastName: this.lastNameInput.getText(),
                                password: this.passwordInput.getText()
                            }
                        }
                    })
                } else {
                    throw 'ססמאות לא זהות'
                }
            } else {
                throw 'בעיה בקלט'
            }



        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    waiting: false
                })
            }
        }
    }

    textInputFocus = (type, event) => {

        if (typeof event.dispatchConfig.phasedRegistrationNames.bubbled != 'undefined') {
            if (event.dispatchConfig.phasedRegistrationNames.bubbled == 'onFocus') {
                this.setState({
                    focus: type
                })
            } else if (event.dispatchConfig.phasedRegistrationNames.bubbled == 'onBlur') {
                this.setState({
                    focus: false
                })
            }
        }
    }



    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss()
            }}>

                <View
                    style={styles.wrapper}
                >

                    <View
                        style={styles.topColor}
                    />

                    <View style={this.state.focus ? { ...styles.registrationBox, marginTop: 5 } : styles.registrationBox}>



                        <View style={this.state.focus ?
                            (this.state.focus == 'emailInput' ? { ...styles.inputBox, marginTop: 0 } : { display: 'none' }) :
                            { ...styles.inputBox, marginTop: 0 }}>

                            <Input ref={(emailInput) => this.emailInput = emailInput} type={InputTypes.EMAIL}
                                root={this}
                                placeholder={'הכנס מייל'}
                                color={'#c3c3b1'}
                                textInputFocus={this.textInputFocus.bind(this, 'emailInput')}
                                direction={'rtl'}
                                underLine={true}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <FontAwesome5 name={'envelope-open'} size={20} />
                            </View>
                        </View>



                        <View style={styles.inputBox} style={this.state.focus ?
                            ((this.state.focus == 'firstNameInput' || this.state.focus == 'emailInput') ? styles.inputBox : { display: 'none' }) :
                            styles.inputBox}
                        >
                            <Input
                                ref={(firstNameInput) => this.firstNameInput = firstNameInput}
                                type={InputTypes.TEXT}
                                root={this}
                                placeholder='הכנס שם פרטי'
                                color={'#c3c3b1'}
                                textInputFocus={this.textInputFocus.bind(this, 'firstNameInput')}
                                underLine={true}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <FontAwesome5 name={'user'} size={20} />
                            </View>
                        </View>
                        <View style={styles.inputBox} style={this.state.focus ?
                            ((this.state.focus == 'lastNameInput' || this.state.focus == 'firstNameInput') ? styles.inputBox : { display: 'none' }) :
                            styles.inputBox}>
                            <Input
                                ref={(lastNameInput) => this.lastNameInput = lastNameInput}
                                type={InputTypes.TEXT}
                                root={this}
                                placeholder='הכנס שם משפחה'
                                color={'#c3c3b1'}
                                textInputFocus={this.textInputFocus.bind(this, 'lastNameInput')}
                                underLine={true}
                            />

                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <FontAwesome5 name={'user'} size={20} />
                            </View>
                        </View>
                        <View style={styles.inputBox} style={this.state.focus ?
                            ((this.state.focus == 'passwordInput' || this.state.focus == 'lastNameInput') ? styles.inputBox : { display: 'none' }) :
                            styles.inputBox}>

                            <Input
                                ref={(passwordInput) => this.passwordInput = passwordInput}
                                type={InputTypes.PASSWORD}
                                root={this}
                                placeholder='הכנס סיסמא'
                                color={'#c3c3b1'}
                                textInputFocus={this.textInputFocus.bind(this, 'passwordInput')}
                                underLine={true}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <FontAwesome5 name={'key'} size={20} />
                            </View>
                        </View>



                        <View style={styles.inputBox} style={this.state.focus ?
                            ((this.state.focus == 'passwordValidatorInput' || this.state.focus == 'passwordInput') ? styles.inputBox : { display: 'none' }) :
                            styles.inputBox} >
                            <Input
                                ref={(passwordValidatorInput) => this.passwordValidatorInput = passwordValidatorInput}
                                root={this}
                                type={InputTypes.PASSWORD}
                                placeholder='הכנס סיסמא שוב'
                                color={'#c3c3b1'}
                                textInputFocus={this.textInputFocus.bind(this, 'passwordValidatorInput')}
                                underLine={true}
                            />

                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                <FontAwesome5 name={'key'} size={20} />
                            </View>
                        </View>

                        {
                            this.state.waiting ?
                                <ActivityIndicator size="large" color="#c3c3b1" />
                                :
                                <TouchableOpacity onPress={this.userRegistrationHandler}>
                                    <View style={styles.submitButton}>


                                        <Text>הירשם</Text>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <FontAwesome5 name={'check-circle'} size={20} />
                                        </View>



                                    </View>
                                </TouchableOpacity>
                        }

                    </View>

                </View>

            </TouchableWithoutFeedback >

        )
    }

}


RegistrationScreen.navigationOptions = (data) => {
    return {
        headerShown: true,
        headerTitle: 'הרשמה',
        headerBackTitleVisible: false,
        headerStyle: {
            backgroundColor: Colors.header,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center',


    }
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#ffffff'
    },
    registrationBox: {
        position: 'absolute',
        borderWidth: 0,
        backgroundColor: Colors.appColor,
        borderRadius: 20,
        marginTop: Dimensions.get('window').height * 0.10,
        backgroundColor: '#fff',
        flexDirection: 'column',
        width: Dimensions.get('window').width * 0.9,
        paddingVertical: 30,
        alignItems: 'center'
    },
    input: {
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10,
    },
    submitButton: {
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    registrationButtonBox: {
        marginTop: 10
    },
    inputBox: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 20,
        width: Dimensions.get('window').width * 0.6,
        justifyContent: 'space-between',
        flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse',

    },
    topColor: {
        height: Dimensions.get('window').height * 0.55,
        width: '100%',
        backgroundColor: Colors.appColor,
        position: 'relative'

    }
})