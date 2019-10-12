import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Colors } from '../../themes/index';
import Icon from 'react-native-vector-icons/FontAwesome';

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

export default class LogInForm extends React.Component {

    _logIn = () => {
        Alert.alert('login now');
        // dismissKeyboard();
    }

    addText = function() {
        Alert.alert('Press');
        console.log('Hello Pressed');
    }

    _facebookLogin = function(){
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function(result) {
                if (result.isCancelled) {
                    // Alert.alert('Login cancelled');
                    console.log('Log in canceled');
                } else {
                    // Alert.alert('Login success with permissions: ' + result.grantedPermissions.toString());
                    AccessToken.getCurrentAccessToken().then((data) => {
                        // alert(data.accessToken.toString())
                        console.log('this data ', data);
                    })
                }
            },function(error) {
                Alert.alert('Login fail with error: ' + error);
            }
        );
    }

    render() {
        return (    

            <View style={styles.container} onPress={() =>  dismissKeyboard()}>
                <StatusBar barStyle="light-content" />

                <TextInput 
                    placeholder="Email address *"
                    placeholderTextColor="#B9B9B9"
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    style={styles.input}
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                />

                <TextInput 
                    placeholder="Password *"
                    placeholderTextColor="#B9B9B9"
                    returnKeyType="go"
                    secureTextEntry
                    style={styles.input}
                    ref={(input) => this.passwordInput =  input}
                    onSubmitEditing={()=>this._logIn()}
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                />

                <TouchableOpacity style={styles.btnContainer} onPress={() => this.props.loginFrm.authenticate()}>
                    <Text style={styles.btn}>{ this.props.loginFrm.state.btnLoginText }</Text>
                </TouchableOpacity>

                <View style={styles.help}>
                    <Text style={styles.forget}>Forget your login details?</Text>
                    <TouchableOpacity onPress={this.addText}>
                        <Text style={styles.gethelp}> Get help.</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.orBar}>
                    <View style={styles.line}></View>
                    <Text style={styles.txtOR}>OR</Text>
                    <View style={styles.line}></View>
                </View>

                <TouchableOpacity style={styles.fbContainer} onPress={this._facebookLogin}>
                    <Icon
                        name='facebook-square'
                        style={[ styles.icon, ]}
                    />
                    <Text style={styles.fbLogin}> Log in with Facebook</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* Default FB Login 

                <View>
                    <LoginButton
                        publishPermissions={["publish_actions"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("login has error: " + result.error);
                                } else if (result.isCancelled) {
                                    alert("login is cancelled.");
                                } else {
                                    AccessToken.getCurrentAccessToken().then((data) => {
                                        // alert(data.accessToken.toString())
                                        console.log('this data ', data);

                                    })
                                }
                                console.log('result', result);
                            }
                        }
                        onLogoutFinished={() => alert("logout.")}/>
                </View>

*/

var styles = StyleSheet.create({

    container: {
        // flex: 1,
        padding: 20
    },

    input: {
        height: 45,
        // backgroundColor: "rgba(255,255,255,.2)",
        backgroundColor: Colors.componentBackgroundColor,
        marginBottom: 10,
        color: Colors.textColor,
        paddingHorizontal: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
    },

    btnContainer: {
        backgroundColor: Colors.buttonColor,
        paddingVertical: 15,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.buttonColor
    },

    btn: {
        textAlign: 'center',
        color: "white",
        fontWeight: "700",
    },

    help: {
        justifyContent:'center',
        flexDirection: 'row',
        marginTop: 10,
    },

    forget:{
        color: Colors.textColorDark,  
    },

    gethelp:{
        fontWeight: 'bold',
        color: Colors.textColorDark,
    },

    orBar:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60
    },

    line:{
        height: 1,
        width: 150,
        alignSelf:'center',
        backgroundColor: Colors.lineColor,
        marginLeft: 5,
        marginRight: 5
    },

    txtOR:{
        textAlign: 'center',
        textAlignVertical: 'top',
        fontWeight: 'bold',
        color:Colors.textColor,
    },

    icon:{
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.textColorDark,
    },

    fbContainer:{
        // flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },

    fbLogin:{
        fontWeight: 'bold',
        color: Colors.textColor,
        marginLeft: 10,
    },
});