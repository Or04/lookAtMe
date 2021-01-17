//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableWithoutFeedback } from 'react-native'
import Colors from '../../constants/Colors'
import ServerApi from '../../modules/ServerApi'
import Advertisement from '../../components/Advertiser/DeletePicture'






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
            if(this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }

            let getAdvertisementsForUserResponsed = await ServerApi.getAdvertisementsForUser(this.props.screenProps.app.state.userEmail)
            
            if(this.mountFlag){
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        advertisements: [...getAdvertisementsForUserResponsed]
                    }));
                })
            }

        } catch (error) {
            if(this.mountFlag){
                this.setState({
                    error: error.toString()
                })
            }
        }
    }

    async  componentDidMount() {
        this.renderAdvertisements()
    }

    addAdHandler = () => {
        this.props.navigation.navigate({
            routeName: 'SelectCategory',
            params: {
            }
        })
    }

    render() {
        return (

            <View style={styles.wrapper}>
                
                {this.state.waiting ? <ActivityIndicator size="large" color="#c3c3b1" /> : null}
                <Button
                    title={'הוספת פרסומות'}
                    onPress={this.addAdHandler}
                />
                {this.state.advertisements.length > 0 ?
                    <FlatList
                        data={this.state.advertisements}
                        renderItem={advertisement => <Advertisement root={this} advertisement={advertisement} />}
                        keyExtractor={item => item.advertisementId.toString()}
                    />
                    : null
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
        headerTitleAlign: 'center'
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,

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






















