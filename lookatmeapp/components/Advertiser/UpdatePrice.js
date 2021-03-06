//setstate
import React from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../../components/Error'
import Input from '../../components/Input'
import InputTypes from '../../constants/InputTypes'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'







export default class UpdatePrice extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            update: false,
            price: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    componentDidMount() {

    }


    updatePrice = async () => {

        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }))
                })
            }
            if (this.price.getText()) {
                let updateAdvertisementPriceResponsed = await ServerApi.updateAdvertisementPrice(this.price.getText(), this.props.advertisementId)

                if (this.mountFlag) {
                    await new Promise(resolved => {
                        this.setState({
                            error: false,
                            price: this.price.getText(),
                            waiting: false,
                            update: false
                        }, () => resolved())
                    })
                    if (this.props.renderAdvertisements) {

                        this.props.renderAdvertisements()
                    }
                }

            } else {
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            error: 'לא הוכנס טקסט',
                            waiting: false
                        }))
                    })
                }
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    waiting: false
                })
            }
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>

                <View style={styles.updateBox}>



                    <View
                        style={{ paddingHorizontal: 10, position: 'relative' }}
                    >
                        <View style={styles.infoBox}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>מחיר:</Text>
                            <Text>{this.state.price ? this.state.price : this.props.price}</Text>
                        </View>
                    </View>




                    <View style={{ justifyContent: 'center', position: 'absolute', left: 18 }}>
                        {this.state.update ?
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                                onPress={() => this.setState({ update: false })}
                            >
                                <FontAwesome5
                                    name={'times-circle'}
                                    size={20}
                                    solid
                                />

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                                onPress={() => this.setState({ update: true })}
                            >
                                <FontAwesome5
                                    name={'marker'}
                                    size={20}
                                    solid
                                />

                            </TouchableOpacity>
                        }
                    </View>


                </View>


                {this.state.update ?
                    <View style={styles.update}>


                        <Input
                            ref={price => this.price = price}
                            type={InputTypes.TEXT}
                            root={this}
                            placeholder='מחיר'
                            defaultValue={this.state.price ? this.state.price.toString() : this.props.price.toString()}
                            multiline={true}
                            focus={true}
                            style={{ borderBottomWidth: 1 }}
                        />

                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        {this.state.waiting ?
                            <View><ActivityIndicator size="small" color="#c3c3b1" /></View>
                            :
                            <TouchableOpacity
                                onPress={this.updatePrice}
                                style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}
                            >

                                <Text style={{ color: 'blue' }}>עדכן </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    :
                    null
                }



                {this.state.error ? <Error errorText={this.state.error} /> : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 15,
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap'
    },
    update: {

        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 5
    },
    updateBox: {
        position: 'relative'
    }
})