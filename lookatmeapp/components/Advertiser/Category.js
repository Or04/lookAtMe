//state
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Picture from '../Administrator/Picrue'







export default class Category extends React.Component {
    constructor() {
        super()
        this.mountFlag = true
    }

    componentWillUnmount() {
        this.mountFlag = false
    }


    selectCategoryHandler = async () => {
        if(typeof this.props.selectCategory !='undefined' && this.props.selectCategory){
            this.props.selectCategory(this.props.renderItem.item.id)
        }

    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.selectCategoryHandler}
                style={this.props.style ? { ...styles.wrapper, ...this.props.style } : { ...styles.wrapper }}
            >

                <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center',marginBottom:10 }}>
                    <Text style={{textAlign:'center'}}>{this.props.renderItem.item.description}</Text>
                </View>


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
        )
    }
}


const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 5,
        marginVertical: 10,
        justifyContent:'center'
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    }
})