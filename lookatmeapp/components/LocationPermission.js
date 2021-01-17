import React from 'react'
import { View, Text, Button, StyleSheet, Platform } from 'react-native'
import timer from '../modules/timer'
import Error from './Error'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'




class LocationPermission extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    askLocationPermission = async () => {
        await this.props.askLocationPermissions()
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.premissionBox}>
                    <View style={styles.text}>
                        <Text>הרשאת מיקום</Text>
                    </View>
                    <View

                    >
                        {this.props.status ?
                            <FontAwesome5
                                name={'toggle-on'}
                                size={20}
                                solid
                            />
                            :
                            <TouchableOpacity
                                onPress={this.askLocationPermission}
                            >
                                <FontAwesome5
                                    name={'toggle-off'}
                                    size={20}
                                    solid
                                />

                            </TouchableOpacity>

                        }
                    </View>
                </View>
                {this.props.status ?
                    <View style={styles.sendLocationBox}>
                        <View style={styles.text}>
                            <Text>שלח מיקום</Text>
                        </View>
                        <View style={styles.button}>
                            {this.props.sendLocationStatus ?

                                <TouchableOpacity
                                    onPress={this.props.disableSendLocation}
                                >
                                    <FontAwesome5
                                        name={'toggle-on'}
                                        size={20}
                                        solid
                                    />

                                </TouchableOpacity>
                                :

                                <TouchableOpacity
                                    onPress={this.props.activeSendLocation}
                                >
                                    <FontAwesome5
                                        name={'toggle-off'}
                                        size={20}
                                        solid
                                    />

                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                    :
                    null

                }

                <View>
                    {this.state.error ? <Error errorText={this.state.error} /> : null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10
    },
    text: {
        flex: 2,
        alignItems: Platform.OS == 'ios' ? 'flex-start' : 'flex-end',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    premissionBox: {
        width: '100%',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'center',
        marginBottom: 5

    },
    sendLocationBox: {
        width: '100%',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'space-around',
    }

})


export default LocationPermission