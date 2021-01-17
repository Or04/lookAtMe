//setstate clear
import React from 'react'
import { Text, View, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Platform, Dimensions, Image } from 'react-native'
import ServerApi from '../../modules/ServerApi'
import Error from '../../components/Error'
import Picture from './Picrue'
import UpdatePicture from './UpdatePicture'


export default class Category extends React.Component {
    constructor() {
        super()
        this.state = {
            update: false,
            waiting: false,
            deleteWaiting: false,
            delete: false,
            error: false,
            text: '',
            updateCategoryName: false,
            deleteSafety: false,
            pictureUrl: false
        }
        this.mountFlag = true
    }
    componentDidMount() {
        this.setState({
            text: this.props.renderItem.item.description
        })
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    updateTextHandler = (inputText) => {
        this.setState({
            text: inputText
        })
    }

    deleteCategory = async () => {
        try {
            if (!this.state.deleteWaiting) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        deleteWaiting: true
                    }));
                })

                let deleteCategoryResponsed = await ServerApi.deleteCategory(this.props.renderItem.item.id)
                this.props.updateCategories()

            }
        } catch (error) {
            if (this.mountFlag) {


                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        deleteWaiting: false,
                        error: error.toString()
                    }));
                })

            }
        }
    }

    updatePictureHandler = (pictureUrl) => {
        this.setState({
            pictureUrl: pictureUrl
        })
    }



    updateCategoryHandler = async () => {
        try {
            if (this.mountFlag) {
                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        deleteSafety: false
                    }));
                })
            }

            if (this.state.text.length == 0)
                throw 'הכנס טקסט'
            if (!this.state.waiting) {
                if (this.mountFlag) {

                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            waiting: true
                        }));
                    })

                }
                let updateCategoryResponsed = await ServerApi.updateCategory(this.state.text, this.props.renderItem.item.id)
                if (this.state.pictureUrl) {
                    let res = await ServerApi.addCategoryPicture(this.state.pictureUrl, this.props.renderItem.item.id)
                }
                this.updateCategory.clear()
                this.props.updateCategories()
                if (this.mountFlag) {

                    await new Promise((resolved, reject) => {
                        resolved(this.setState({
                            waiting: false,
                            error: false,
                            updateCategoryName: this.state.text,
                            pictureUrl: false
                        }));
                    })

                }

            }
        } catch (error) {
            if (this.mountFlag) {

                await new Promise((resolved, reject) => {
                    resolved(this.setState({
                        waiting: false,
                        error: error.toString()
                    }));
                })

            }
            this.updateCategory.clear();
        }
    }

    render() {
        if (this.state.deleteSafety) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.wrapper}>
                        {this.state.deleteWaiting ?
                            <View style={{ justifyContent: 'center' }}><ActivityIndicator size="large" color="#c3c3b1" /></View>

                            :

                            <View style={{ flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse', justifyContent: 'space-around' }}>


                                <TouchableOpacity
                                    onPress={this.deleteCategory}
                                >
                                    <Text style={{ color: 'red' }}>מחיקה</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ deleteSafety: false })}
                                >
                                    <Text style={{ color: 'green', }}>ביטול</Text>
                                </TouchableOpacity>

                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
            )
        } else {
            return (
                <View style={this.state.update ? { ...styles.wrapper, width: '100%' } : styles.wrapper}>
                    <View style={styles.topSection} >
                        {this.state.deleteWaiting ? <ActivityIndicator size="large" color="#c3c3b1" /> :

                            <TouchableOpacity
                                onPress={() => this.setState({ deleteSafety: true })}
                                style={styles.iconbox}
                            >
                                <Image
                                    style={styles.icons}
                                    source={{
                                        uri: `http://lookatmeil.com/images/trash.png`,
                                    }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        }
                        {this.state.update ?
                            <TouchableOpacity
                                onPress={() => this.setState({ update: false })}
                                style={styles.iconbox}
                            >
                                <Image
                                    style={styles.icons}
                                    source={{
                                        uri: `http://lookatmeil.com/images/close.png`,
                                    }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.setState({ update: true })}
                                style={styles.iconbox}
                            >
                                <Image
                                    style={styles.icons}
                                    source={{
                                        uri: `http://lookatmeil.com/images/edit.png`,
                                    }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    <View

                        style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}


                    >
                        <Text style={{ textAlign: 'center' }}>{this.state.updateCategoryName ? this.state.updateCategoryName : this.props.renderItem.item.description}</Text>

                    </View>
                    {(typeof this.props.renderItem.item.picture != 'undefined' && !this.state.update) ?
                        <Picture
                            key={this.props.renderItem.item.picture[0]}
                            uri={this.props.renderItem.item.picture[0]}
                            showDelete={false}
                        />
                        :
                        null
                    }
                    {(typeof this.props.renderItem.item.picture == 'undefined' && !this.state.update) ?
                        <View style={styles.emptyImage}></View>

                        :
                        null
                    }

                    {this.state.update ?
                        <View style={styles.updateBox} >
                            <View style={styles.updateInfoBox}>
                                <View style={styles.updateTextBox} >
                                    <TextInput
                                        ref={(updateCategory) => { this.updateCategory = updateCategory }}
                                        style={styles.input}
                                        defaultValue={this.props.renderItem.item.description}
                                        onChangeText={this.updateTextHandler}
                                    />

                                </View>
                                <UpdatePicture

                                    pictureUrl={(typeof this.props.renderItem.item.picture != 'undefined') ? this.props.renderItem.item.picture[0] : false}
                                    updatePictureHandler={this.updatePictureHandler}
                                />
                            </View>
                            <View>

                                {this.state.waiting ? <View style={{ flex: 1 }}><ActivityIndicator size="large" color="#c3c3b1" /></View> :
                                    <TouchableOpacity style={styles.updateCategoryName} onPress={this.updateCategoryHandler}>
                                        <Text>עדכן</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        :
                        null
                    }
                    {this.state.error ? <Error errorText={this.state.error} /> : null}
                </View>
            )
        }

    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        borderRadius: 5,
        width: '30%',
        borderColor: '#c3c3b1',
        marginVertical: 5,
        justifyContent: 'center'


    },
    category: {
        justifyContent: 'space-between',
        backgroundColor: 'black',

    },
    input: {
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10,
    },
    deleteButton: {
        direction: Platform.OS == 'ios' ? 'ltr' : null
    },
    icons: {
        width: 20,
        height: 20
    },
    topSection: {
        flexDirection: Platform.OS == 'ios' ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingTop: 5,
        height: 25

    },
    iconbox: {

    },
    updateInfoBox: {
        flexDirection: 'row-reverse',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    updateBox: {
    },
    updateCategoryName: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    updateTextBox: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'flex-end'
    },
    emptyImage: {
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        borderRadius: (Dimensions.get('window').width * 0.7) / 2,
        backgroundColor: 'white',
        alignSelf: 'center'
    }
})
