//setstate
import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Button,
    TextInput,
    ActivityIndicator,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import Colors from '../../constants/Colors'
import Input from '../../components/Input'
import Error from '../../components/Error'
import ServerApi from '../../modules/ServerApi'
import RankCategory from '../../components/Consumer/RankCategory'
import Category from '../../components/Advertiser/Category'







class SelectCategoryScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            error: false,
            categories: [],
            selectedCategory: false
        }
        this.mountFlag = true

    }

    componentWillUnmount() {
        this.mountFlag = false
    }

    randerCategories = async () => {
        try {
            if (this.mountFlag && !this.state.waiting) {
                await new Promise(resolved => {
                    resolved(this.setState({
                        waiting: true
                    }));
                })
            }
            let getAllCategoriesResponsed = await ServerApi.getAllCategories()
            if (this.mountFlag) {
                this.setState({
                    categories: [...getAllCategoriesResponsed],
                    waiting: false
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
        this.randerCategories()
    }

    selectCategory =async (categoryId) => {
        await new Promise(resolved=>{
            this.setState({
                selectedCategory: categoryId
            },()=>resolved())
        
        })
        this.nextClickHandler()
    }

    nextClickHandler = async () => {

        try {
            if (this.state.selectedCategory) {
                if (this.mountFlag && this.state.error) {
                    await new Promise(resolved => {
                        resolved(this.setState({
                            error: false
                        }));
                    })
                }
                this.props.navigation.navigate({
                    routeName: 'AdvertisementInfo',
                    params: {
                        selectedCategory: this.state.selectedCategory,
                        selectedCategoryDescription: this.state.categories.find(category => category.id == this.state.selectedCategory).description,
                        root: this.props.navigation.getParam('root')
                    }
                })
            } else {
                if (this.mountFlag) {
                    this.setState({
                        error: 'קטגוריה לא נבחרה'
                    })
                }
            }

        } catch (error) {
            if (this.mountFlag) {
                this.setState({
                    error: error.toString()
                })
            }
        }
    }


    render() {
        return (
            <View style={styles.wrapper}>
                <View >
                    {this.state.waiting ?
                        <ActivityIndicator size="large" color="#c3c3b1" />
                        :
                        null
                    }
                </View>
                {this.state.error ? <View style={{ marginVertical: 10 }}><Error errorText={this.state.error} /></View> : null}

                <ScrollView
                    contentContainerStyle={styles.categoriesWrapper}
                >


                    {this.state.categories.map(item => <Category
                        root={this}

                        renderItem={{ item: item }}
                        style={this.state.selectedCategory == item.id ? { borderColor: Colors.selected } : null}
                        key={item.id}
                        style={{ width: '30%' }}
                        selectCategory={this.selectCategory}

                    />
                    )}
                </ScrollView>


            </View>
        )
    }
}



SelectCategoryScreen.navigationOptions = (data) => {
    return {
        headerTitle: 'בחר קטגוריה',
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
        borderColor: '#767676',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10
    },
    category: {
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center'

    },
    categoriesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    }
})


export default SelectCategoryScreen






















