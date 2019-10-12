import React, { Component } from 'react'
import {
    Button
} from 'react-native'

class Settings extends Component {
    constructor(props){
        super(props);
        this.goBackNavigator = this.goBackNavigator.bind(this);
    }

    static navigationOptions = { title: 'Settings' };

    goBackNavigator = function() {
        const { navigate, goBack } = this.props;            
        navigate.goBack();
    }
  
    render() { 
        return (
            <Button
                onPress={() => goBackNavigator()}
                title="Settings Screen"
            />
        );
    }
}

export default Settings
