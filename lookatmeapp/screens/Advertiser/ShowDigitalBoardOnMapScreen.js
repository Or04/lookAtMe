import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'



class ShowDigitalBoardOnMapScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            error: false,
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.error ? <Error errorText={this.state.error} /> : null}
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ width: '100%', height: '100%' }}
                        initialRegion={this.props.navigation.getParam('point')}
                        showsUserLocation={true}
                    >
                        <Marker
                            coordinate={this.props.navigation.getParam('point')}
                        />
                    </MapView>
                </View>
            </View>
        )
    }
}




ShowDigitalBoardOnMapScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'לוח דיגיטלי',
        headerStyle: {
            backgroundColor: Colors.header,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
    }
}






const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    logIn: {
        padding: 30,
        marginTop: 100,
        borderWidth: 0,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
        height: '50%',
    }
})


export default ShowDigitalBoardOnMapScreen