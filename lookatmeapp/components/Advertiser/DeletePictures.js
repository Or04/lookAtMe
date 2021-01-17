//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Dimensions, Image, Platform } from 'react-native'
import DeletePicture from './DeletePicture'
import * as ImagePicker from 'expo-image-picker'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class DeletePictures extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false,
            waiting: false,
            error: false,
            pictures: [],
            picturesBox: false,
            modalPictureIndex: 0
        }
        this.mountFlag = true

    }


    switchImages = () => {
        this.setState({ modalPictureIndex: (this.state.modalPictureIndex + 1) })
    }
    componentWillUnmount() {
        this.mountFlag = false
    }

    componentDidMount() {
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
              
                this.setState({
                    pictures: [...this.state.pictures, { uri: picturePickerResponed.uri, height: picturePickerResponed.height, width: picturePickerResponed.width, type: picturePickerResponed.type }]
                })
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

                <View style={{ position: 'relative' }}>

                        {typeof this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)] != 'undefined' ?
                            <TouchableOpacity


                                onPress={this.switchImages}
                                style={styles.pictureBox}

                            >

                                <DeletePicture
                                    key={`http://lookatmeil.com/${this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)]}`}
                                    uri={this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)].indexOf('images/') != -1 ? `http://lookatmeil.com/${this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)]}`:this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)]}
                                    localPicture={this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)].indexOf('images/') != -1 ? false:true}
                                    root={this}
                                    deleteLocalPicture={this.props.deleteLocalPicture}
                                    randerPicturesHandler={typeof this.props.randerPicturesHandler !='undefined' ? this.props.randerPicturesHandler : false}
                                />
                            </TouchableOpacity>


                            :
                            null}




                    <View style={{ flexDirection: 'row', position: 'absolute', bottom:5,width:'100%',justifyContent:'center' }}>

                        {this.props.pictures.map(item => {
                            if (item == this.props.pictures[this.state.modalPictureIndex % (this.props.pictures.length)]) {
                                return <FontAwesome5 key={item} name={'circle'} size={10} solid />
                            } else {
                                return <FontAwesome5 key={item} name={'circle'} size={10} />
                            }

                        })}
                    </View>

                </View>


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
    }
})