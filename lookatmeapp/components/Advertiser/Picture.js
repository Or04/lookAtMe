//setstate
import React from 'react'
import {  View, StyleSheet, Button, Dimensions, Image } from 'react-native'
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
        if(this.mountFlag){
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
            <View style={((typeof this.props.showDelete != 'undefined') && (this.props.showDelete == false)) ? null : styles.wrapper}>
                {this.showDelete()}



                <Image
                    style={typeof this.props.style != 'undefined' ? { ...styles.image, ...this.props.style } : { ...styles.image }}
                    source={{
                        uri: this.props.uri,
                    }}
                />
            </View>


        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    removeButton: {
        flexDirection: 'row',
    },
    image: {
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.50,
        height: Dimensions.get('window').width * 0.50
    }
})