//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableWithoutFeedback } from 'react-native'
import Colors from '../constants/Colors'
import Input from '../components/Input'
import Error from '../components/Error'
import ServerApi from '../modules/ServerApi'
import RankCategory from '../components/Consumer/RankCategory'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import RankCategories from '../modules/rankCategories'






class RankCategoriesScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            text: '',
            rankCategories: [],
            disableCategories: [],
            updateWaiting: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    randerCategories = async () => {
        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }
            let allCategories = await ServerApi.getAllCategories()
            let userRankCategories = await ServerApi.userRankCategories(this.props.screenProps.app.state.userEmail)

            userRankCategories = RankCategories.addPictureToUserCategory(allCategories, userRankCategories)
            allCategories = RankCategories.filterCategories(allCategories, userRankCategories)

            userRankCategories.sort((a, b) => a.rank - b.rank)
            if (this.mountFlag) {
                this.setState({
                    waiting: false,
                    disableCategories: [...allCategories],
                    rankCategories: [...userRankCategories]
                })
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


    async componentDidMount() {
        this.randerCategories()
    }




    addCategoryHandler = async () => {

    }

    updateCategories = async () => {
        try {
            if (this.mountFlag) {
                await new Promise(resolved => {
                    this.setState({
                        updateWaiting: true
                    }, () => resolved())
                })
            }
            if (this.state.rankCategories.length > 0) {
                await ServerApi.updateUserRankCategories(this.props.screenProps.app.state.userEmail, this.state.rankCategories)
                await this.props.navigation.getParam('root').userTypeRander()
                this.props.navigation.pop()

            } else {
                this.setState({
                    error: 'יש לבחור קטגוריה אחת לפחות',
                    updateWaiting: false
                })
            }

        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                    updateWaiting: false
                })
            }
        }
    }

    handleSelectCategory = (categoryId) => {
        try {
            if (this.state.rankCategories.length > 3) {
                throw 'אפשר לדרג עד 4 קטגוריות'
            } else {
                let rankCategories = [...this.state.rankCategories]
                let disableCategories = [...this.state.disableCategories]
                RankCategories.addSelectedCategory(categoryId, rankCategories, disableCategories)
                if (this.mountFlag) {
                    this.setState({
                        disableCategories: [...disableCategories],
                        rankCategories: [...rankCategories]
                    })
                }
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString(),
                })
            }
        }
    }
    handleUnSelectCategory = (categoryId) => {
        if (this.mountFlag) {
            this.setState({
                error: false,
            })
        }
        let rankCategories = [...this.state.rankCategories]
        let disableCategories = [...this.state.disableCategories]
        RankCategories.removeSelectedCategory(categoryId, rankCategories, disableCategories)
        if (this.mountFlag) {
            this.setState({
                disableCategories: [...disableCategories],
                rankCategories: [...rankCategories]
            })
        }
    }

    render() {
        return (
            <View
                style={{ flex: 1 }}
            >
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :

                    <View style={styles.wrapper}>

                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        <View>
                            <Text style={styles.rankExplanation} >דרג את הקטגוריות לפי תחומי העניין שלך כדי שנדע מה הכי מעניין אותך</Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                            {this.state.updateWaiting ?
                                <ActivityIndicator size="small" color="gray" />
                                :
                                <TouchableOpacity
                                    onPress={this.updateCategories}
                                >
                                    <Text style={styles.updateText}>
                                        עדכן !
                            </Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View
                            style={styles.categoriesWrapper}
                        >
                            {this.state.rankCategories.map(item => <RankCategory
                                root={this} handleUnSelectCategory={this.handleUnSelectCategory}
                                line={false}
                                renderItem={{ item: item }}
                                key={item.id}
                            />
                            )}

                        </View>
                        <View style={styles.lineBetween} />
                        <ScrollView
                            contentContainerStyle={styles.categoriesWrapper}
                        >


                            {this.state.disableCategories.map(item => <RankCategory
                                root={this}
                                handleSelectCategory={this.handleSelectCategory}
                                line={true}
                                renderItem={{ item: item }}
                                key={item.id}
                            />
                            )}
                        </ScrollView>
                    </View>
                }
            </View>
        )
    }
}



RankCategoriesScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'דירוג קטגוריות',
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
        paddingHorizontal: 20,
        paddingTop: 30,

    },
    input: {
        borderColor: '#c3c3b1',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '10%',
        marginBottom: 10
    },
    category: {
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center'

    },
    updateText: {
        textAlign: 'center',
        color: 'blue',

    },
    rankExplanation: {
        textAlign: 'center',
    },
    lineBetween: {
        width: '100%',
        height: 2,
        backgroundColor: 'black',
    },
    categoriesWrapper: {
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
})


export default RankCategoriesScreen






















