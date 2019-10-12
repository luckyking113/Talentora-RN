import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert
} from 'react-native'

import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'


import { Colors } from '../../themes/index';
import LogInForm from '../login/login-form'; 


const dismissKeyboard = require('dismissKeyboard')

function mapStateToProps(state) {
    // console.log(state)
    return {
        user: state.user,
        // navigation: state.navigation
    }
}

class Authenticate extends Component {
  static navigationOptions = {

    headerVisible:false,
    tabBarOptions: () => ({
        headerVisible: false,
    }),
  };

    static tabBarOptions = {
        visible: false,
        inactiveTintColor: '#aaa',
        activeTintColor: '#fff',
        showIcon: true,
        showLabel: false,
        style: {
            backgroundColor: '#272822',
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            btnLoginText: 'Log in'
        }
        
        this.signupPress = this.signupPress.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    authenticate() {
        this.setState({ btnLoginText: 'Loading ...' })
        this.props.authenticate()
    }

    signUpPress1(){
        // console.log(this.props);
        const { navigate, goBack } = this.props;
        navigate('SignUp');
    }

    signupPress = function() {        
        const { navigate, goBack } = this.props;            
        navigate('SignUp');
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style= {styles.container}>

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../../images/talentora.jpg')} />
                    </View>
                </TouchableWithoutFeedback> 

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.formContainer}>
                        <LogInForm loginFrm = {this} />
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.signup}>
                    <View style={styles.txtContainer}>

                        <Text style={styles.noAccount}>Don't have an account? </Text>
                        <TouchableOpacity onPress={this.signupPress}>
                            <Text style={styles.txtsignup}> Sign up.</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor
  },

  formContainer: {
    // paddingBottom: 10
    // flex:1,
    // backgroundColor:'red',
  },

  itemsContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    // flexGrow: 1,
    justifyContent: 'center',
  },

  logo: {
    resizeMode: "contain",
    width: 180,
    backgroundColor:Colors.white
  },

  signup: {
    flexDirection: 'row',
    backgroundColor: Colors.componentBackgroundColor,
    paddingTop: 15,
    paddingBottom: 15,
    position: 'absolute',
    bottom:0,
  },

  txtContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center'
  },

  noAccount:{
    color: Colors.textColorDark  
  },

  txtsignup: {
    fontWeight: 'bold',
    color:Colors.textColorDark,
  },

})

export default connect(mapStateToProps, AuthActions)(Authenticate)


// export default Authenticate
