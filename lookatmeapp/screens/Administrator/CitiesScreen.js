//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'



class CitiesScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            text: '',
            clickPoint: false,
            wating: false,
            error: false,
            cities: [],
            pressCityId: false,
            updateCity: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {
        this.renderAllCities()
    }


    updateCityHandler = async () => {
        try {
            if (this.mountFlag && this.state.text == '') {
                this.setState({ error: 'לא הוכנס שם עיר' })
            } else {
                if (this.mountFlag) {
                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            wating: true
                        }))
                    })
                }
                await ServerApi.updateCity(this.state.text, this.state.pressCityId)
                if (this.mountFlag) {
                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            text: '',
                            clickPoint: false,
                            wating: false,
                            error: false,
                            cities: [],
                            pressCityId: false,
                            updateCity: false
                        }))
                    })
                }
                this.renderAllCities()
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

    clickOnMapHandler = async (event) => {
        if (this.state.pressCityId) {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        clickPoint: event.nativeEvent.coordinate,
                        wating: false,
                        error: false,
                        pressCityId: false,
                        cities: []
                    }))
                })
            }
            this.renderAllCities()

        } else {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        clickPoint: event.nativeEvent.coordinate,
                        wating: false,
                        error: false,
                        pressCityId: false,
                    }))
                })
            }
        }
    }


    renderAllCities = async () => {
        try {
            let getAllCitiesResponsed = await ServerApi.getAllCities()
            if (this.mountFlag && getAllCitiesResponsed.length > 0) {
                this.setState({
                    cities: [...getAllCitiesResponsed]
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


    addCityHandler = async () => {
        try {
            if (this.mountFlag && this.state.text == '') {
                this.setState({ error: 'לא הוכנס שם עיר' })
            } else {
                if (this.mountFlag) {
                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            wating: true
                        }))
                    })
                }
                await ServerApi.addCity(this.state.text, this.state.clickPoint)
                if (this.mountFlag) {
                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            clickPoint: false,
                            wating: false,
                            error: false,
                            cities: [],
                            text: ''
                        }))
                    })
                }

                this.renderAllCities()
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

    updateTextHandler = (inputText) => {
        this.setState({
            text: inputText
        })
    }


    digitalBoardMarkerClickHandler = async (event) => {

        if (this.mountFlag && this.state.clickPoint) {
            await new Promise((resolved, reject) => {
                resolved(this.setState({
                    clickPoint: false,
                    wating: false,
                    error: false,
                    pressCityId: parseInt(event.nativeEvent.id),
                    cities: []
                }))
            })

        } else {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        wating: false,
                        error: false,
                        pressCityId: false,
                        pressCityId: parseInt(event.nativeEvent.id),
                        cities: []
                    }))
                })
            }
        }
        this.renderAllCities()
    }

    deteleCityhandler = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        wating: true
                    }))
                })
            }

            let deleteCityResponed = await ServerApi.deleteCity(this.state.pressCityId)
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        clickPoint: false,
                        wating: false,
                        error: false,
                        pressCityId: false,
                        makeSureDelete: false,
                        cities: []
                    }))
                })
            }
            this.renderAllCities()

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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flex: 1 }}>
                    <ActivityIndicator size="large" color="#c3c3b1" />
                </View>
            )
        } else if (this.state.makeSureDelete) {
            return (
                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-around', flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.mountFlag) {
                                this.setState({
                                    clickPoint: false,
                                    wating: false,
                                    error: false,
                                    pressCityId: false,
                                    makeSureDelete: false,
                                    cities: []
                                });
                            }
                            this.renderAllCities()
                        }}
                    >
                        <Text style={{ color: 'green' }}>ביטול</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={this.deteleCityhandler}
                    >
                        <Text style={{ color: 'red' }}>מחק</Text>
                    </TouchableOpacity>

                </View>
            )
        } else if (this.state.pressCityId) {
            let cityInfo = this.state.cities.find(item => item.id == this.state.pressCityId)
            return (
                <View style={{ flex: 1, flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text><Text style={{ fontWeight: 'bold' }}>שם עיר:</Text>{typeof cityInfo != 'undefined' ? cityInfo.city : null}</Text>
                        {this.state.updateCity ?
                            < TextInput
                                ref={(updateCity) => { this.updateCity = updateCity }}

                                placeholder={'הכנס שם עיר'}
                                onChangeText={this.updateTextHandler}
                            />
                            :
                            null
                        }

                    </View>

                    {this.state.updateCity ?

                        <TouchableOpacity
                            onPress={this.updateCityHandler}
                            style={{ marginHorizontal: 10, }}
                        >
                            <Text style={{ textDecorationLine: 'underline' }}>עדכן</Text>
                        </TouchableOpacity>
                        :

                        <TouchableOpacity
                            onPress={() => this.setState({ updateCity: true })}
                            style={{ marginHorizontal: 10, }}
                        >
                            <Text style={{}}>עדכן</Text>
                        </TouchableOpacity>
                    }


                    <TouchableOpacity
                        onPress={() => this.setState({ makeSureDelete: true })}
                    >
                        <Text style={{}}>מחק</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.clickPoint) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>

                            <TextInput
                                ref={(addCity) => { this.addCity = addCity }}

                                placeholder={'הכנס שם עיר'}
                                onChangeText={this.updateTextHandler}
                            />

                        </View>



                        <TouchableOpacity
                            onPress={this.addCityHandler}
                            style={{ marginHorizontal: 30 }}
                        >
                            <FontAwesome5 name={'plus'} size={20} />
                        </TouchableOpacity>


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
                <View style={{ flex: 5 }}>
                    <MapView
                        style={{ width: '100%', height: '100%' }}
                        onPress={this.clickOnMapHandler}
                        initialRegion={{
                            latitude: 31.702893,
                            longitude: 34.996265,
                            latitudeDelta: 2,
                            longitudeDelta: 2,
                        }}

                    >
                        {this.state.clickPoint ? <Marker pinColor={Colors.header} coordinate={this.state.clickPoint} /> : null}
                        {this.state.cities.map((mapItem) => {
                            return (
                                <Marker
                                    key={mapItem.id} identifier={mapItem.id.toString()}
                                    coordinate={{ latitude: mapItem.latitude, longitude: mapItem.longitude }}
                                    onPress={this.digitalBoardMarkerClickHandler}
                                    pinColor={(this.state.pressCityId == mapItem.id) ? 'blue' : 'yellow'}
                                />
                            )
                        })}
                    </MapView>
                </View>

            </View>
        )
    }




}




CitiesScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'ערים',
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


export default CitiesScreen