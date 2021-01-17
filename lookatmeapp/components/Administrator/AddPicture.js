//setstate clear
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import Picture from '../Administrator/Picrue'
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

                <View style={{
                    justifyContent:'center',
                    alignItems:'center',
                 }}>
                    {this.state.picture ?
                        <TouchableOpacity
                            onPress={this.addPictureHandler}
                            style={styles.pictureBox}
                        >
                            <Picture
                                key={this.state.picture.uri}
                                uri={this.state.picture.uri}
                                showDelete={false}
                                local={true}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={this.addPictureHandler}
                            style={{
                                width: Dimensions.get('window').width * 0.2,
                                height: Dimensions.get('window').width * 0.2,
                                borderRadius: (Dimensions.get('window').width * 0.7) / 2,
                                borderColor:'gray',
                                borderWidth:1,
                                justifyContent:'center',
                                alignItems:'center'
                            }}

                        >

                            <FontAwesome5
                                name={'camera-retro'}
                                size={20}
                                solid
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
        marginTop:5
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
})


export default AddPictures