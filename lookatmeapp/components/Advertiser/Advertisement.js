//setstate
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator,  TouchableOpacity, Dimensions } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../Error'
import Picture from '../Advertiser/Picture'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class Advertisement extends React.Component {
    constructor() {
        super()

        this.state = {
            waiting: false,
            error: false,
            pictures: [],
            modalVisible: false
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
            let getPicturesForAdvertisementResponsed = await ServerApi.getPicturesForAdvertisement(this.props.advertisement.item.userEmail, this.props.advertisement.item.advertisementId)
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

    updateAdvertisementHandler = () => {

        this.props.navigation.navigate({
            routeName: 'UpdateAdvertisement',
            params: {
                advertisement: this.props.advertisement.item,
                root: this.props.root,
                renderAdvertisements: typeof this.props.renderAdvertisements != 'undefined' ? this.props.renderAdvertisements : false
            }
        })
    }
    _digitalBoardsForAdvertisement = () => {


        this.props.navigation.navigate({
            routeName: 'DigitalBoards',
            params: {
                advertisement: this.props.advertisement.item,
                root: this.props.root,

            }
        })
    }


    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {

        const { modalVisible } = this.state
        return (

            <View style={this.props.style ? { ...styles.wrapper, ...this.props.style, paddingVertical: Dimensions.get('window').height * 0.03, } : { ...styles.wrapper, paddingVertical: Dimensions.get('window').height * 0.03 }}>


                {this.state.waiting ?
                    <View style={{
                        width: Dimensions.get('window').width * 0.90,
                        height: Dimensions.get('window').width * 0.65, alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :
                    <View
                        style={{ flex: 1 }}
                    >
                        {this.state.pictures.length > 0 ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                {typeof this.state.pictures[0] != 'undefined' ?
                                    <Picture
                                        style={{
                                            width: Dimensions.get('window').width * 0.90,
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
                            :
                            <View style={{
                                width: Dimensions.get('window').width * 0.90,
                                height: Dimensions.get('window').width * 0.65,
                            }} />

                        }

                    </View>

                }


                <View style={{ zIndex: 1000, position: 'absolute', top: Dimensions.get('window').height * 0.04, left: Dimensions.get('window').width * 0.055 }}>
                    <TouchableOpacity
                        onPress={this.updateAdvertisementHandler}


                    >

                        <FontAwesome5 name={'edit'} color={this.state.pictures.length > 0 ? '#fff' : '#000'} size={20} solid />

                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={this._digitalBoardsForAdvertisement}
                    style={{ zIndex: 1000, position: 'absolute', top: ((Dimensions.get('window').width * 0.65) + 30), left: Dimensions.get('window').width * 0.055 }}

                >

                    <FontAwesome5 name={'desktop'} size={20} solid />
                

                </TouchableOpacity>




                {this.state.error ? <Error errorText={this.state.error} /> : null}

                <View style={{ paddingHorizontal: 10, marginTop: 9 }}>
                    <View style={{ ...styles.infoBox, }}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>שם מקום: </Text>
                        <Text>{this.props.advertisement.item.placeName}</Text>
                    </View>
                    {typeof this.props.advertisement.item.views != 'undefined' ?
                        <View style={styles.infoBox}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>כמות צפיות : </Text>
                            <Text>{this.props.advertisement.item.views}</Text>
                        </View>
                        :
                        null
                    }

                    <View style={styles.infoBox}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>קטגוריה: </Text>
                        <Text>{this.props.advertisement.item.categoryDescription}</Text>
                    </View>


                    <View style={styles.infoBox}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>כתובת: </Text>
                        <Text>{this.props.advertisement.item.serviceAddress}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>מחיר: </Text>
                        <Text>{this.props.advertisement.item.price}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>טלפון: </Text>
                        <Text>{this.props.advertisement.item.contactPhoneNumber}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={{ textAlign: Platform.OS == 'ios' ? 'left' : 'right', }}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>תיאור: </Text>
                            <Text >{this.props.advertisement.item.serviceDescription}</Text>
                        </Text>
                    </View>
                </View>

            </View >

        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,

        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        position: 'relative',
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    modalBox: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: '#00000000',
        justifyContent: 'center'

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    infoLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexDirection: 'row-reverse'
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        alignItems: 'center'

    }
})