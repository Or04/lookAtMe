//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import DigitalBoard from '../../components/Advertiser/DigitalBoard'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'






class DigitalBoardsScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            digitalBoards: []
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }



    renderDigitalBoards = async (waitingFlag = true) => {
        try {
            if (this.mountFlag && !this.state.waiting && waitingFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }

            let getDigitalBoardsForAdvertisementsResponsed = await ServerApi.getDigitalBoardsForAdvertisements(this.props.navigation.getParam('advertisement').advertisementId)

            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        digitalBoards: [...getDigitalBoardsForAdvertisementsResponsed]
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
        this.renderDigitalBoards()
    }

    addDigitalBoardHandler = async () => {
        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }


            let checkForPremiumResponsed = await ServerApi.checkForPremium(this.props.screenProps.app.state.userEmail, this.props.navigation.getParam('advertisement').advertisementId)

            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                    }));
                })
            }

            this.props.navigation.navigate({
                routeName: 'SelectCity',
                params: {
                    root: this,
                    advertisement: this.props.navigation.getParam('advertisement')
                }
            })

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
            <View
                style={{ flex: 1,backgroundColor:'#fff' }}
            >
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                    :
                    <View style={styles.wrapper}>
                        <TouchableOpacity
                            style={{flexDirection:'row',width:'100%',justifyContent:'center'}}
                            onPress={this.addDigitalBoardHandler}
                        >
                             <FontAwesome5 name={'plus'} size={20} solid />
                        </TouchableOpacity>


                        <View style={{ marginVertical: 10 }}>
                            {this.state.error ? <Error errorText={this.state.error} /> : null}
                        </View>
                        {this.state.digitalBoards.length > 0 ?
                            <FlatList
                                data={this.state.digitalBoards}
                                renderItem={digitalBoard => <DigitalBoard navigation={this.props.navigation} root={this} digitalBoard={digitalBoard} />}
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



DigitalBoardsScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'לוחות דיגטליים',
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


export default DigitalBoardsScreen






















