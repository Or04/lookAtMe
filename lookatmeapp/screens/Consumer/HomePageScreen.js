//setstate
import React from 'react'
import { FlatList, Text, View, StyleSheet, Picker, Button, ActivityIndicator, Image, Keyboard, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native'
import Colors from '../../constants/Colors'
import Input from '../../components/Input'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import InputTypes from '../../constants/InputTypes'
import AddPictures from '../../components/Advertiser/AddPictures'
import Advertisement from '../../components/Consumer/Advertisement'
import DigitalBoard from '../../components/Consumer/DigitalBoard'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import RNPickerSelect from 'react-native-picker-select'








class HomePageScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            advertisements: [],
            categories: [],
            categorySelectedValue: 0,
            cities: [],
            citySelectedValue: 0,
            digitalBoard: false,
            cityWaiting: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    renderAdvertisementsForConsumer = async (waitingFlag = true) => {
        try {
            if (this.mountFlag && !this.state.waiting && waitingFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }


            let getAdvertisementsForConsumerResponsed = await ServerApi.getAdvertisementsForConsumer(this.props.screenProps.app.state.userEmail)
            let getConsumerSelectedAdsResponsed = await ServerApi.getConsumerSelectedAds(this.props.screenProps.app.state.userEmail)
            let advertisementsTemp = []

            if (getAdvertisementsForConsumerResponsed.length > 0) {
                getAdvertisementsForConsumerResponsed.forEach(item => {
                    let index = getConsumerSelectedAdsResponsed.findIndex(item2 => item2.advertisementId == item.id)
                    if (index == -1) {
                        advertisementsTemp.push(item)

                    }
                })
            }

            getConsumerSelectedAdsResponsed.forEach(userAD => {
                let findResponed = getAdvertisementsForConsumerResponsed.find(ad => ad.id == userAD.advertisementId)
                if (typeof findResponed != 'undefined') {
                    findResponed.userAd = true
                }
            })

            let getAllCategoriesResponed = await ServerApi.getAllCategories()
            getAllCategoriesResponed.push({ description: 'בחר קטגוריה', id: 0 })
            let getAllCitiesResponed = await ServerApi.getAllCities()
            getAllCitiesResponed.push({ city: 'בחר עיר', id: 0 })

            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        waiting: false,
                        advertisements: [...advertisementsTemp],
                        categories: [...getAllCategoriesResponed],
                        cities: [...getAllCitiesResponed]
                    }, () => resolved())
                })
            }

        } catch (error) {
            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {

                if (this.mountFlag) {
                    this.setState({
                        error: 'בעיית חיבור',
                        waiting: false
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString(),
                        waiting: false
                    })
                }

            }
        }
    }

    _selectCategoryHandler = (itemValue, itemIndex) => {

        this.setState({
            categorySelectedValue: itemValue,
            error: false
        })
    }

    _selectcityHandler = (itemValue, itemIndex) => {
        this.setState({
            citySelectedValue: itemValue,
            error: false
        })
    }

    selectDigitalBoard = async () => {
        if (this.mountFlag && !this.state.citySelectedValue) {
            this.setState({
                error: 'לא נבחרה עיר'
            })
        } else {
            try {
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            cityWaiting: true
                        }))
                    })
                }
                let getCityInfoResponed = await ServerApi.getCityInfo(this.state.citySelectedValue)
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            cityWaiting: false,
                            error: false
                        }))
                    })
                }
                this.props.navigation.navigate({
                    routeName: 'SelectDigitalBoard', params: {
                        cityId: this.state.citySelectedValue,
                        cityName: getCityInfoResponed[0].city,
                        point: {
                            latitude: getCityInfoResponed[0].latitude,
                            longitude: getCityInfoResponed[0].longitude,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                        },
                        root: this
                    }
                })

            } catch (error) {

                if (typeof error.message != 'undefined' && error.message == 'Network request failed') {

                    if (this.mountFlag) {
                        this.setState({
                            error: 'בעיית חיבור',
                            cityWaiting: false
                        })
                    }
                } else {
                    if (this.mountFlag) {
                        this.setState({
                            error: error.toString(),
                            cityWaiting: false
                        })
                    }

                }

            }

        }
    }

    _searchAdvertisements = async () => {
        if (this.mountFlag && !this.state.citySelectedValue) {
            this.setState({
                error: 'לא נבחרה עיר'
            })
        } else if (this.mountFlag && !this.state.categorySelectedValue) {
            this.setState({
                error: 'לא נבחרה קטגוריה'
            })
        } else {
            try {
                this.props.navigation.navigate({
                    routeName: 'ShowAdvertisements', params: {
                        categoryId: this.state.categorySelectedValue,
                        cityId: this.state.citySelectedValue,
                        digitalBoardId: this.state.digitalBoard
                    }
                })

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
    }

    componentDidMount() {
        this.renderAdvertisementsForConsumer()
    }


    _searchAdHandler = () => {
        this.props.navigation.navigate({
            routeName: 'SearchAdvertisements',
            params: {

            }
        })
    }

    render() {
        let iosCategories = []
        iosCategories.push({ label: 'בחר קטגוריה', value: 0 })
        if (this.state.categories.length > 0) {
            this.state.categories.forEach(item => {
                iosCategories.push({ label: item.description, value: item.id })
            })
        }
        let iosCities = []
        iosCities.push({ label: 'בחר עיר', value: 0 })
        if (this.state.cities.length > 0) {
            this.state.cities.forEach(item => {
                iosCities.push({ label: item.city, value: item.id })
            })
        }

        return (
            <View style={{ flex: 1 }}>
               
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :
                    <View style={styles.wrapper}>

                        <View style={styles.serachBox}>
                            {Platform.OS == 'ios' ?


                                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <RNPickerSelect
                                            onValueChange={this._selectCategoryHandler}
                                            items={iosCategories}
                                            value={this.state.categorySelectedValue}
                                            doneText={'בחר'}

                                        />
                                        <FontAwesome5 color={'black'} name={'arrow-down'} size={9} style={{ marginHorizontal: 5, marginTop: 6 }} />

                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                        <RNPickerSelect
                                            onValueChange={this._selectcityHandler}
                                            items={iosCities}
                                            value={this.state.citySelectedValue}
                                            doneText={'בחר'}
                                        />

                                        <FontAwesome5 color={'black'} name={'arrow-down'} size={9} style={{ marginHorizontal: 5, marginTop: 6 }} />
                                    </View>
                                </View>


                                :



                                <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row' }}>
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
                                    >

                                        <Picker
                                            selectedValue={this.state.categorySelectedValue}
                                            onValueChange={this._selectCategoryHandler}
                                            style={{
                                                backgroundColor: '#00000000',
                                                width: 105

                                            }}
                                        >
                                            {this.state.categories.map(category => <Picker.Item key={category.id.toString()} label={category.description} value={category.id} />)}
                                        </Picker>


                                    </View>

                                    <View
                                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
                                    >


                                        <Picker
                                            selectedValue={this.state.citySelectedValue}
                                            onValueChange={this._selectcityHandler}
                                            style={{
                                                backgroundColor: '#00000000',
                                                width: 75

                                            }}
                                        >
                                            {this.state.cities.map(city => <Picker.Item key={city.id.toString()} label={city.city} value={city.id} />)}
                                        </Picker>

                                    </View>


                                </View>



                            }
                            <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', width: '100%', justifyContent: 'space-between' }}>

                                {this.state.cityWaiting ?
                                    <View style={{ alignItems: 'center', flex: 1 }}>
                                        <ActivityIndicator size="small" color="#c3c3b1" />
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={this.selectDigitalBoard}
                                        style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse' }}
                                    >
                                        <Text>בחר לוח</Text>
                                        {this.state.digitalBoard ? <FontAwesome5 name={'check-circle'} size={20} /> : null}
                                    </TouchableOpacity>
                                }


                                <TouchableOpacity
                                    onPress={this._searchAdvertisements}
                                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flex: 1 }}
                                >
                                    <Text>חפש</Text>
                                </TouchableOpacity>



                            </View>
                            <View style={{ marginTop: 10 }}>
                                {this.state.error ? <Error errorText={this.state.error} /> : null}
                            </View>

                        </View>


                        {this.state.advertisements.length > 0 ?
                            <FlatList
                                data={this.state.advertisements}
                                renderItem={advertisement => <Advertisement
                                    navigation={this.props.navigation}
                                    root={this}
                                    advertisement={advertisement}
                                    consumerEmail={this.props.screenProps.userEmail}
                                    renderAdvertisementsForConsumer={this.renderAdvertisementsForConsumer}

                                />}
                                keyExtractor={item => item.id.toString()}
                            />
                            : null
                        }
                    </View>

                }



            </View>
        )
    }
}



HomePageScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'צרכן',
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
        paddingHorizontal: 20,
        paddingTop: 30,
        backgroundColor: '#fff'

    },
    input: {
        borderColor: '#767676',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10
    },
    category: {
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        borderColor: '#c3c3b1'

    },
    serachBox: {
        padding: 10,
        marginTop: 10,
        borderWidth: 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 50


    },
})


export default HomePageScreen






















