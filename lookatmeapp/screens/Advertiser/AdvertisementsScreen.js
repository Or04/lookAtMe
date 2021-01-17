//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Input from '../../components/Input'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import Category from '../../components/Administrator/Category'
import Advertisement from '../../components/Advertiser/Advertisement'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'






class AdvertisementsScreen extends React.Component {
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



    renderAdvertisements = async () => {
        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }


            let getAdvertisementsForUserResponsed = await ServerApi.getAdvertisementsForUser(this.props.screenProps.app.state.userEmail)

            for (let i = 0; i < getAdvertisementsForUserResponsed.length; i++) {
                let adViews = await ServerApi.getAdViews(getAdvertisementsForUserResponsed[i].advertisementId)
                if (typeof adViews[0] != 'undefined' && typeof adViews[0].views != 'undefined') {
                    getAdvertisementsForUserResponsed[i].views = adViews[0].views
                } else {
                    getAdvertisementsForUserResponsed[i].views = 0

                }

            }

            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        advertisements: [...getAdvertisementsForUserResponsed]
                    }));
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

    componentDidMount() {
        this.renderAdvertisements()
    }

    addAdHandler = () => {
        this.props.navigation.navigate({
            routeName: 'SelectCategory',
            params: {
                root: this
            }
        })
    }

    render() {

        return (
            <View
                style={{ flex: 1,backgroundColor:'#fff' }}
            >
               
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :

                    <View style={styles.wrapper}>



                        {this.state.waiting ? <ActivityIndicator size="large" color="#c3c3b1" /> : null}

                        <TouchableOpacity
                            onPress={this.addAdHandler}
                            style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', height: 45, alignItems: 'center' }}
                        >
                            <FontAwesome5 name={'plus'} size={20} solid />
                        </TouchableOpacity>
                        {this.state.advertisements.length > 0 ?
                            <FlatList
                                data={this.state.advertisements}

                                renderItem={advertisement => <Advertisement
                                    navigation={this.props.navigation}
                                    root={this}
                                    advertisement={advertisement}
                                    renderAdvertisements={this.renderAdvertisements}
                                />}
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



AdvertisementsScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'פרסומות',
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
        paddingHorizontal: 10,
        paddingTop: 30,
        marginTop: Platform.OS == 'ios' ? 60 : 0,

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
        alignItems: 'center'

    }
})


export default AdvertisementsScreen






















