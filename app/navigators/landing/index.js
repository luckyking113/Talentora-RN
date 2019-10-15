import React from 'react'
import {
    createStackNavigator,
    StackNavigator
} from 'react-navigation';

// Screens
// Only one for now, add more as required
import SIGNUP_LOGIN_PROCESS from './sign-up-login-process'

// TabNavigator options
const options = {
    lazyLoad: true,
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
    headerMode:'none'
    // mode: 'modal'
}

const TabBarComponent = (props) => {
    console.log('TabBarComponent Props: ', Object.keys(props));
}

const navOptions = {
    // tabBarVisible: false,
    // tabBar: { 
    //     visible: false,
    //     label: '', 
    //     icon: (props) => (<Tab {...props} icon="home" />) 
    // }    
    header:null
}

export default createStackNavigator({

    LandingLogIn:       { screen: SIGNUP_LOGIN_PROCESS, navigationOptions: {navOptions } },

}, options);
