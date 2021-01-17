//setstate clear



import React from 'react'
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native'
import Validator from '../node_modules/validator'
import InputTypes from '../constants/InputTypes'






export default class Input extends React.Component {
    constructor() {
        super()
        this.state = ({
            text: '',
            inputStyleBorder: false,
            textValidation: false
        })

    }

    async componentDidMount() {
        if (typeof this.props.defaultValue != 'undefined') {
            await new Promise(resolved => {
                this.setState({
                    text: this.props.defaultValue
                }, () => resolved())
            })
        }
        if (typeof this.props.focus != 'undefined' && this.props.focus) {
            this.inputComponent.focus()
        }
    }

    async componentDidUpdate() {
    }

    getText =  () => {
        if (!this.state.textValidation) {
            this.setState({
                inputStyleBorder: 'red'
            })

        }
        return this.state.textValidation ? this.state.text : false
    }

    updateTextHandler = (inputText) => {
        switch (this.props.type) {
            case InputTypes.EMAIL:
                let filterEmail = inputText.replace(' ', '') ? inputText.replace(' ', '') : inputText
                filterEmail = filterEmail.toLocaleLowerCase()
                Validator.isEmail(filterEmail) ? this.setState({ text: filterEmail, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: filterEmail, inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.PASSWORD:
                this.state.text.length > 6 ? this.setState({ text: inputText, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: inputText, inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.TEXT:
                this.state.text.length > 0 ? this.setState({ text: inputText, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: inputText, inputStyleBorder: 'red', textValidation: true })
                break;
            case InputTypes.PASSWORDVALIDATOR:
                this.PASSWORD.getText() == this.state.text ? this.setState({ text: inputText, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: inputText, inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.PRICE:
                this.state.text.length > 0 ? this.setState({ text: inputText, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: inputText, inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.PHONENUMBER:
                let phonenumber = inputText.replace(' ', '') ? inputText.replace(' ', '') : inputText
                Validator.isMobilePhone(phonenumber, 'he-IL') ? this.setState({ text: phonenumber, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: phonenumber, inputStyleBorder: 'red', textValidation: false })
                break;
            default:
        }
    }


    endEditingHandler = () => {
        switch (this.props.type) {
            case InputTypes.EMAIL:
                let filterEmail = this.state.text.replace(' ', '') ? this.state.text.replace(' ', '') : this.state.text
                filterEmail = filterEmail.toLocaleLowerCase()
                Validator.isEmail(filterEmail) ? this.setState({ text: filterEmail, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: filterEmail, inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.PASSWORD:
                this.state.text.length > 7 ? this.setState({ inputStyleBorder: 'green', textValidation: true }) : this.setState({ inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.TEXT:
                this.state.text.length > 0 ? this.setState({ inputStyleBorder: 'green', textValidation: true }) : this.setState({ inputStyleBorder: 'red', textValidation: true })
                break;
            case InputTypes.PRICE:
                this.state.text.length > 0 ? this.setState({ inputStyleBorder: 'green', textValidation: true }) : this.setState({ inputStyleBorder: 'red', textValidation: false })
                break;
            case InputTypes.PHONENUMBER:
                let phonenumber = this.state.text.replace(' ', '') ? this.state.text.replace(' ', '') : this.state.text
                Validator.isMobilePhone(phonenumber, 'he-IL') ? this.setState({ text: phonenumber, inputStyleBorder: 'green', textValidation: true }) : this.setState({ text: phonenumber, inputStyleBorder: 'red', textValidation: false })
                break;
            default:
        }
    }


    inputStyle = () => {
        if (typeof this.props.underLine != 'undefined' && this.props.underLine && this.state.inputStyleBorder) {

            return this.state.inputStyleBorder ? { ...styles.input, ...this.props.style, borderColor: this.state.inputStyleBorder, borderBottomWidth: 1 } : { ...styles.input, ...this.props.style }
        } else {

            return { ...styles.input, ...this.props.style }
        }
    }

    render() {


        return (
            <View>

                {(typeof this.props.defaultValue != 'undefined' && this.props.defaultValue) ?
                    <TextInput

                        ref={(inputComponent) => { this.inputComponent = inputComponent }}
                        style={this.inputStyle()}
                        placeholder={this.props.placeholder ? this.props.placeholder : 'הכנס טקסט'}
                        onChangeText={this.updateTextHandler}
                        keyboardType={((this.props.type == InputTypes.PRICE) || (this.props.type == InputTypes.PHONENUMBER)) ? 'number-pad' : 'default'}
                        secureTextEntry={this.props.type == InputTypes.PASSWORD ? true : false}
                        onEndEditing={this.endEditingHandler}
                        multiline={typeof this.props.multiline != 'undefined' ? true : false}
                        onFocus={typeof this.props.textInputFocus != 'undefined' ? this.props.textInputFocus : null}
                        onBlur={typeof this.props.textInputFocus != 'undefined' ? this.props.textInputFocus : null}
                        defaultValue={typeof this.props.defaultValue != 'undefined' ?
                            this.props.defaultValue
                            :
                            this.props.placeholder ? this.props.placeholder : 'הכנס טקסט'
                        }

                    />

                    :
                    <TextInput

                        ref={(inputComponent) => { this.inputComponent = inputComponent }}
                        style={this.inputStyle()}
                        placeholder={this.props.placeholder ? this.props.placeholder : 'הכנס טקסט'}
                        onChangeText={this.updateTextHandler}
                        keyboardType={((this.props.type == InputTypes.PRICE) || (this.props.type == InputTypes.PHONENUMBER)) ? 'number-pad' : 'default'}
                        secureTextEntry={this.props.type == InputTypes.PASSWORD ? true : false}
                        onEndEditing={this.endEditingHandler}
                        multiline={typeof this.props.multiline != 'undefined' ? true : false}
                        onFocus={typeof this.props.textInputFocus != 'undefined' ? this.props.textInputFocus : null}
                        onBlur={typeof this.props.textInputFocus != 'undefined' ? this.props.textInputFocus : null}


                    />


                }
            </View>



        )
    }

}

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 0,
        marginTop: 10,
        width: '100%',
        marginBottom: 10,
        textAlign: Platform.OS == 'ios' ? 'right' : 'right',


    }
})