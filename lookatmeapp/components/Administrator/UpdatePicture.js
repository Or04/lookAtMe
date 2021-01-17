//setstateclear
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Picture from '../Administrator/Picrue'
import * as ImagePicker from 'expo-image-picker'








class UpdatePicture extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            waiting: false,
            error: false,
            picture: false,
            picturesBox: false,
            modalVisible: false
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

    addPictureHandler = async () => {
        try {
            let picturePickerResponed = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.1,
                aspect: [1, 1]

            });
            if (typeof picturePickerResponed.uri != 'undefined') {
                if (typeof this.props.updatePictureHandler != 'undefined') {
                    await new Promise(resolved => {
                        resolved(this.props.updatePictureHandler(picturePickerResponed.uri))
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

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {(this.state.picture || this.props.pictureUrl) ?
                        <TouchableOpacity
                            onPress={this.addPictureHandler}
                            style={styles.pictureBox}
                        >
                            <Picture
                                local={this.state.picture ? true : false}
                                uri={this.state.picture ? this.state.picture.uri : this.props.pictureUrl}
                                height={this.state.picture.height}
                                width={this.state.picture.width}
                                showDelete={false}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={this.addPictureHandler}

                        >
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={{
                                    uri: 'http://lookatmeil.com/images/camera.png',
                                }}
                            />
                        </TouchableOpacity>
                    }

                    {/* <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}><Text>הוסף תמונה</Text></View> */}

                </View>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
    },
    pictureBox: {

    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        //  elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})


export default UpdatePicture