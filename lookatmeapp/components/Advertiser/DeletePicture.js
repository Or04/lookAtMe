//setstate
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Image } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../../components/Error'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class DeletePicture extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            error: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    _deleteHandler = async () => {

        if (typeof this.props.localPicture != 'undefined' && this.props.localPicture) {
            if (typeof this.props.deleteLocalPicture != 'undefined') {
                this.props.deleteLocalPicture(this.props.uri)
            }
        } else {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        wating: true
                    }))
                })
            }
            try {
                await ServerApi.removePicture(this.props.uri)
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            wating: false
                        }))
                    })
                }
                if (this.mountFlag) {
                    if (typeof this.props.randerPicturesHandler != 'undefined' && this.props.randerPicturesHandler) {
                        this.props.randerPicturesHandler()
                    }
                }

            } catch (error) {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString()
                    })
                }
            }
            if (this.mountFlag) {
                this.props.root.setState({
                    pictures: this.props.root.state.pictures.filter(picture => picture.uri != this.props.uri)
                })
            }
        }


    }

    render() {
        return (
            <View style={styles.wrapper}>
                {typeof this.props.width != 'undefined' && typeof this.props.height != 'undefined' ?

                    <Image
                        style={{
                            justifyContent: 'center',
                            width: this.props.width,
                            height: this.props.height
                        }}
                        source={{
                            uri: this.props.uri,
                        }}
                    />
                    :
                    <Image
                        style={{
                            justifyContent: 'center',
                            width: Dimensions.get('window').width * 0.95,
                            height: Dimensions.get('window').width * 0.65,
                        }}
                        source={{
                            uri: this.props.uri,
                        }}
                    />

                }
                {this.state.error ? <Error errorText={this.state.error} /> : null}
                {(this.state.makeSureDelete && !this.state.wating) ?
                    <View style={{ width: '80%', top: 0, position: 'absolute', flexDirection: 'row', backgroundColor: 'white', width: '100%',justifyContent:'space-around', height: Dimensions.get('window').width * 0.65 }}>

                        <TouchableOpacity
                            onPress={() => this.setState({ makeSureDelete: false })}
                        >
                            <Text style={{ color: 'green' }}>ביטול</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this._deleteHandler}
                        >
                            <Text style={{ color: 'red' }}>מחיקה</Text>

                        </TouchableOpacity>



                    </View>

                    :

                    <View style={styles.removeButton}>

                        {this.state.wating ?
                            <ActivityIndicator size="small" color="#c3c3b1" />
                            :
                            <TouchableOpacity
                                onPress={() => this.setState({ makeSureDelete: true })}
                            >
                                <FontAwesome5 name={'trash-alt'} color={'#fff'} size={20} solid />

                            </TouchableOpacity>
                        }

                    </View>

                }
            </View>


        )
    }
}


const styles = StyleSheet.create({
    wrapper: {

        alignItems: 'center',
    },
    removeButton: {
        flexDirection: 'row',
        position: 'absolute',
        left: Dimensions.get('window').width * 0.04,
        top: 7
    }
})