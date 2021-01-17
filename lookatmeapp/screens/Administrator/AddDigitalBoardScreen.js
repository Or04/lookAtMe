//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'



class AddDigitalBoardScreen extends React.Component {

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

    clickOnMapHandler = async (event) => {
        if (this.mountFlag) {
            await new Promise((resolved, reject) => {
                resolved(this.setState({
                    clickPoint: event.nativeEvent.coordinate,
                    pressDigitalBoardsId: false
                }))
            })
        }
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


    addDigitalBoardHandler = async () => {

        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        wating: true
                    }))
                })
            }

            await ServerApi.addDigitalBoard(this.state.clickPoint, this.props.navigation.state.params.cityId)
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        clickPoint: false,
                        wating: false,
                        error: false,
                    }))
                })
            }
            this.renderAllDigitalBoards()

        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    wating: false
                })
            }
        }
    }


    digitalBoardClickHandler = async (event) => {

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

    deteleDigitalBoardhandler = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        wating: true
                    }))
                })
            }

            await ServerApi.deleteDigitalBoard(this.state.pressDigitalBoardsId)
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        clickPoint: false,
                        wating: false,
                        error: false,
                        pressDigitalBoardsId: false,
                        makeSureDelete: false,
                        digitalBoards: []
                    }))
                })
            }
            this.renderAllDigitalBoards()

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
        } else if (this.state.makeSureDelete) {
            return (
                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>

                    <TouchableOpacity
                         onPress={() => {
                                if (this.mountFlag) {
                                    this.setState({
                                        clickPoint: false,
                                        wating: false,
                                        error: false,
                                        pressDigitalBoardsId: false,
                                        makeSureDelete: false,
                                        digitalBoards: []
                                    });
                                }
                                this.renderAllDigitalBoards()
                            }}
                        style={{ marginHorizontal: 10,  }}
                    >
                        <Text style={{ color: 'green' }}>ביטול</Text>
                    </TouchableOpacity>



                    <TouchableOpacity
                        onPress={this.deteleDigitalBoardhandler}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Text style={{ color: 'red' }}>מחיקה</Text>
                    </TouchableOpacity>


                </View>
            )
        } else if (this.state.pressDigitalBoardsId) {
            return (
                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <Text>למחוק לוח כחול?</Text>


                    <TouchableOpacity
                        onPress={() => this.setState({ makeSureDelete: true })}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Text style={{ color: 'red' }}>מחק</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (this.mountFlag) {
                                this.setState({
                                    clickPoint: false,
                                    wating: false,
                                    error: false,
                                    pressDigitalBoardsId: false,
                                    makeSureDelete: false,
                                    digitalBoards: []
                                });
                            }
                            this.renderAllDigitalBoards()
                        }}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Text style={{ color: 'green' }}>ביטול</Text>
                    </TouchableOpacity>


                </View>
            )
        } else if (this.state.clickPoint) {
            return (
                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <View style={{ alignItems: 'center' }}><Text>להוסיף לוח?</Text></View>

                    <TouchableOpacity
                        onPress={this.addDigitalBoardHandler}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Text style={{ color: 'green' }}>הוסף</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.setState({ clickPoint: false })}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Text style={{ color: 'red' }}>ביטול</Text>
                    </TouchableOpacity>


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
                        onPress={this.clickOnMapHandler}
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
                                    onPress={this.digitalBoardClickHandler}
                                />
                            )
                        })}
                    </MapView>
                </View>

            </View>
        )
    }

}




AddDigitalBoardScreen.navigationOptions = (data) => {
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


export default AddDigitalBoardScreen