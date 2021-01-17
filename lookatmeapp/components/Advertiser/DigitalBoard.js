//setstate
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import ServerApi from '../../modules/ServerApi'











export default class DigitalBoard extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            error: false,
            deleteWaiting: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
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

    _deleteDigitalBoardFromAdvertisement = async () => {
        try {
            if (!this.state.waiting && this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        deleteWaiting: true
                    }));
                })

            }

            let deleteDigitalBoardFromAdvertisementResponsed = await ServerApi.deleteDigitalBoardFromAdvertisement(this.props.root.props.navigation.getParam('advertisement').advertisementId, this.props.digitalBoard.item.id)

            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        deleteWaiting: false
                    }));
                })
            }
            this.props.root.renderDigitalBoards()
            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        deleteWaiting: false,
                        digitalBoards: [...getDigitalBoardsForAdvertisementsResponsed]
                    }));
                })
            }

        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    deleteWaiting:false
                })
            }
        }


    }

    _showAdvertisement = () => {
        this.props.navigation.navigate({
            routeName: 'ShowDigitalBoardOnMap', params: {
                point: {
                    latitude: this.props.digitalBoard.item.latitude,
                    longitude: this.props.digitalBoard.item.longitude,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }
            }
        })
    }


    render() {

        return (

            <View style={this.props.style ? { ...styles.wrapper, ...this.props.style } : { ...styles.wrapper }}>
                <View >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Text>{' עיר: ' + this.props.digitalBoard.item.city}</Text>

                    </View>
                </View>
                <View >
                    {this.state.makeSureDelete ?
                        <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                {this.state.deleteWaiting ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="small" color="#c3c3b1" /></View>
                                    :
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}
                                        onPress={this._deleteDigitalBoardFromAdvertisement}
                                    >
                                        <Text style={{ color:'red', textAlign: 'center' }}>מחק</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => this.setState({ makeSureDelete: false })}
                            >
                                <Text style={{ color: 'green', textAlign: 'center' }}>ביטול</Text>
                            </TouchableOpacity>
                          
                        </View>
                        :
                        <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', marginTop: 10 }}>
                           
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={this._showAdvertisement}
                            >
                                <Text style={{ textAlign: 'center' }}>צפיה</Text>
                            </TouchableOpacity>
                          
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center' }}
                                onPress={() => this.setState({ makeSureDelete: true })}
                            >
                                <Text style={{ textAlign: 'center', color: 'red' }}>מחק</Text>
                            </TouchableOpacity>
                        </View>

                    }
                </View>
            </View >

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
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
})