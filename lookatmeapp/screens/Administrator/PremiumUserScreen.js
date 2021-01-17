//setstate
import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import User from '../../components/User'


class PremiumUserScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            error: false,
            users: []
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    async componentDidMount() {
        this.renderAllUsers()
    }

    renderAllUsers = async () => {
        try {
            let getPremiumUsersResponsed = await ServerApi.getPremiumUsers()
            if (this.mountFlag && getPremiumUsersResponsed.length > 0) {
                this.setState({
                    users: [...getPremiumUsersResponsed]
                })
            }
        } catch (error) {
            if(this.mountFlag){
                this.setState({
                    error: error.toString(),
                    wating: false
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
                {this.state.error ? <Error errorText={this.state.error} /> : null}
                {this.state.users.length > 0 ?
                    <FlatList
                        data={this.state.users}
                        renderItem={renderItem =><User info={renderItem.item} root={this}/> }
                        keyExtractor={item => item.email}
                    />
                    : null
                }
            </View>
        )
    }
}


PremiumUserScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'משתמש מובחר',
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
        backgroundColor:'#fff'
        
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
    },
    cityWrapper: {
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        // flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    }
})


export default PremiumUserScreen