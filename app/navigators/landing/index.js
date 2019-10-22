import React from 'react'
import {
    createStackNavigator,    
} from 'react-navigation';

import SIGNUP_LOGIN_PROCESS from './sign-up-login-process'

// TabNavigator options
const options = {
    lazyLoad: true,
    headerVisible: false,
    header: null, 
    tabBarOptions: {
        visible: false,
        inactiveTintColor: '#aaa',
        activeTintColor: '#fff',
        showIcon: true,
        showLabel: false,
        style: {
            backgroundColor: '#272822',
        }
    },
    animationEnabled: false,
    // mode: 'modal'
}

const TabBarComponent = (props) => {
    console.log('TabBarComponent Props: ', Object.keys(props));
}

const navOptions = {
    headerVisible: false,
    header: null,
    tabBar: { 
        headerVisible: false,
        header: null,
        tabBarLabel: '',
        tabBarIcon: (props) => (<Tab {...props} icon="home" />) 
    },
    navigationOptions: {
        headerVisible: false,
        header: null,
    }
}

export default createStackNavigator({
    LandingLogIn:       { screen: SIGNUP_LOGIN_PROCESS, navigationOptions: {navOptions } },
}, options);
