import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Colors } from '../../themes/index';

// import LogInForm from '../Components/Form/LogInForm';


export default class LogInForm extends React.Component {

    _logIn = () => {
        Alert.alert('login now');
        // dismissKeyboard();
    }

  render() {
    return (    

            
            <View style={styles.container} onPress={() =>  dismissKeyboard()}>
                
                <StatusBar barStyle="light-content" />

                <TextInput 
                    placeholder="Email *"
                    placeholderTextColor="rgba(255,255,255,.7)"
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    style={styles.input}
                />

                <TextInput 
                    placeholder="Password *"
                    placeholderTextColor="rgba(255,255,255,.7)"
                    returnKeyType="go"
                    secureTextEntry
                    style={styles.input}
                    ref={(input) => this.passwordInput =  input}
                    onSubmitEditing={()=>this._logIn()}
                />

                <TouchableOpacity style={styles.btnContainer} onPress={() => this.props.loginFrm.authenticate()}>
                    <Text style={styles.btn}>{ this.props.loginFrm.state.btnLoginText }</Text>
                </TouchableOpacity>

            </View>
        
    );
  }

}

var styles = StyleSheet.create({

  container: {
    // flex: 1,
    padding: 20
  },

  input: {
      height: 45,
      backgroundColor: "rgba(255,255,255,.2)",
      marginBottom: 20,
      color: "#FFF",
      paddingHorizontal: 12
  },

  btnContainer: {
    backgroundColor: Colors.primaryColDark,
    paddingVertical: 15
  },

  btn: {
    textAlign: 'center',
    color: "white",
    fontWeight: "700",
  },

});