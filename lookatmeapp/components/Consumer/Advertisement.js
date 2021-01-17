
//setstate
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, Platform, TouchableOpacity, Modal, Dimensions } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../Error'
import Picture from '../Advertiser/Picture'
import * as Linking from 'expo-linking'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'





export default class Advertisement extends React.Component {
    constructor() {
        super()

        this.state = {
            waiting: false,
            bookmarkWaiting: false,
            error: false,
            pictures: [],
            modalVisible: false,
            modalPictureIndex: 0
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {


        this._updatePicturesForAdvertisement()
    }

    _updatePicturesForAdvertisement = async () => {
        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    waiting: true
                }))
            })
        }
        try {


            let getPicturesForAdvertisementResponsed;






            if (typeof this.props.advertisement.item.id != 'undefined') {
                getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.advertisement.item.userEmail, this.props.advertisement.item.id)
            } else if (typeof this.props.advertisement.item.advertisementsId != 'undefined') {
                getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.advertisement.item.userEmail, this.props.advertisement.item.advertisementsId)
            } else {
                getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.advertisement.item.userEmail, this.props.advertisement.item.advertisementId)
            }



            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        pictures: [...getPicturesForAdvertisementResponsed],
                        waiting: false
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
    _updateAdvertisementHandler = () => {
        this.props.navigation.navigate({
            routeName: 'UpdateAdvertisement',
            params: {
                advertisement: this.props.advertisement.item,
                root: this.props.root
            }
        })
    }
    _digitalBoardsForAdvertisement = () => {
        this.props.navigation.navigate({
            routeName: 'DigitalBoards',
            params: {
                advertisement: this.props.advertisement.item,
                root: this.props.root
            }
        })
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    switchImages = () => {
        this.setState({ modalPictureIndex: (this.state.modalPictureIndex + 1) })
    }

    addAdvertisementForConsumer = async () => {

        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    bookmarkWaiting: true
                }))
            })
        }
        try {


            let addAdvertisementForConsumerResponsed

            if (typeof this.props.consumerEmail != 'undefined') {

                if (typeof this.props.advertisement.item.id != 'undefined') {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.consumerEmail, this.props.advertisement.item.id)
                } else if (typeof this.props.advertisement.item.advertisementsId != 'undefined') {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.consumerEmail, this.props.advertisement.item.advertisementsId)
                } else {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.consumerEmail, this.props.advertisement.item.advertisementId)

                }
            } else {

                if (typeof this.props.advertisement.item.id != 'undefined') {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.id)
                } else if (typeof this.props.advertisement.item.advertisementsId != 'undefined') {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.advertisementsId)
                } else {
                    addAdvertisementForConsumerResponsed = await ServerApi.addAdvertisementForConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.advertisementId)

                }
            }




            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        bookmarkWaiting: false
                    }))
                })
            }


            if (typeof this.props.renderAdvertisementsForConsumer != 'undefined') {
                this.props.renderAdvertisementsForConsumer(false)
            } else if (typeof this.props.renderAdvertisements != 'undefined') {
                this.props.renderAdvertisements(false)
            } else {

                if (typeof this.props.root.renderAdvertisements != 'undefined') {
                    this.props.root.renderAdvertisements()
                } else {
                    this.props.root._renderAdvertisementsForConsumer()
                }
            }

        } catch (error) {

            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    bookmarkWaiting: false
                })
            }
        }


    }

    deleteAdvertisementFormConsumer = async () => {

        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    bookmarkWaiting: true
                }))
            })
        }
        try {
            let deleteAdvertisementFormConsumerResponsed

            if (typeof this.props.consumerEmail != 'undefined') {

                if (typeof this.props.advertisement.item.id != 'undefined') {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.consumerEmail, this.props.advertisement.item.id)
                } else if (typeof this.props.advertisement.item.advertisementsId != 'undefined') {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.consumerEmail, this.props.advertisement.item.advertisementsId)
                } else {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.consumerEmail, this.props.advertisement.item.advertisementId)

                }
            } else {

                if (typeof this.props.advertisement.item.id != 'undefined') {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.id)
                } else if (typeof this.props.advertisement.item.advertisementsId != 'undefined') {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.advertisementsId)
                } else {
                    deleteAdvertisementFormConsumerResponsed = await ServerApi.deleteAdvertisementFormConsumer(this.props.root.props.screenProps.app.state.userEmail, this.props.advertisement.item.advertisementId)

                }
            }




            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        bookmarkWaiting: false
                    }))
                })
            }

            if (typeof this.props.renderAdvertisementsForConsumer != 'undefined') {
                this.props.renderAdvertisementsForConsumer(false)
            } else if (typeof this.props.renderAdvertisements != 'undefined') {
                this.props.renderAdvertisements(false)
            } else {

                if (typeof this.props.root.renderAdvertisements != 'undefined') {
                    this.props.root.renderAdvertisements()
                } else {
                    this.props.root._renderAdvertisementsForConsumer()
                }

            }


        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    bookmarkWaiting: false
                })
            }
        }


    }




    render() {
        const { modalVisible } = this.state
        return (

            <View style={this.props.style ? { ...styles.wrapper, ...this.props.style } : { ...styles.wrapper }}>
                {this.state.waiting ?
                    <View
                        style={{
                            width: Dimensions.get('window').width * 0.90,
                            height: Dimensions.get('window').width * 0.65,
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator size="small" color="#c3c3b1" />


                    </View>
                    :

                    <TouchableOpacity

                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {typeof this.state.pictures[0] != 'undefined' ?

                                <Picture
                                    style={{
                                        width: Dimensions.get('window').width * 0.88,
                                        height: Dimensions.get('window').width * 0.65,

                                    }}

                                    uri={`http://lookatmeil.com/${this.state.pictures[0]}`}

                                    root={this}
                                    showDelete={false}
                                />
                                :
                                null
                            }
                        </View>
                    </TouchableOpacity>
                }
                {this.state.error ? <Error errorText={this.state.error} /> : null}

                <View style={{ alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingHorizontal: Dimensions.get('window').width * 0.05, flexDirection: Platform.OS === 'ios' ? 'row' : 'row-reverse', }}>
                    <TouchableOpacity

                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                    >
                        <View style={{ justifyContent: 'space-around', width: '100%' }}>
                            <View style={styles.categoryInfo}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>קטגוריה: </Text>
                                <Text>{this.props.advertisement.item.categoryDescription}</Text>
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>שם מקום: </Text>
                                <Text>{this.props.advertisement.item.placeName}</Text>
                            </View>



                        </View>

                    </TouchableOpacity>
                    {this.state.bookmarkWaiting ?
                        <ActivityIndicator size="small" color="#c3c3b1" />
                        :
                        <View>

                            {typeof this.props.advertisement.item.userAd != 'undefined' ?
                                <TouchableOpacity onPress={this.deleteAdvertisementFormConsumer} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                    <FontAwesome5 name={'bookmark'} size={20} solid />

                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={this.addAdvertisementForConsumer} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                    <FontAwesome5 name={'bookmark'} size={20} />
                                </TouchableOpacity>


                            }
                        </View>
                    }
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.modalBox}>
                        <ScrollView>
                            <View style={styles.modalView}>

                                <View style={{ position: 'relative', width: '100%', height: Dimensions.get('window').width }}>

                                    {typeof this.state.pictures[this.state.modalPictureIndex % (this.state.pictures.length)] != 'undefined' ?
                                        <TouchableOpacity


                                            onPress={this.switchImages}
                                            style={styles.pictureBox}

                                        >
                                            <Picture style={{ marginVertical: 10 }}
                                                uri={`http://lookatmeil.com/${this.state.pictures[this.state.modalPictureIndex % (this.state.pictures.length)]}`}
                                                root={this}
                                                showDelete={false}
                                                style={{
                                                    width: Dimensions.get('window').width,
                                                    height: Dimensions.get('window').width,

                                                }}
                                            />
                                        </TouchableOpacity>
                                        :
                                        null}



                                </View>


                                <TouchableOpacity
                                    style={{ position: 'absolute', width: '100%', paddingHorizontal: 10 }}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>x</Text>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', position: 'absolute', top: (Dimensions.get('window').width - 15) }}>

                                    {this.state.pictures.map(item => {
                                        if (item == this.state.pictures[this.state.modalPictureIndex % (this.state.pictures.length)]) {
                                            return <FontAwesome5 key={item} name={'circle'} size={10} solid />
                                        } else {
                                            return <FontAwesome5 key={item} name={'circle'} size={10} />
                                        }

                                    })}
                                </View>

                                <View style={{ paddingHorizontal: 10, marginTop: 9 }}>

                                    <View style={styles.infoBox}>
                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>קטגוריה: </Text>
                                        <Text>{this.props.advertisement.item.categoryDescription}</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>שם מקום: </Text>
                                        <Text>{this.props.advertisement.item.placeName}</Text>
                                    </View>


                                    <View style={styles.infoBox}>
                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>כתובת: </Text>
                                        <Text>{this.props.advertisement.item.serviceAddress}</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>מחיר: </Text>
                                        <Text>{this.props.advertisement.item.price}</Text>
                                    </View>
                                    <View style={styles.infoBox} >

                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>טלפון: </Text>
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(`tel:${this.props.advertisement.item.contactPhoneNumber}`)}
                                        >
                                            <Text style={{ color: 'blue' }}>{this.props.advertisement.item.contactPhoneNumber}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoBox} >
                                        <Text style={{ color: 'black', fontWeight: 'bold' }}>תיאור: </Text>
                                        <Text >{this.props.advertisement.item.serviceDescription}</Text>
                                    </View>









                                </View>

                                <View style={{ position: 'absolute', top: (Dimensions.get('window').width + 9), left: 10 }}>

                                    {this.state.waiting ? <ActivityIndicator size="small" color="#c3c3b1" /> :
                                        <View>
                                            {typeof this.props.advertisement.item.userAd != 'undefined' ?
                                                <TouchableOpacity onPress={this.deleteAdvertisementFormConsumer} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                                    <FontAwesome5 name={'bookmark'} size={20} solid />

                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={this.addAdvertisementForConsumer} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                                                    <FontAwesome5 name={'bookmark'} size={20} />
                                                </TouchableOpacity>
                                

                                            }
                                        </View>

                                    }

                                </View>



                            </View>

                        </ScrollView>


                    </View>
                </Modal>


            </View>

        )


    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: '#c3c3b1',
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    categoryInfo: {
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        justifyContent: 'flex-start',
    },

    modalBox: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',

    },
    modalView: {
        marginTop: Platform.OS == 'ios' ? 50 : 0,
        backgroundColor: "#fff",

        alignItems: "center",
        position: 'relative'

    },
    pictureBox: {
        position: 'absolute'
    },
    textStyle: {
        textAlign: 'left',

        fontSize: 30,
        lineHeight: 30

    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap'
    }
})