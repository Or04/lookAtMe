//setstate
import React from 'react'
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    Button,
    ActivityIndicator,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView
} from 'react-native'
import Colors from '../../constants/Colors'
import Input from '../../components/Input'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import InputTypes from '../../constants/InputTypes'
import AddPictures from '../../components/Advertiser/AddPictures'






class AdvertisementInfoScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            categories: [],
            selectedCategory: false,
            pictures: [],
            picturesBox: false,
            watingInfo: false
        }
        this.mountFlag = true

    }


    componentWillUnmount() {
        this.mountFlag = false
    }





    addAdvertisementHandler = async () => {
        if (this.serviceDescription.getText() && this.serviceAddress.getText() && this.servicePrice.getText() && this.serviceName.getText()) {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        watingInfo: true
                    }))
                })
            }
            try {
                let addAdvertisementResponed = await ServerApi.addAdvertisement(
                    this.props.screenProps.app.state.userEmail,
                    this.props.navigation.getParam('selectedCategory'),
                    this.serviceDescription.getText(),
                    this.serviceAddress.getText(),
                    this.servicePrice.getText(),
                    this.serviceName.getText(),
                    this.servicePhoneNumber.getText()
                )

                let pictures = this.addPictures._getPictures()
                for (let i = 0; i < pictures.length; i++) {
                    await ServerApi.addPicture(pictures[i], this.props.screenProps.app.state.userEmail, addAdvertisementResponed)
                }


                await new Promise(resolved => {
                    resolved(this.props.navigation.getParam('root').renderAdvertisements())
                })

                this.props.navigation.popToTop()
            } catch (error) {
                if (this.mountFlag) {
                    this.setState({
                        error: error.toString(),
                        waiting: false,
                        watingInfo: false

                    })
                }
            }
        } else {
            if (this.mountFlag) {
                this.setState({
                    error: 'לא הוכנסו כל הפרטים'
                })
            }
        }
    }

    checkError = () => {
        if (this.state.error) {
            return <Error errorText={this.state.error} />
        }
    }



    render() {
        return (

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}

            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView >
                        <View style={styles.wrapper}>
                            <View style={styles.registrationBox}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text>{this.props.navigation.getParam('selectedCategoryDescription')}</Text>
                                </View>

                                <Input
                                    ref={serviceName => this.serviceName = serviceName}
                                    type={InputTypes.TEXT}
                                    root={this}
                                    placeholder='שם'
                                    underLine={true}
                                />

                                <Input
                                    ref={serviceAddress => this.serviceAddress = serviceAddress}
                                    type={InputTypes.TEXT}
                                    root={this}
                                    placeholder='כתובת שירות'
                                    underLine={true}
                                />
                                <Input
                                    ref={serviceDescription => this.serviceDescription = serviceDescription}
                                    style={{ height: 30 }}
                                    multiline={true}
                                    type={InputTypes.TEXT}
                                    root={this}
                                    placeholder='תיאור משרה'
                                    underLine={true}
                                />
                                <Input
                                    ref={servicePhoneNumber => this.servicePhoneNumber = servicePhoneNumber}
                                    type={InputTypes.PHONENUMBER}
                                    root={this}
                                    placeholder='מספר טלפון'
                                    underLine={true}
                                />

                                <Input
                                    ref={servicePrice => this.servicePrice = servicePrice}
                                    type={InputTypes.TEXT}
                                    root={this}
                                    placeholder='מחיר משרה'

                                    underLine={true}
                                    multiline={true}
                                />


                                <AddPictures
                                    ref={addPictures => this.addPictures = addPictures}
                                    showPictures={true}
                                />

                                <View style={styles.registrationButtonBox}>
                                    {this.state.watingInfo ?
                                        <ActivityIndicator size="small" color="#c3c3b1" />
                                        :

                                        <TouchableOpacity
                                            onPress={this.addAdvertisementHandler}
                                        >
                                            <Text style={{textAlign:'center',textDecorationLine:'underline'}}>פרסם</Text>

                                        </TouchableOpacity>
                                    }
                                    <View style={{ marginTop: 10 }}>
                                        {this.checkError()}
                                    </View>

                                </View>

                            </View>

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
}



AdvertisementInfoScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'פרטי מודעה',
        headerStyle: {
            backgroundColor: Colors.header,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
    }
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,



    },
    registrationBox: {
        padding: 30,
        marginTop: 50,
        borderWidth: 0,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
    },
    registrationButtonBox: {
        marginTop: 10
    }
})


export default AdvertisementInfoScreen






















