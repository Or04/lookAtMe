//setstate clear
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import ServerApi from '../modules/ServerApi'
import Error from '../components/Error'
import Colors from '../constants/Colors'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class User extends React.Component {
    constructor() {
        super()
        this.state = {
            updateWaiting: false,
            deleteWaiting: false,
            delete: false,
            error: false,
            premiumStatus: false,
            makeSureDelete: false,
            update: false


        }
        this.mountFlag = true
    }

    componentDidMount() {
        this.setState({
            premiumStatus: this.props.info.premium
        })
    }


    updatePremiumHandler = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(
                        this.setState({
                            updateWaiting: true
                        })
                    )
                })
            }
            let updatePremiumResponsed = await ServerApi.updatePremium(this.props.info.email)

            if (this.mountFlag && updatePremiumResponsed.length > 0) {
                this.setState({
                    premiumStatus: updatePremiumResponsed[0].premium,
                    updateWaiting: false
                })
            }
        } catch (error) {
            if (this.mountFlag) {

                this.setState({
                    error: error.toString(),
                    updateWaiting: false
                })

            }
        }
    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    deleteUserHandler = async () => {
        try {
            new Promise((resolved, reject) => {
                resolved(this.setState({
                    deleteWaiting: true
                }))
            })
            let deleteUserResponsed = await ServerApi.deleteUser(this.props.info.email)
            this.props.root.renderAllUsers()
        } catch (error) {
            this.setState({
                error: error.toString(),
                deleteWaiting: false
            })
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={styles.wrapper}>

                    <View style={styles.user}>
                        <Text style={{ fontWeight: 'bold' }}>שם:<Text style={{ fontWeight: 'normal' }}>{this.props.info.firstName + ' ' + this.props.info.lastName}</Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>מייל:<Text style={{ fontWeight: 'normal' }}>{this.props.info.email}</Text></Text>
                        <Text style={{ fontWeight: 'bold' }}>סטטוס:
                            {this.state.premiumStatus ?
                                <Text style={{ color: Colors.green, fontWeight: 'normal' }}>מובחר</Text>
                                :
                                <Text style={{ color: Colors.red, fontWeight: 'normal' }}>לא מובחר</Text>
                            }

                        </Text>



                    </View>
                    <View style={{ flex: 1, marginHorizontal: 5, justifyContent: 'center', position: 'absolute', top: 10, left: 5 }}>
                        {this.state.update ?
                            <TouchableOpacity
                                onPress={() => this.setState({ update: false })}
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                            >
                                <FontAwesome5 name={'times-circle'} size={20} solid />

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.setState({ update: true })}
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                            >
                                <FontAwesome5 name={'edit'} size={20} solid />

                            </TouchableOpacity>
                        }
                    </View>
                    {this.state.update ?
                        <View style={styles.update}>
                            <View style={{ flex: 1, marginHorizontal: 4, justifyContent: 'center', }}>
                                {this.state.updateWaiting ?
                                    <View><ActivityIndicator size="small" color="#c3c3b1" /></View>
                                    :
                                    this.state.premiumStatus ?
                                        <TouchableOpacity
                                            onPress={this.updatePremiumHandler.bind(this, false)}
                                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}
                                        >
                                            <Text style={{ color: 'red' }}>לא מובחר</Text>

                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            onPress={this.updatePremiumHandler.bind(this, true)}
                                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}
                                        >
                                            <Text style={{ color: 'green' }}>מובחר</Text>

                                        </TouchableOpacity>
                                }
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 4, justifyContent: 'center' }}>
                                {this.state.makeSureDelete ?
                                    <View style={{ flexDirection: 'row', flex: 1, }}>
                                      
                                        <TouchableOpacity
                                            onPress={this.deleteUserHandler}
                                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}
                                        >
                                            <Text style={{ color: 'red' }}>מחק</Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ makeSureDelete: false })}
                                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}
                                        >
                                            <Text style={{ color: 'green' }}>ביטול</Text>

                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ makeSureDelete: true })}
                                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                                    >
                                        <Text style={{ color: 'red' }}>מחק משתמש</Text>

                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                        :
                        null
                    }

                    {this.state.error ? <Error errorText={this.state.error} /> : null}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        position: 'relative',
        width: '100%'
    },
    user: {

        alignItems: Platform.OS == 'ios' ? 'flex-start' : 'flex-end',
        width: '100%'
    },
    update: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 2,
        marginTop: 5,
        flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row'
    },
})