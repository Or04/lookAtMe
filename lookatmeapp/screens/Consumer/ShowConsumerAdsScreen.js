//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'
import MenuOption from '../../constants/MenuOption'
import DeleteAdvertisement from '../../components/Consumer/DeleteAdvertisement'



class ShowConsumerAdsScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            advertisements: []
        }
        this.mountFlag = true


    }


    componentWillUnmount() {
        this.mountFlag = false
    }


    componentDidMount() {
        this.renderAdvertisements()
    }

    renderAdvertisements = async (waitingFlag=true) => {
        try {
            if (this.mountFlag && waitingFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }))
                })
            }
            let getConsumerSelectedAdsResponsed = await ServerApi.getConsumerSelectedAds(this.props.screenProps.app.state.userEmail)

            if (this.mountFlag && getConsumerSelectedAdsResponsed.length > 0) {
                this.setState({
                    advertisements: [...getConsumerSelectedAdsResponsed],
                    waiting: false
                })
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: 'לצרכן אין מודעות',
                        advertisements: [],
                        waiting: false
                    })
                }
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

    selectDigitalBoard = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.props.navigation.getParam('root').setState({
                        digitalBoard: this.state.pressDigitalBoardsId
                    }))
                })
            }

            this.props.navigation.pop()
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    waiting: false
                })

            }
        }
    }



    topSection = () => {
        if (this.state.waiting) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <ActivityIndicator size="large" color="#c3c3b1" />
                </View>
            )
        } else if (this.state.pressDigitalBoardsId) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 20 }}>
                    <View style={{ flex: 3, alignItems: 'center' }}><Text>בחר לוח זה</Text></View>
                    <View style={{ marginHorizontal: 10, flex: 1 }}>
                        <Button
                            title={'בחר'}
                            color={Colors.header}
                            onPress={this.selectDigitalBoard}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                    :
                    <View style={styles.wrapper}>
                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        {this.state.advertisements.length > 0 ?
                            <FlatList
                                data={this.state.advertisements}
                                renderItem={advertisement => {

                                    return <DeleteAdvertisement
                                     navigation={this.props.navigation} 
                                     root={this} 
                                     advertisement={advertisement} 
                                     renderAdvertisements={this.renderAdvertisements}
                                     />
                                }}
                                keyExtractor={item => item.advertisementId.toString()}
                            />
                            : null
                        }
                    </View>

                }

            </View>
        )
    }

}




ShowConsumerAdsScreen.navigationOptions = (data) => {
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
        headerTitleAlign: 'center',
        headerShown: false
    }
}






const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 0 : 30,
        backgroundColor: '#fff',
        paddingHorizontal:10
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


export default ShowConsumerAdsScreen