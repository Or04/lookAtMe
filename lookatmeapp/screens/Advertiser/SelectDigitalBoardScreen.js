//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, Platform } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'



class SelectDigitalBoardScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            clickPoint: false,
            wating: false,
            error: false,
            digitalBoards: [],
            pressDigitalBoardsId: false,
            makeSureDelete: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {
        this.renderAllDigitalBoards()
    }



    renderAllDigitalBoards = async () => {
        try {
            let getAllDigitalBoardsResponsed = await ServerApi.getAllDigitalBoards(this.props.navigation.getParam('cityId'))
            if (this.mountFlag && getAllDigitalBoardsResponsed.length > 0) {
                this.setState({
                    digitalBoards: [...getAllDigitalBoardsResponsed]
                })
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    wating: false
                })
            }
        }

    }


    selectDigitalBoardClickHandler = async (event) => {
        if (this.mountFlag) {
            await new Promise((resolved, reject) => {
                resolved(this.setState({
                    pressDigitalBoardsId: parseInt(event.nativeEvent.id),
                    digitalBoards: []

                }))
            })
        }
        this.renderAllDigitalBoards()
    }

    AddDigitalBoard = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        wating: true,
                        error: false
                    }))
                })
            }


            let addDigitalBoardToAdvertisementResponed = await ServerApi.addDigitalBoardToAdvertisement(this.props.navigation.getParam('advertisement').advertisementId, this.state.pressDigitalBoardsId)
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.props.navigation.getParam('root').renderDigitalBoards())
                })
                this.props.navigation.pop()
                this.props.navigation.pop()
            }


        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    wating: false
                })
            }
        }
    }



    topSection = () => {
        if (this.state.wating) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <ActivityIndicator size="large" color="#c3c3b1" />
                </View>
            )
        } else if (this.state.pressDigitalBoardsId) {
            return (
                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <View style={{ flex: 3, alignItems: 'center' }}><Text>להוסיף לוח?</Text></View>
                    <View style={{ marginHorizontal: 10, flex: 1 }}>
                        <Button
                            title={'הבא'}
                            color={Colors.header}
                            onPress={this.AddDigitalBoard}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.topSection()}
                {this.state.error ? <Error errorText={this.state.error} /> : null}
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ width: '100%', height: '100%' }}
                        initialRegion={this.props.navigation.getParam('point')}
                        showsUserLocation={true}
                    >
                        {this.state.clickPoint ? <Marker pinColor={Colors.header} coordinate={this.state.clickPoint} /> : null}
                        {this.state.digitalBoards.map((mapItem) => {
                            return (
                                <Marker
                                    pinColor={(this.state.pressDigitalBoardsId == mapItem.id) ? 'blue' : 'yellow'}
                                    key={mapItem.id} identifier={mapItem.id.toString()}
                                    coordinate={{ latitude: mapItem.latitude, longitude: mapItem.longitude }}
                                    onPress={this.selectDigitalBoardClickHandler}
                                />
                            )
                        })}
                    </MapView>
                </View>

            </View>
        )
    }

}




SelectDigitalBoardScreen.navigationOptions = (data) => {
    return {
        headerTitle: data.navigation.getParam('cityName'),
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


export default SelectDigitalBoardScreen