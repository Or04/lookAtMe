//setstate
import React from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native'
import Colors from '../../constants/Colors'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import Category from '../../components/Administrator/Category'
import AddPictures from '../../components/Administrator/AddPicture'
import { TouchableOpacity } from 'react-native-gesture-handler'







class CategoriesScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            text: '',
            CategoriesArray: [],
            pictureUrl: false
        }
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    updateCategories = async () => {
        try {
            let getAllCategoriesResponsed = await ServerApi.getAllCategories()
            if (this.mountFlag) {
                this.setState({
                    CategoriesArray: [...getAllCategoriesResponsed]
                })
            }
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString()
                })
            }
        }
    }


    async componentDidMount() {
        try {
            await new Promise(resolved => {
                this.setState({
                    waiting: true
                }, () => resolved())
            })

            let getAllCategoriesResponsed = await ServerApi.getAllCategories()
            if (this.mountFlag) {
                this.setState({
                    CategoriesArray: [...getAllCategoriesResponsed],
                    waiting: false
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

    updateTextHandler = (inputText) => {
        this.setState({
            text: inputText
        })
    }

    getAllCategoris = async () => {

    }

    addPictureHandler = async (url) => {
        this.setState({
            pictureUrl: url
        })
    }

    addCategoryHandler = async () => {
        try {
            if (this.state.text.length == 0)
                throw 'הכנס שם קטגוריה'
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    this.setState({
                        waiting: true
                    }, () => resolved());
                })
            }
            let addCategoryResponsed = await ServerApi.addcategory(this.state.text)
            if (this.state.pictureUrl && typeof addCategoryResponsed[0].id != 'undefined') {
                let res = await ServerApi.addCategoryPicture(this.state.pictureUrl, addCategoryResponsed[0].id)
            }
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    this.setState({
                        waiting: false,
                        error: false,
                        pictureUrl: false
                    }, () => resolved())
                })
            }
            await new Promise((resolved,) => {
                resolved(this.addCategory.clear())
            })
            this.updateCategories()
        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    waiting: false,
                    error: error.toString()
                })
            }
        }
    }


    render() {
        return (
            <View
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                {this.state.waiting ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#c3c3b1" />
                    </View>
                    :

                    <View style={styles.wrapper}>
                        <View style={styles.addCategory}>
                            <View style={styles.addCategoryBox}>
                                <View style={styles.addCategoryText}>
                                    <TextInput
                                        ref={(addCategory) => { this.addCategory = addCategory }}
                                        style={styles.input}
                                        placeholder={'הכנס שם קטגוריה'}
                                        onChangeText={this.updateTextHandler}
                                    />
                                </View>
                                <View style={styles.addCategoryPicture}>
                                    <AddPictures
                                        pictureUrl={this.state.pictureUrl}
                                        addPictureHandler={this.addPictureHandler}
                                    />
                                </View>
                            </View>
                            {this.state.waiting ? <View style={{ flex: 1 }}><ActivityIndicator size="large" color="#c3c3b1" /></View> :
                                <TouchableOpacity
                                 style={styles.plus} 
                                 onPress={this.addCategoryHandler}
                                 >
                                    <Text style={{textDecorationLine:'underline'}}>הוסף</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {this.state.error ? <Error errorText={this.state.error} /> : null}
                        {this.state.CategoriesArray.length > 0 ?
          
                            <ScrollView
                                contentContainerStyle={styles.categoriesWrapper}
                            >
                                {
                                    this.state.CategoriesArray.map(item => <Category updateCategories={this.updateCategories} renderItem={{ item: item }} key={item.id} />)
                                }
                            </ScrollView>
                            : null
                        }
                    </View>
                }
            </View>
        )
    }
}



CategoriesScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'קטגוריות',
        headerStyle: {
            backgroundColor: Colors.header,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShown: false

    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,


    },
    input: {
        borderColor: '#767676',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10,
        textAlign: Platform.OS == 'ios' ? 'right' : 'right',
    },
    plus: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    category: {
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff'
    },
    categoriesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'

    },
    addCategory: {

    },
    addCategoryBox: {
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',

    },
    addCategoryText: {
        flex: 2,
        paddingLeft: 20,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    addCategoryPicture: {
        flex: 1
    }

})


export default CategoriesScreen






















