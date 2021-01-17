//setstate
import React from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import MapView from 'react-native-maps'
import { Marker, } from 'react-native-maps'
import ServerApi from '../../modules/ServerApi'
import MenuOption from '../../constants/MenuOption'
import Advertisement from '../../components/Consumer/Advertisement'
import { Rating } from 'react-native-ratings'






class RankAdvertiserScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            advertisements: [],
            rank: 0,
            rankInPast: false
        }
        this.mountFlag = true

    }
    componentWillUnmount() {
        this.mountFlag = false
    }


    componentDidMount() {
    }

    checkForRank = async () => {
        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }


            let checkForConsumerRankResponsed = await ServerApi.checkForConsumerRank(this.props.navigation.getParam('advertiserEmail'), this.props.navigation.getParam('consumerEmail'))



            if (this.mountFlag && checkForConsumerRankResponsed.length > 0) {

                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: false,
                        rankInPast: checkForConsumerRankResponsed[0]
                    }));
                })
            } else {
                if (this.mountFlag) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            waiting: false,
                        }));
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

    finishRankHandler = (rank) => {
        if (this.mountFlag) {
            this.setState({
                rank: rank
            })
        }
    }

    RankAdvertiser = async () => {
        if (this.mountFlag) {
            await new Promise(resolved => {
                resolved(this.setState({
                    waiting: true
                }))
            })
        }
        try {

            let rankAdvertiserResponsed = await ServerApi.rankAdvertiser(this.props.navigation.getParam('advertiserEmail'), this.props.navigation.getParam('consumerEmail'), this.state.rank)

            if (this.mountFlag) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        rankInPast: rankAdvertiserResponsed[0],
                        waiting: false
                    }))
                })
            }
            if(this.props.navigation.getParam('renderAdvertisements')){
              await  this.props.navigation.getParam('renderAdvertisements')()
            }
            this.props.navigation.pop()
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
                {this.props.navigation.getParam('rank')!=false ?
                    <View>
                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        <Text style={{ textAlign: 'center', marginVertical: 10 }}>מפרסם דורג</Text>
                        <Rating
                            onFinishRating={this.finishRankHandler}
                            ref={rankAdvertiser => { this.rankAdvertiser = rankAdvertiser }}
                            style={{ direction: Platform.OS == 'ios' ? 'ltr' : 'rtl' }}
                            ratingCount={5}
                            defaultRating={this.props.navigation.getParam('rank')-1}
                            readonly={true}
                            startingValue={this.props.navigation.getParam('rank')-1}

                        />



                    </View>
                    :
                    <View>


                        <View style={{ flexDirection: 'row-reverse', marginTop: 20 }}>
                            <View >
                                <Rating
                                    onFinishRating={this.finishRankHandler}
                                    ref={rankAdvertiser => { this.rankAdvertiser = rankAdvertiser }}
                                    style={{ direction: Platform.OS == 'ios' ? 'ltr' : 'rtl' }}
                                    ratingCount={5}

                                />
                                {this.state.waiting ?
                                    <ActivityIndicator size="large" color="#c3c3b1" />


                                    :

                                    <TouchableOpacity
                                        onPress={this.RankAdvertiser}
                                        style={{ marginVertical: 10 }}
                                    >
                                        <Text style={{ textDecorationLine: 'underline', textAlign: 'center' }}>דרג</Text>
                                    </TouchableOpacity>
                                }

                            </View>

                        </View>

                    </View>


                }
                <View style={{ marginBottom: 10 }}>

                    {this.state.error ? <Error errorText={this.state.error} /> : null}
                </View>

            </View>
        )
    }

}


RankAdvertiserScreen.navigationOptions = (data) => {

    return {
        headerTitle: 'דרג מפרסם',
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'




    },

})


export default RankAdvertiserScreen