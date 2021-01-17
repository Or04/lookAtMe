//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../Error'
import Colors from '../../constants/Colors'




export default class DigitalBoard extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            error: false,
            deleteWaiting: false,
            waiting: false

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
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }

            let deleteDigitalBoardFromAdvertisementResponsed = await ServerApi.deleteDigitalBoardFromAdvertisement(this.props.root.props.navigation.getParam('advertisement').advertisementId, this.props.digitalBoard.item.id)
    
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false
                    }));
                })
            }
            this.props.root.renderDigitalBoards()
            if(this.mountFlag){
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        digitalBoards: [...getDigitalBoardsForAdvertisementsResponsed]
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

    _showAdvertisement = async () => {

        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }

            let getDigitalBoardInfoResponsed = await ServerApi.getDigitalBoardInfo(this.props.digitalId)

            if(this.mountFlag){
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false
                    }));
                })
            }

            this.props.root.props.navigation.navigate({
                routeName: 'ShowDigitalBoardOnMap', params: {
                    point: {
                        latitude: getDigitalBoardInfoResponsed[0].latitude,
                        longitude: getDigitalBoardInfoResponsed[0].longitude,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }
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

    cancelBoard=()=>{
        if(this.mountFlag){
            this.props.root.setState({ digitalBoard: false })
        }
    }

    render() {

        return (
            <View style={this.props.style ? { ...styles.wrapper, ...this.props.style } : { ...styles.wrapper }}>
                <View style={{ alignItems: 'center' }}><Text>נבחר לוח דיגיטלי</Text></View>
                <View >
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Button onPress={this._showAdvertisement} title={'צפיה'} />

                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Button  onPress={this.cancelBoard} color={Colors.red} title={'ביטול'} />
                        </View>
                    </View>
                </View>
                {this.state.waiting ?
                    <ActivityIndicator size="large" color="#c3c3b1" />
                    :
                    null
                }
                <View style={{ marginTop: 10 }}>
                    {this.state.error ? <Error errorText={this.state.error} /> : null}
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