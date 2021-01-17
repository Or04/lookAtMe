//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView, Image, Dimensions, KeyboardAvoidingView } from 'react-native'
import Input from '../components/Input'
import InputTypes from '../constants/InputTypes'
import Navigation from '../constants/Navigation'
import Colors from '../constants/Colors'
import Error from '../components/Error'
import MenuOption from '../constants/MenuOption'
import ServerApi from '../modules/ServerApi'
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Validator from '../node_modules/validator'
import { LinearGradient } from 'expo-linear-gradient';






class LogInScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
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

    textInputFocus = (event) => {
        if (typeof event.dispatchConfig.phasedRegistrationNames.bubbled != 'undefined') {
            if (event.dispatchConfig.phasedRegistrationNames.bubbled == 'onFocus') {
                this.setState({
                    focus: true
                })
            } else if (event.dispatchConfig.phasedRegistrationNames.bubbled == 'onBlur') {
                this.setState({
                    focus: false
                })
            }
        }
    }
    componentWillUnmount() {
        this.mountFlag = false
    }
    async componentDidUpdate() {

    }
    findLogInUser = async () => {
        try {
            let fileResponed = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}/user`)

            if (Validator.isEmail(fileResponed)) {
                let userTypeResponsed = await ServerApi.userType(fileResponed)
                if (this.mountFlag) {
                    this.props.screenProps.connectUser(fileResponed)

                }
            }
        } catch (error) {

            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {

                if (this.mountFlag) {
                    this.setState({
                        error: 'בעיית חיבור',
                        waiting: false
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString(),
                        waiting: false
                    })
                }

            }


        }
    }


    componentDidMount() {
        this.findLogInUser()
    }

    logIn = async () => {
        if (this.mountFlag && !this.state.waiting) {
            await new Promise(resolved => {
                this.setState({
                    waiting: true
                }, () => resolved())
            })
        }


        try {
            if (this.emailInput.getText() && this.passwordInput.getText()) {
                let logInResponsed = await ServerApi.logIn(this.passwordInput.getText(), this.emailInput.getText())
                let fileResponed = await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}/user`, this.emailInput.getText())



                if (this.mountFlag) {
                    this.props.screenProps.connectUser(logInResponsed)
                }

            } else {
                this.emailInput.endEditingHandler()
                this.passwordInput.endEditingHandler()
                if (this.mountFlag) {
                    await new Promise((resolved, reject) => {
                        this.setState({
                            waiting: false
                        }, () => resolved())
                    })
                }
            }


        } catch (error) {
            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {
                if (this.mountFlag) {
                    this.setState({
                        error: 'בעיית חיבור',
                        waiting: false
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString(),
                        waiting: false
                    })
                }

            }

        }
    }

    render() {
        return (

            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss()
                this.setState({
                    focus: false
                })
            }}>


                <View style={styles.wrapper}>

                    <View
                        style={styles.topColor}
                    />

                    <View style={this.state.focus ? { ...styles.logInBox, display: 'none' } : styles.logoBox}>
                        <Image source={require('../assets/lookatmelogogreen.jpeg')} style={styles.logo} />
                    </View>
                    <View
                        style={this.state.focus ? { ...styles.logIn, marginTop: 40 } : styles.logIn}
                    >

                        <View style={styles.inputBox}>
                            <View style={{ ...styles.Input, marginTop: 0 }}>

                                <Input
                                    ref={(emailInput) => this.emailInput = emailInput}
                                    type={InputTypes.EMAIL}
                                    placeholder='הכנס מייל'
                                    textInputFocus={this.textInputFocus}
                                />
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                    <FontAwesome5 name={'envelope-open'} size={20} />
                                </View>
                            </View>
                        </View>


                        <View style={styles.inputBox}>


                            <View style={styles.Input}>
                                <Input ref={(passwordInput) => this.passwordInput = passwordInput} textInputFocus={this.textInputFocus} type={InputTypes.PASSWORD} placeholder='הכנס סיסמא' color={'#c3c3b1'} />
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                    <FontAwesome5 name={'key'} size={20} />
                                </View>

                            </View>
                        </View>
                        <View style={styles.inputBox}>
                            <View style={styles.Input}>
                                {this.state.error ? <Error errorText={this.state.error} /> : null}

                            </View>
                        </View>


                        <View style={styles.logInBox}>



                            {this.state.waiting ?
                                <View style={{ flex: 1 }}><ActivityIndicator size="large" color="#c3c3b1" /></View>
                                :
                                <View style={styles.logInButton}><Button onPress={this.logIn} title='התחבר' color={'#c3c3b1'} /></View>}

                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, paddingHorizontal: 20 }}>

                            <View style={{ flex: 1, backgroundColor: 'white' }}></View>
                            <Text>או</Text>

                            <View style={{ flex: 1, backgroundColor: 'white' }}></View>
                        </View>



                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.navigate({
                                    routeName: 'Registration',
                                    params: {
                                    },
                                })
                            }}>
                            <View style={styles.signUp} >
                                <Text style={{ color: 'black', fontWeight: '200', }}>הרשמה</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </View>


            </TouchableWithoutFeedback>



        )

    }
}

LogInScreen.navigationOptions = (data) => {
    return {
        headerTitle: '',
        headerStyle: {
            backgroundColor: Colors.appColor,


        },
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShown: false
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
    logIn: {
        position: 'absolute',
        borderWidth: 0,
        backgroundColor: Colors.appColor,
        borderRadius: 20,
        marginTop: Dimensions.get('window').height * 0.3,
        backgroundColor: '#fff',
        flexDirection: 'column',
        width: Dimensions.get('window').width * 0.9,
        paddingVertical: 30
    },
    Input: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 20,
        width: Dimensions.get('window').width * 0.5,
        justifyContent: 'space-between',
        flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse',

    },
    logoBox: {
        marginTop: Dimensions.get('window').height * 0.1,
        flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'center',
        position: 'absolute',

    },
    logo: {
        width: Dimensions.get('window').width * 0.7,
        height: (Dimensions.get('window').width * 0.7) * (60 / 250),
    },
    inputBox: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    logInButton: {
        width: '70%',
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
    },
    logInBox: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signUp: {
        flexDirection: 'row',
        justifyContent: 'center',
        color: 'black',
        marginTop: 20

    },
    topColor: {
        height: Dimensions.get('window').height * 0.50,
        width: '100%',
        backgroundColor: Colors.appColor,
        position: 'relative'

    }

})





export default LogInScreen