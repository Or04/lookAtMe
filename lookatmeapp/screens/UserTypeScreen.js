//setstate
import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions, ActivityIndicator, FlatList, Button, Image, TouchableOpacity, ScrollView, Platform, TouchableHighlightBase } from 'react-native'
import Colors from '../constants/Colors'
import Error from '../components/Error'
import UserTypeObject from '../components/UserTypeObject'
import UserType from '../constants/Usertype'
import ServerApi from '../modules/ServerApi'
import * as FileSystem from 'expo-file-system'
import LocationPermission from '../components/LocationPermission'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AddPicture from '../components/Global/AddPicture'



class UserTypeScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            loadData: false,
            error: false,
            userType: false,
            rankCategories: false,
            advertiserRank: false,
            digitalBoardMenu: false,
            waitingNearDigitalBoard: false,
            digitalBoardError: false,
            waiting: false,
            consumerFlag: false,
            preferencesFlag: false,
            userPictureUri: false
        }

        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    rankCategoriesHandler = () => {
        this.props.navigation.navigate({
            routeName: 'RankCategories',
            params: {
                root: this
            }
        })

    }



    userTypeRander = async () => {
        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        waiting: true
                    }, () => resolved())
                })
            }
            let userTypeResponsed = await ServerApi.userType(this.props.screenProps.app.state.userEmail)
            let advertiserRank = false
            let consumer = false
            let preferencesFlag = false
            let userPictureUri = false
            userTypeResponsed.forEach(item => {
                if (item.key == 'advertiser') {
                    if (typeof item.rank != 'undefined' && item.rank != null) {
                        advertiserRank = item.rank
                    }
                }
                if (item.key == 'consumer') {
                    consumer = true

                    userPictureUri = item.userPictureUri
                    if (typeof item.preferences != 'undefined' && item.preferences) {
                        preferencesFlag = true
                    }
                }
            })


            if (typeof userTypeResponsed.find(item => item.key == 'consumer') == 'undefined') {
                if (this.mountFlag) {
                    this.setState({
                        waiting: false,
                        loadData: userTypeResponsed,
                        rankCategories: true,
                        advertiserRank: advertiserRank,
                        consumerFlag: consumer,
                        preferencesFlag: preferencesFlag,
                        userPictureUri: userPictureUri
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        waiting: false,
                        loadData: userTypeResponsed,
                        rankCategories: false,
                        advertiserRank: advertiserRank,
                        consumerFlag: consumer,
                        preferencesFlag: preferencesFlag,
                        userPictureUri: userPictureUri
                    })
                }
            }

            if (consumer && this.mountFlag && !this.props.screenProps.userType) {
                if (typeof this.props.screenProps.setUserType != 'undefined' && this.props.screenProps.setUserType) {
                    await this.props.screenProps.setUserType(UserType.CONSUMER)
                }
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




    showDigitalBoard = async () => {

        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        waitingNearDigitalBoard: true
                    }, () => resolved())
                })

                let responsed
                    = await ServerApi.getConsumerNearDigitalBoard(this.props.screenProps.userEmail)


                this.props.navigation.navigate({
                    routeName: 'ShowDigitalBoard', params: {
                        point: {
                            latitude: responsed[0].latitude,
                            longitude: responsed[0].longitude,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                        }

                    }
                })

                if (this.mountFlag) {
                    this.setState({
                        waitingNearDigitalBoard: false
                    })
                }
            }

        } catch (error) {

            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {

                if (this.mountFlag) {
                    this.setState({
                        digitalBoardError: 'בעיית חיבור',
                        waitingNearDigitalBoard: false
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        digitalBoardError: error.toString(),
                        waitingNearDigitalBoard: false
                    })
                }

            }
        }
    }


    selectDigitalBoard = async () => {

        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        waitingNearDigitalBoard: true
                    }, () => resolved())
                })


                this.props.navigation.navigate({
                    routeName: 'SelectCity', params: {
                        consumerEmail: this.props.screenProps.userEmail,
                    }
                })

                if (this.mountFlag) {
                    this.setState({
                        waitingNearDigitalBoard: false
                    })
                }
            }

        } catch (error) {
            if (typeof error.message != 'undefined' && error.message == 'Network request failed') {

                if (this.mountFlag) {
                    this.setState({
                        digitalBoardError: 'בעיית חיבור',
                        waitingNearDigitalBoard: false
                    })
                }
            } else {
                if (this.mountFlag) {
                    this.setState({
                        digitalBoardError: error.toString(),
                        waitingNearDigitalBoard: false
                    })
                }

            }
        }
    }






    componentDidMount() {
        this.userTypeRander()
    }
    logOff = async () => {
        await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}/user`, '')
        await this.props.screenProps.disableSendLocation()
        if (this.mountFlag) {
            this.props.screenProps.app.setState({
                isConnected: false,
                menuOption: false,
                userEmail: false,
                userType: false,
                sendLocationStatus: false,
                userPictureUri:false
            })
        }
    }

    disconnect = async () => {
        if (this.props.screenProps.app.state.intervalID) {
            clearInterval(this.props.screenProps.app.state.intervalID)
        }

        if (this.mountFlag) {
            this.props.screenProps.app.setState({
                isConnected: false,
                menuOption: false,
                userEmail: false,
                userType: false,
                userPictureUri:false

            })
        }
    }



    closeDigitalBoard = () => {
        this.setState({
            digitalBoardMenu: false
        })
    }
    editCloseDigitalBoard = () => {
        this.setState({
            digitalBoardMenu: true
        })
    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :

                    <View style={{ flex: 1 }}>
                        {this.state.preferencesFlag ?
                            <View
                                style={styles.wrapper}
                            >
                                <AddPicture
                                    userEmail={this.props.screenProps.userEmail}
                                    userPictureUri={this.state.userPictureUri}
                                    userTypeRander={this.userTypeRander}

                                />
                                <View
                                    style={styles.topColor}
                                />
                                <View style={styles.insideWrapper}>
                                    {this.state.error ? <Error errorText={this.state.error} /> : null}

                                    <View style={{ ...styles.userInfo, marginBottom: 10 }}>
                                        <Text style={ styles.textMail}>{this.props.screenProps.app.state.userEmail}</Text>

                                        <TouchableOpacity
                                            onPress={this.logOff}
                                        >
                                            <FontAwesome5
                                                name={'sign-out-alt'}
                                                size={20}
                                                solid
                                            />
                                        </TouchableOpacity>

                                    </View>
                                    {this.state.digitalBoardMenu ?
                                        <View style={{ paddingVertical: this.state.digitalBoardMenu ? 10 : 0, paddingHorizontal: 10, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center', flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row' }}>

                                            <TouchableOpacity
                                                onPress={this.closeDigitalBoard}
                                                style={{ marginBottom: 20 }}
                                            >
                                                <FontAwesome5
                                                    name={'times-circle'}
                                                    size={20}
                                                    solid
                                                    style={{ marginLeft: 25 }}
                                                />
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10 }}>
                                                {this.state.waitingNearDigitalBoard ?
                                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                                        <ActivityIndicator size="small" color="#c3c3b1" />
                                                    </View>
                                                    :
                                                    <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10 }}>
                                                        <TouchableOpacity
                                                            onPress={this.selectDigitalBoard}
                                                            style={{ flex: 1, backgroundColor: '#7fffd4' }}
                                                        >

                                                            <Text style={{ textAlign: 'center' }}>החלפת לוח</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={this.showDigitalBoard}
                                                            style={{ flex: 1, backgroundColor: 'white' }}
                                                        >
                                                            <Text style={{ textAlign: 'center' }}>צפיה</Text>

                                                        </TouchableOpacity>

                                                    </View>
                                                }

                                            </View>

                                        </View>


                                        :

                                        <View style={{ marginBottom: 8, alignItems: 'center', flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', justifyContent: 'space-between' }}>
                                            <Text>בחר לוח המודעות הקרוב אליך</Text>
                                            <TouchableOpacity
                                                onPress={this.editCloseDigitalBoard}
                                            >
                                                <FontAwesome5
                                                    name={'desktop'}
                                                    size={20}
                                                    solid
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    }
                                    {this.state.digitalBoardError ? <Error errorText={this.state.digitalBoardError} /> : null}


                                    {this.state.advertiserRank ?
                                        <View style={{ ...styles.userInfo, marginBottom: 8 }}>
                                            <View style={{}}><Text>דירוג משתמש</Text></View>
                                            <View style={{  }}><Text style={{ textAlign: 'center' }}>{ this.state.advertiserRank.toString().length>3?this.state.advertiserRank.toString().slice(0,3):this.state.advertiserRank.toString()}</Text></View>
                                        </View>
                                        :
                                        null
                                    }
                                    <LocationPermission
                                        status={this.props.screenProps.locationPermissionStatus}
                                        askLocationPermissions={this.props.screenProps.askLocationPermissions}
                                        disableSendLocation={this.props.screenProps.disableSendLocation}
                                        activeSendLocation={this.props.screenProps.activeSendLocation}
                                        sendLocationStatus={this.props.screenProps.sendLocationStatus}
                                    />

                                    <TouchableOpacity style={{ marginVertical: 15, flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', justifyContent: 'center' }}
                                        onPress={this.rankCategoriesHandler}
                                    >
                                        <FontAwesome5 name={'file-alt'} size={20} solid />

                                        <Text style={{ color: '#c3c3b1', textAlign: 'center', marginLeft: 10 }}>
                                            {this.state.rankCategories ? 'מילוי שאלון' : 'עדכון שאלון'}
                                        </Text>

                                    </TouchableOpacity>



                                    <ScrollView
                                        contentContainerStyle={styles.userTypeBox}
                                    >

                                        {typeof this.state.loadData[0] != 'undefined' ? this.state.loadData.map(item => <UserTypeObject
                                            root={this}
                                            key={item.value}
                                            style={{ paddingVertical: 5 }}
                                            item={item}
                                            userType={this.props.screenProps.userType}
                                        />)
                                            :
                                            null}
                                    </ScrollView>


                                </View>
                            </View>
                            :
                            <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text>יש למלא שאלון</Text>
                                <TouchableOpacity style={{ marginVertical: 15, flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', justifyContent: 'center' }}
                                    onPress={this.rankCategoriesHandler}
                                >
                                    <FontAwesome5 name={'file-alt'} size={20} solid />
                                    <Text style={{ color: '#c3c3b1', textAlign: 'center', marginLeft: 10 }}>
                                        {this.state.rankCategories ? 'מילוי שאלון' : 'עדכון שאלון'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View >

                }
            </View>

        )
        

    }
}


UserTypeScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'סוג משתמש',
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
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'relative'

    },
    userOptions: {
        padding: 30,
        marginTop: 100,
        borderWidth: 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 20,
        borderRadius: 10,
        height: '50%',
    },
    userText: {
        alignItems: Platform.OS == 'ios' ? 'flex-start' : 'flex-end',
    },
    userInfo: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
    },
    logOffIcon: {
        width: 30,
        height: 30
    },
    textMail: {
        textAlign: 'right',
       
    },
    topColor: {
        height: Dimensions.get('window').height * 0.50,
        width: '100%',
        backgroundColor: Colors.appColor,
        position: 'relative'
    },
    insideWrapper: {
        position: 'absolute',
        marginTop: Dimensions.get('window').height * 0.25,
        padding: 20,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingTop: 60

    },
    userTypeBox: {
        flexDirection:  Platform.OS == 'ios' ? 'row-reverse' :'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
})






export default UserTypeScreen