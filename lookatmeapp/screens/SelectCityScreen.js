//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, FlatList, TouchableWithoutFeedback } from 'react-native'
import Colors from '../constants/Colors'
import Error from '../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../modules/ServerApi'
import { TouchableOpacity } from 'react-native-gesture-handler'





class AddDigitalBoardScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            error: false,
            CitiesArray: []
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }



    async  componentDidMount() {
        try {
            let getAllCitiesResponsed = await ServerApi.getAllCities()
            if (this.mountFlag) {
                this.setState({
                    CitiesArray: [...getAllCitiesResponsed]
                })
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString()
                })
            }
        }
    }

    selectCityHandler = (renderItem) => {
        this.props.navigation.navigate({
            routeName: 'AddDigitalBoard', params: {
                cityId: renderItem.item.id,
                cityName: renderItem.item.city,
                point: {
                    latitude: renderItem.item.latitude,
                    longitude: renderItem.item.longitude,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }

            }
        })
    }





    render() {

        return (
            <View style={styles.wrapper}>
                <Text style={styles.textExplanition}>
                    בחר את העיר בה תרצה להוסיף לוח חדש:</Text>
                {this.state.error ? <Error errorText={this.state.error} /> : null}
                {this.state.CitiesArray.length > 0 ?

                    <FlatList
                        data={this.state.CitiesArray}
                        renderItem={(renderItem) => {
                            return (
                                <TouchableOpacity style={styles.cityWrapper} onPress={this.selectCityHandler.bind(this, renderItem)}>
                                   
                                        <Text>{renderItem.item.city}</Text>
                            
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={item => item.id.toString()}
                    />
                    : null
                }


            </View>
        )
    }

}


AddDigitalBoardScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'בחירת עיר',
        headerStyle: {
            backgroundColor: Colors.header,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerShown: false,
        headerTitleAlign: 'center'
    }
}



const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: 30,
        alignItems:'center',
        width:'100%',
        borderColor: "#CED0CE"
    },
    textExplanition: {
        marginTop: 70
    },
    cityWrapper: {
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    }
})


export default AddDigitalBoardScreen