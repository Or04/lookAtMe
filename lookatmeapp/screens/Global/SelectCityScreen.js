//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, FlatList, TouchableWithoutFeedback } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'





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
            if(this.mountFlag){
                this.setState({
                    CitiesArray: [...getAllCitiesResponsed]
                })
            }
        } catch (error) {

            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {
                if (this.mountFlag) {
                    this.setState({
                        error: 'בעיית חיבור',
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString(),
                    })
                }

            }




        }
    }

    selectCityHandler = (renderItem) => {
        this.props.navigation.navigate({
            routeName: 'SelectDigitalBoard', params: {
                cityId: renderItem.item.id,
                cityName: renderItem.item.city,
                point: {
                    latitude: renderItem.item.latitude,
                    longitude: renderItem.item.longitude,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                },
                consumerEmail:this.props.navigation.getParam('consumerEmail')
            }
        })

    }





    render() {

        return (
            <View style={styles.wrapper}>

                {this.state.error ? <Error errorText={this.state.error} /> : null}
                {this.state.CitiesArray.length > 0 ?
                    <FlatList
                        data={this.state.CitiesArray}
                        renderItem={(renderItem) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.selectCityHandler.bind(this, renderItem)}>
                                    <View style={styles.cityWrapper}>
                                        <Text>{renderItem.item.city}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
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
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
        height: '50%',
    },
    cityWrapper: {
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    }
})


export default AddDigitalBoardScreen