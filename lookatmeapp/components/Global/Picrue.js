//setstate clear

import React from 'react'
import { Text, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Dimensions, Image } from 'react-native'
import Colors from '../../constants/Colors'







export default class Picture extends React.Component {
    constructor() {
        super()
        this.state = {
            makeSureDelete: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }
    _deleteHandler = () => {
        if (this.mountFlag) {
            this.props.root.setState({
                pictures: this.props.root.state.pictures.filter(picture => picture.uri != this.props.uri)
            })
        }
    }

    showDelete = () => {
        if (typeof this.props.showDelete == 'undefined') {
            return (
                <View>
                    {
                        this.state.makeSureDelete ?
                            <View style={{ ...styles.removeButton, marginBottom: 10 }}>
                                <View style={{ flex: 1, marginRight: 5 }}>
                                    <Button
                                        title={'ביטול'}
                                        color={Colors.green}
                                        onPress={() => this.setState({ makeSureDelete: false })}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <Button
                                        title={'מחיקה'}
                                        color={Colors.red}
                                        onPress={this._deleteHandler}
                                    />
                                </View>

                            </View>

                            :
                            <View style={styles.removeButton}>
                                <View style={{ flex: 1, marginBottom: 10 }}>
                                    <Button
                                        title={'מחיקה'}
                                        color={Colors.red}
                                        onPress={() => this.setState({ makeSureDelete: true })}
                                    />
                                </View>
                            </View>
                    }
                </View>

            )
        }
    }

    render() {
        return (
            <View style={styles.imageBox}>
                <Image
                    style={styles.image}
                    source={{
                        uri: (typeof this.props.local != 'undefined' && this.props.local) ? this.props.uri : `${this.props.uri}`,
                        cache: 'reload'
                    }}
                />
            </View>


        )
    }
}


const styles = StyleSheet.create({
    imageBox: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    image: {
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        borderRadius: (Dimensions.get('window').width * 0.3) / 2,
        backgroundColor:'#fff',
        borderColor:'gray',
        borderWidth:1
    }
})