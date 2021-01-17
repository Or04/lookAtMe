//setstate clear
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Picture from './Picrue'
import * as ImagePicker from 'expo-image-picker'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'








class AddPictures extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            waiting: false,
            error: false,
            picture: false,
            picturesBox: false,
            modalVisible: false,
            uploadPictureWaiting: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _getPictures = () => {
        return this.state.pictures
    }


    updateUserPicture = async () => {
        try {
            if (typeof this.state.picture != 'undefined' && typeof this.state.picture.uri != 'undefined' && typeof this.props.userEmail != 'undefined') {
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        this.setState({
                            uploadPictureWaiting: true
                        }, () => resolved())
                    })
                }

                let res = await ServerApi.updateUserPicture(this.state.picture.uri, this.props.userEmail)


                if (this.mountFlag) {
                    this.setState({
                        uploadPictureWaiting: false,

                    })
                }
                await this.props.userTypeRander()
            } else {
                if (this.mountFlag) {
                    this.setState({
                        uploadPictureWaiting: false,
                        error: false,
                        picture: false,
                        picturesBox: false,
                    })
                }
            }

        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    uploadPictureWaiting: false
                })

            }
        }
    }

    addPictureHandler = async () => {
        try {
            let picturePickerResponed = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.1,
                aspect: [1, 1]

            });
            if (typeof picturePickerResponed.uri != 'undefined') {
                if (typeof this.props.addPictureHandler != 'undefined') {
                    await new Promise(resolved => {
                        resolved(this.props.addPictureHandler(picturePickerResponed.uri))
                    })
                }
                if (this.mountFlag) {

                    this.setState({
                        picture: { uri: picturePickerResponed.uri, height: picturePickerResponed.height, width: picturePickerResponed.width, type: picturePickerResponed.type }
                    })
                }
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({ error: error.toString() })

            }
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
                    {(this.state.picture || this.props.userPictureUri) ?
                        <TouchableOpacity
                            onPress={this.addPictureHandler}
                            style={{
                                width: Dimensions.get('window').width * 0.3,
                                height: Dimensions.get('window').width * 0.3,
                                borderRadius: (Dimensions.get('window').width * 0.3) / 2,
                                borderColor: 'gray',
                                justifyContent: 'center',
                                alignItems: 'center'

                            }}
                        >
                            <Picture

                                key={this.state.picture ? this.state.picture.uri : this.props.userPictureUri ? `http://lookatmeil.com/${this.props.userPictureUri}` : null}
                                uri={this.state.picture ? this.state.picture.uri : this.props.userPictureUri ? `http://lookatmeil.com/${this.props.userPictureUri}` : null}


                            />
                            {(this.state.uploadPictureWaiting) ?
                                <View
                                    style={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 5 }}
                                >

                                    <ActivityIndicator size="large" color="gray" />
                                </View>
                                :
                                <View
                                    style={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 5 }}
                                >
                                    {this.state.picture ?

                                        <TouchableOpacity
                                            onPress={this.updateUserPicture}
                                        >
                                            <Text style={{}}>עדכן תמונה</Text>

                                        </TouchableOpacity>
                                        :
                                        null

                                    }

                                </View>



                            }
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={this.addPictureHandler}
                            style={{
                                width: Dimensions.get('window').width * 0.3,
                                height: Dimensions.get('window').width * 0.3,
                                backgroundColor: '#fff',
                                borderRadius: (Dimensions.get('window').width * 0.3) / 2,
                                borderWidth: 1,
                                borderColor: 'gray',
                                justifyContent: 'center',
                                alignItems: 'center'

                            }}
                        >

                            <FontAwesome5
                                name={'camera-retro'}
                                size={20}
                                solid
                                style={{}}
                            />
                        </TouchableOpacity>
                    }

                </View>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: Dimensions.get('window').height * 0.168,
        zIndex: 10000
    },
    pictureBox: {

    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    image: {
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        borderRadius: (Dimensions.get('window').width * 0.7) / 2

    }
})


export default AddPictures