import React from 'react'
import {
    createBottomTabNavigator,
    createStackNavigator,
    createAppContainer
} from 'react-navigation';

// Screens
// Only one for now, add more as required
import SIGNUP_LOGIN_PROCESS from './sign-up-login-process'

// Tabs
import Tab from '../../components/tabs/tab'


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
    // tabBarComponent: TabBarComponent
}

const TabBarComponent = (props) => {
    console.log('TabBarComponent Props: ', Object.keys(props));
}


const AppStackNavigator = createBottomTabNavigator({

    // LandingLogIn:       { screen: SIGNUP_LOGIN_PROCESS, navigationOptions: { tabBar: { visible: false,label: '', icon: (props) => (<Tab {...props} icon="home" />) }}},
    LandingLogIn:      { 
        screen: SIGNUP_LOGIN_PROCESS, 
        navigationOptions: { 
            tabBarVisible:false,
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="home" />) 
        }
    },
    // HomeTest:       { screen:Home, navigationOptions: { tabBar: { visible: true,label: '', icon: (props) => (<Tab {...props} icon="home" />) }}},

}, options);

export default createAppContainer(AppStackNavigator);
