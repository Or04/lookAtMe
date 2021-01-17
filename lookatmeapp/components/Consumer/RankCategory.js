//SETSTATE
import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native'
import Picture from '../Administrator/Picrue'
import Error from '../../components/Error'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'






export default class RankCategory extends React.Component {
    constructor() {
        super()
        this.state = {
            waiting: false,
            delete: false,
            error: false,
            cancelCategory: false
        }
        this.mountFlag = true
    }
    componentWillUnmount() {
        this.mountFlag = false
    }

    async componentDidMount() {
        if (this.mountFlag && this.props.renderItem.item.rank == 1000) {
            await new Promise(resolved => {
                resolved(this.setState({
                    cancelCategory: true
                }));
            })
        }
    }


    ignoreCategory = () => {
        let tempArray = [...this.props.root.state.rankCategories]
        tempArray[this.props.renderItem.item.rank - 1].cancelCategory = true
        tempArray[this.props.renderItem.item.rank - 1].rank = 1000
        tempArray.sort((a, b) => a.rank - b.rank)
        if (this.mountFlag) {
            this.setState({
                cancelCategory: true
            })
        }
        if (this.mountFlag) {
            this.props.root.setState({
                rankCategories: [...tempArray]
            })
        }

    }


    goUpHandler = async () => {
        if (this.props.renderItem.item.rank != 1) {
            let tempArray = [...this.props.root.state.rankCategories]
            tempArray[this.props.renderItem.item.rank - 2].rank = this.props.renderItem.item.rank
            tempArray[this.props.renderItem.item.rank - 1].rank = this.props.renderItem.item.rank - 1
            tempArray.sort((a, b) => a.rank - b.rank)
            if (this.mountFlag) {
                this.props.root.setState({
                    rankCategories: [...tempArray]
                })

            }

        }
    }

    goDownHandler = () => {
        let cancelCategoryCount = 0
        for (let i = 0; i < this.props.root.state.rankCategories.length; i++) {
            if (this.props.root.state.rankCategories[i].rank == 1000) {
                cancelCategoryCount++
            }
        }
        if (this.props.renderItem.item.rank != (this.props.root.state.rankCategories.length - cancelCategoryCount)) {
            let tempArray = [...this.props.root.state.rankCategories]
            tempArray[this.props.renderItem.item.rank].rank = this.props.renderItem.item.rank
            tempArray[this.props.renderItem.item.rank - 1].rank = this.props.renderItem.item.rank + 1
            tempArray.sort((a, b) => a.rank - b.rank)
            if (this.mountFlag) {
                this.props.root.setState({
                    rankCategories: [...tempArray]
                })
            }
        }
    }

    render() {
        return (
            <View style={{ ...styles.wrapper, width: '30%' }}>
                <View style={styles.category}>
                    <View style={styles.topSection}>
                        <View style={{ marginHorizontal: 3 }}>
                            {this.props.line ?
                                <TouchableOpacity
                                    onPress={this.props.handleSelectCategory.bind(null, this.props.renderItem.item.id)}
                                >
                                    <FontAwesome5 name={'plus'} size={20} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={this.props.handleUnSelectCategory.bind(null, this.props.renderItem.item.id)}
                                >
                                    <FontAwesome5 name={'times-circle'} size={20} />
                                </TouchableOpacity>


                            }
                        </View>
                        <View >
                            <Text>{typeof this.props.renderItem.item.rank != 'undefined' ? this.props.renderItem.item.rank : null}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={!this.props.line ?
                            this.goUpHandler
                            :
                            null
                        }

                        style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row' }}

                    >
                        <Text style={{ textAlign: 'center' }}>{this.props.renderItem.item.description}</Text>

                        {(typeof this.props.renderItem.item.picture != 'undefined') ?
                            <Picture
                                key={this.props.renderItem.item.picture[0]}
                                uri={this.props.renderItem.item.picture[0]}
                                showDelete={false}
                            />
                            :
                            null
                        }
                    </TouchableOpacity>

                </View>
                {this.state.error ? <Error errorText={this.state.error} /> : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 5

    },
    category: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%'
    },
    topSection: {
        flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row',
        justifyContent: 'space-between',

    },
    input: {
        borderColor: '#767676',
        borderBottomWidth: 2,
        marginTop: 10,
        width: '100%',
        marginBottom: 10
    }
})