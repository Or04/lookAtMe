//setstate
import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import AddPictures from '../../components/Advertiser/AddPictures'
import DeletePictures from '../../components/Advertiser/DeletePictures'
import UpdateDescription from '../../components/Advertiser/UpdateDescription'
import UpdateAddress from '../../components/Advertiser/UpdateAddress'
import UpdatePrice from '../../components/Advertiser/UpdatePrice'
import UpdateName from '../../components/Advertiser/UpdateName'
import UpdatePhoneNumber from '../../components/Advertiser/UpdatePhoneNumber'






class UpdateAdvertisementScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            pictures: [],
            makeSureDelete: false,
            deleteWaiting: false,
            updatePictures: []
        }

        this.mountFlag = true
    }

    addPictureLocal = (pictureInfo) => {
        this.setState({
            updatePictures: [...this.state.updatePictures, { ...pictureInfo }],
            pictures: [...this.state.pictures, pictureInfo.uri]
        })
    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {
        this.randerPicturesHandler()

    }

    randerPicturesHandler = async () => {
        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    waiting: true
                }))
            })
        }
        try {

            let getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.screenProps.app.state.userEmail, this.props.navigation.getParam('advertisement').advertisementId)

            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        waiting: false
                    }, () => resolved())
                })
            }

            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        pictures: [...getPicturesForAdvertisementResponsed]
                    }, () => resolved())

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


    _updatePicturesHandler = async () => {
        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    waiting: true
                }))
            })
        }
        try {

            let pictures = this.addPictures._getPictures()
            for (let i = 0; i < this.state.updatePictures.length; i++) {
                await ServerApi.addPicture(this.state.updatePictures[i], this.props.screenProps.app.state.userEmail, this.props.navigation.getParam('advertisement').advertisementId)
            }

            let getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.screenProps.app.state.userEmail, this.props.navigation.getParam('advertisement').advertisementId)


            if (typeof this.props.navigation.getParam('renderAdvertisements')) {
                this.props.navigation.getParam('renderAdvertisements')()
            }


            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false
                    }))
                })
            }

            if (this.mountFlag) {

                await new Promise(resolved => {
                    this.deletePictures.setState({
                        pictures: [...getPicturesForAdvertisementResponsed],
                        updatePictures: []
                    }, () => resolved())

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

    checkError = () => {
        if (this.state.error) {
            return <Error errorText={this.state.error} />
        }
    }

    deleteLocalPicture = (pictureUri) => {
        let index = -1
        let index2 = -1

        for (let i = 0; i < this.state.pictures.length; i++) {
            if (this.state.pictures[i] == pictureUri) {
                index = i
            }
        }

        for (let i = 0; i < this.state.updatePictures.length; i++) {
            if (this.state.updatePictures[i].uri == pictureUri) {
                index2 = i
            }
        }



        let updatePictures = [...this.state.updatePictures]
        let pictures = [...this.state.pictures]

        if (index2 > -1) {
            updatePictures.splice(index2, 1)
        }
        if (index > -1) {
            pictures.splice(index, 1)
        }

        this.setState({
            updatePictures: [...updatePictures],
            pictures: [...pictures]

        })

    }


    deleteAdvertisement = async () => {

        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        deleteWaiting: true
                    }))
                })

            }

            await ServerApi.deleteAdvertisement(this.props.navigation.getParam('advertisement').advertisementId)



            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.props.navigation.getParam('root').renderAdvertisements())
                })
                this.props.navigation.pop()
            }

            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        deleteWaiting: false
                    }))
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


    render() {

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "position" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 50}
            >
                <ScrollView

                >
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss()
                    }}>

                        <View style={styles.wrapper}>
                            <DeletePictures
                                ref={deletePictures => this.deletePictures = deletePictures}
                                app={this.props.screenProps.app}
                                pictures={this.state.pictures}
                                deleteLocalPicture={this.deleteLocalPicture}
                                randerPicturesHandler={this.randerPicturesHandler}
                            />
                            <AddPictures
                                ref={addPictures => this.addPictures = addPictures}
                                addPictureLocal={this.addPictureLocal}
                                updateScreen={true}

                            />
                            <View style={styles.registrationButtonBox}>
                                {this.state.waiting ?
                                    <ActivityIndicator size="small" color="#c3c3b1" />
                                    :
                                    <TouchableOpacity
                                        onPress={this._updatePicturesHandler}
                                    >

                                        <Text style={{ color: 'black' }}>עדכן תמונות</Text>
                                    </TouchableOpacity>
                                }
                                <View style={{ marginTop: 10 }}>
                                    {this.checkError()}
                                </View>

                            </View>

                            <View style={{ paddingHorizontal: 10, marginTop: 9 }}>
                                <View style={styles.infoBox}>
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>קטגוריה: </Text>
                                    <Text>{this.props.navigation.getParam('advertisement').categoryDescription}</Text>
                                </View>
                            </View>

                            <UpdateDescription
                                advertisementId={this.props.navigation.getParam('advertisement').advertisementId}
                                serviceDescription={this.props.navigation.getParam('advertisement').serviceDescription}
                                renderAdvertisements={
                                    (typeof this.props.navigation.getParam('renderAdvertisements') != 'undefined' &&
                                        this.props.navigation.getParam('renderAdvertisements'))
                                        ?
                                        this.props.navigation.getParam('renderAdvertisements')
                                        :
                                        false
                                }
                            />
                            <UpdateAddress
                                advertisementId={this.props.navigation.getParam('advertisement').advertisementId}
                                serviceAddress={this.props.navigation.getParam('advertisement').serviceAddress}
                                renderAdvertisements={
                                    (typeof this.props.navigation.getParam('renderAdvertisements') != 'undefined' &&
                                        this.props.navigation.getParam('renderAdvertisements'))
                                        ?
                                        this.props.navigation.getParam('renderAdvertisements')
                                        :
                                        false
                                }
                            />
                            <UpdatePrice
                                advertisementId={this.props.navigation.getParam('advertisement').advertisementId}
                                price={this.props.navigation.getParam('advertisement').price}
                                renderAdvertisements={
                                    (typeof this.props.navigation.getParam('renderAdvertisements') != 'undefined' &&
                                        this.props.navigation.getParam('renderAdvertisements'))
                                        ?
                                        this.props.navigation.getParam('renderAdvertisements')
                                        :
                                        false
                                }
                            />
                            <UpdatePhoneNumber
                                advertisementId={this.props.navigation.getParam('advertisement').advertisementId}
                                phoneNumber={this.props.navigation.getParam('advertisement').contactPhoneNumber}
                                renderAdvertisements={
                                    (typeof this.props.navigation.getParam('renderAdvertisements') != 'undefined' &&
                                        this.props.navigation.getParam('renderAdvertisements'))
                                        ?
                                        this.props.navigation.getParam('renderAdvertisements')
                                        :
                                        false
                                }
                            />

                            <UpdateName
                                advertisementId={this.props.navigation.getParam('advertisement').advertisementId}
                                name={this.props.navigation.getParam('advertisement').placeName}
                                renderAdvertisements={
                                    (typeof this.props.navigation.getParam('renderAdvertisements') != 'undefined' &&
                                        this.props.navigation.getParam('renderAdvertisements'))
                                        ?
                                        this.props.navigation.getParam('renderAdvertisements')
                                        :
                                        false
                                }
                            />

                            <View style={{ flex: 1, marginHorizontal: 4 }}>
                                {this.state.makeSureDelete ?
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            {this.state.deleteWaiting ?
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="small" color="#c3c3b1" /></View>
                                                :
                                                <TouchableOpacity
                                                    onPress={this.deleteAdvertisement}
                                                    style={{ flex: 1 }}
                                                >
                                                    <Text style={{ color: 'red', textAlign: 'center' }}>מחק</Text>

                                                </TouchableOpacity>
                                            }

                                        </View>

                                        <TouchableOpacity
                                            onPress={() => this.setState({ makeSureDelete: false })}
                                            style={{ flex: 1 }}
                                        >
                                            <Text style={{ color: 'green', textAlign: 'center' }}>ביטול</Text>

                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.setState({ makeSureDelete: true })}
                                        style={{ marginBottom: 10 }}
                                    >
                                        <Text style={{ color: 'red', textAlign: 'center' }}>מחק מודעה</Text>

                                    </TouchableOpacity>
                                }
                            </View>


                        </View>
                    </TouchableWithoutFeedback >
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}



UpdateAdvertisementScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'פרטי מודעה',
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
        marginHorizontal: 5,
        marginTop: 5,
        justifyContent: 'center',
        backgroundColor: '#fff',
        flex: 1,
    },
    input: {
        borderColor: '#767676',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10
    },
    registrationButtonBox: {
        marginTop: 8,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginBottom: 10

    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap'
    }
})


export default UpdateAdvertisementScreen






















