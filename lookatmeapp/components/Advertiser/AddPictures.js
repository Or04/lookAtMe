//setstate
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform, Modal } from 'react-native'
import Picture from '../Advertiser/Picture'
import * as ImagePicker from 'expo-image-picker'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import DeletePicture from './DeletePicture'







export default class AddPictures extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            waiting: false,
            error: false,
            pictures: [],
            picturesBox: false,
            modalVisible: false,
            pictureIndex: 0
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
    _addPictureHandler = async () => {
        try {
            let picturePickerResponed = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.1,
                aspect: [1, 1]

            });
            if (this.mountFlag && typeof picturePickerResponed.uri != 'undefined') {
                await new Promise(resolved => {
                    this.setState({
                        pictures: [...this.state.pictures, { uri: picturePickerResponed.uri, height: picturePickerResponed.height, width: picturePickerResponed.width, type: picturePickerResponed.type }]
                    }, () => resolved())

                })
                if (typeof this.props.addPictureLocal != 'undefined') {
                    this.props.addPictureLocal({ uri: picturePickerResponed.uri, height: picturePickerResponed.height, width: picturePickerResponed.width, type: picturePickerResponed.type })

                }
            }

        } catch (error) {
            if (this.mountFlag) {
                this.setState({ error: error.toString() })

            }
        }
    }

    deleteLocalPicture = (uri) => {
        let index = -1
        for (let i = 0; i < this.state.pictures.length; i++) {
            if (this.state.pictures[i].uri == uri) {
                index = i
            }
        }
        if (index > -1) {
            let temp = [...this.state.pictures]

            temp.splice(index, 1)

            this.setState({
                pictures: [...temp]
            })
        }

    }


    switchImages = () => {
        this.setState({ pictureIndex: (this.state.pictureIndex + 1) })
    }

    render() {
        const { modalVisible } = this.state
      
        return (
            <View style={styles.wrapper}>

                {(typeof this.props.showPictures != 'undefined' && this.props.showPictures) ?
                    <View style={{ position: 'relative' }}>

                        {(typeof this.state.pictures[0] != 'undefined' && typeof this.state.pictures[this.state.pictureIndex % (this.state.pictures.length)] != 'undefined') ?


                            <TouchableOpacity
                                onPress={this.switchImages}
                                style={styles.pictureBox}

                            >

                                <DeletePicture
                                    key={this.state.pictures[this.state.pictureIndex % (this.state.pictures.length)].uri}
                                    uri={this.state.pictures[this.state.pictureIndex % (this.state.pictures.length)].uri}
                                    localPicture={this.state.pictures[this.state.pictureIndex % (this.state.pictures.length)].uri.indexOf('images/') != -1 ? false : true}
                                    root={this}
                                    width={Dimensions.get('window').width * 0.80}
                                    height={Dimensions.get('window').width * 0.65}
                                    deleteLocalPicture={this.deleteLocalPicture}
                                />

                            </TouchableOpacity>

                            :
                            null}




                        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 5, width: '100%', justifyContent: 'center' }}>

                            {this.state.pictures.map(item => {

                                if (item.uri == this.state.pictures[this.state.pictureIndex % (this.state.pictures.length)].uri) {
                                    return <FontAwesome5 key={item.uri} name={'circle'} size={10} solid />
                                } else {
                                    return <FontAwesome5 key={item.uri} name={'circle'} size={10} />
                                }

                            })}
                        </View>

                    </View>
                    :

                    null
                }


                <View style={{ justifyContent: 'center' }}>
                    {(typeof this.props.updateScreen != 'undefined' && this.props.updateScreen)

                        ?

                        <View style={{ position: 'absolute', left: 18, top: 5 }}>
                            <TouchableOpacity
                                onPress={this._addPictureHandler}
                            >
                                <FontAwesome5 name={'camera-retro'} size={20} solid />
                            </TouchableOpacity>
                        </View>


                        :

                        <TouchableOpacity
                            onPress={this._addPictureHandler}
                            style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', flexDirection:  Platform.OS == 'ios' ? 'row-reverse' : 'row', }}
                        >
                            <FontAwesome5 name={'camera-retro'} size={20} solid />
                        </TouchableOpacity>


     

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
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 20 }}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>סגור</Text>
                            </TouchableOpacity>

                            <ScrollView

                                horizontal={true}
                                centerContent={true}

                            >
                                {this.state.pictures.map(picture => {
                                    return <Picture style={{ marginVertical: 10 }}
                                        key={picture.uri}
                                        uri={picture.uri}
                                        height={picture.height}
                                        width={picture.width}
                                        root={this}
                                    />
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

      


            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
    },
    removeButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'yellow',
    },
    pictureBoxView: {

        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})