import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Colors } from '@themes/index';

import Chat from '@components/message/chat/chat'



export default class LogInForm extends React.Component {

    static navigationOptions = {
        title: 'Chat',
    }

    render() {
        return (    

            <View style={styles.container}>
                
                {/* <Chat/> */}

            </View>
            
        );
    }

}

var styles = StyleSheet.create({


});