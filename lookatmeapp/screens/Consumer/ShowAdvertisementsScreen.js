//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList, Platform } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'
import MenuOption from '../../constants/MenuOption'
import Advertisement from '../../components/Consumer/Advertisement'



class ShowAdvertisementsScreen extends React.Component {

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

    renderAdvertisements = async (waitingFlag = true) => {

        try {
            if (this.mountFlag && waitingFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }))
                })
            }
            let getAdvertisementsQueryResponsed = await ServerApi.getAdvertisementsQuery(this.props.navigation.getParam('categoryId'), this.props.navigation.getParam('cityId'), this.props.navigation.getParam('digitalBoardId'))
            let getConsumerSelectedAdsResponsed = await ServerApi.getConsumerSelectedAds(this.props.screenProps.app.state.userEmail)

            getConsumerSelectedAdsResponsed.forEach(userAD => {
                let findResponed = getAdvertisementsQueryResponsed.find(ad => ad.advertisementsId == userAD.advertisementId)
                if (typeof findResponed != 'undefined') {
                    findResponed.userAd = true
                }
            })

            if (this.mountFlag && getAdvertisementsQueryResponsed.length > 0) {
                this.setState({
                    advertisements: [...getAdvertisementsQueryResponsed],
                    waiting: false
                })
            } else {
                throw 'לא נמצאו מודעות'
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





    render() {

        return (
            <View style={{ flex: 1,backgroundColor:'#fff' }}>
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                    :
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        {this.state.advertisements.length > 0 ?
                            <FlatList
                                data={this.state.advertisements}
                                renderItem={advertisement => <Advertisement
                                    navigation={this.props.navigation}
                                    root={this}
                                    advertisement={advertisement}
                                    renderAdvertisements={this.renderAdvertisements}
                                />}
                                keyExtractor={item => item.advertisementsId.toString()}
                            />
                            : null
                        }

                    </View>

                }

            </View>
        )
    }

}




ShowAdvertisementsScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'תוצאות',
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


export default ShowAdvertisementsScreen