import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback
} from 'react-native'

import { Colors } from '../../themes/index';

import LogInForm from '../login/login-form'; 

const dismissKeyboard = require('dismissKeyboard')

class Authenticate extends Component {

    constructor(props) {
        super(props)

        this.state = {
            btnLoginText: 'Log In'
        }
    }

    authenticate() {
        this.setState({ btnLoginText: 'Loading ...' })
        this.props.authenticate()
    }

    render() {
        return (

            /*<View style={styles.container}>
                <Button
                    style={styles.button}
                    title={ this.state.value }
                    onPress={() => this.authenticate()}
                />
            </View>*/

            <KeyboardAvoidingView behavior="padding" style={styles.container}>

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../images/alertify.png')} />
                    </View>
                </TouchableWithoutFeedback> 

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.formContainer}>
                        <LogInForm loginFrm={this} />
                    </View>
                </TouchableWithoutFeedback>
            
            </KeyboardAvoidingView>  

        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryCol,
  },

  formContainer: {
    //  paddingBottom: 10
  },

  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },

  logo: {
    resizeMode: "contain",
    width: 250,
  },

})

export default Authenticate
