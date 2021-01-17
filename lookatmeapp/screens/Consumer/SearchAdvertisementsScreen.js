//setstate
import React from 'react'
import { FlatList, Text, View, StyleSheet, Button, ActivityIndicator, Image, TouchableOpacity, TextInput, ScrollView, Dimensions, Picker } from 'react-native'
import Colors from '../../constants/Colors'
import Input from '../../components/Input'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import InputTypes from '../../constants/InputTypes'
import AddPictures from '../../components/Advertiser/AddPictures'
import DigitalBoard from '../../components/Consumer/DigitalBoard'






class SearchAdvertisementsScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            categories: [],
            categorySelectedValue: 0,
            cities: [],
            citySelectedValue: 0,
            digitalBoard: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    componentDidMount() {
        this.renderSearchInfo()
    }


    renderSearchInfo = async () => {
        if(this.mountFlag){
            await new Promise(resolved => {
                resolved(this.setState({
                    waiting: true
                }))
            })
        }
        try {
            let getAllCategoriesResponed = await ServerApi.getAllCategories()
            getAllCategoriesResponed.push({ description: 'בחר קטגוריה', id: 0 })
            let getAllCitiesResponed = await ServerApi.getAllCities()
            getAllCitiesResponed.push({ city: 'בחר עיר', id: 0 })


            if(this.mountFlag){
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        categories: [...getAllCategoriesResponed],
                        cities: [...getAllCitiesResponed]
                    }))
                })
            }



        } catch (error) {
            if(this.mountFlag){
                this.setState({
                    error: error.toString(),
                    waiting: false,
    
                })
            }
        }

    }

    checkError = () => {
        if (this.state.error) {
            return <Error errorText={this.state.error} />
        }
    }

    _selectCategoryHandler = (itemValue, itemIndex) => {
        this.setState({
            categorySelectedValue: itemValue
        })
    }

    _selectcityHandler = (itemValue, itemIndex) => {
        this.setState({
            citySelectedValue: itemValue
        })
    }

    selectDigitalBoard = async () => {
        if (this.mountFlag && !this.state.citySelectedValue) {
            this.setState({
                error: 'לא נבחרה עיר'
            })
        } else {
            try {
                if(this.mountFlag){
                    await new Promise(resolved => {
                        resolved(this.setState({
                            waiting: true
                        }))
                    })
                }
                let getCityInfoResponed = await ServerApi.getCityInfo(this.state.citySelectedValue)
                if(this.mountFlag){
                    await new Promise(resolved => {
                        resolved(this.setState({
                            waiting: false,
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
                if(this.mountFlag){
                    this.setState({
                        error: error.toString()
                    })
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
                        categoryId:this.state.categorySelectedValue,
                        cityId:this.state.citySelectedValue,
                        digitalBoardId:this.state.digitalBoard
                    }
                })

            } catch (error) {
                if(this.mountFlag){
                    this.setState({
                        error: error.toString()
                    })
                }
            }
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.serachBox}>
                    <Picker
                        selectedValue={this.state.categorySelectedValue}
                        style={{}}
                        onValueChange={this._selectCategoryHandler}
                    >
                        {this.state.categories.map(category => <Picker.Item key={category.id.toString()} label={category.description} value={category.id} />)}
                    </Picker>
                    <Picker
                        selectedValue={this.state.citySelectedValue}
                        style={{}}
                        onValueChange={this._selectcityHandler}
                    >
                        {this.state.cities.map(city => <Picker.Item key={city.id.toString()} label={city.city} value={city.id} />)}
                    </Picker>
                    {this.state.digitalBoard ?
                        <DigitalBoard root={this} digitalId={this.state.digitalBoard} />
                        :
                        <Button
                            title={'בחר לוח'}
                            onPress={this.selectDigitalBoard}
                            color={'#c3c3b1'}
                        />
                    }


                    {this.state.waiting ?
                        <ActivityIndicator size="large" color="#c3c3b1" />
                        :
                        <Button
                            title={'חפש'}
                            onPress={this._searchAdvertisements}
                            color={Colors.header}
                        />
                    }
                    <View style={{ marginTop: 10 }}>
                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                    </View>

                </View>


            </View>


        )
    }
}



SearchAdvertisementsScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'חיפוש מודעה',
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
        minHeight: Dimensions.get('window').height * 0.8,
        width: '100%',
        paddingHorizontal: 20,
    },
    serachBox: {
        padding: 30,
        marginTop: 50,
        borderWidth: 0,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
        width: '100%',


    },

})


export default SearchAdvertisementsScreen






















