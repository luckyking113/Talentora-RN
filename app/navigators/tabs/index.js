import React from 'react'
import {
    createBottomTabNavigator,
} from 'react-navigation';

// Screens
// Only one for now, add more as required
import Home from './home'
import Search from './search'
import Record from './media'  
import Message from './message'  
import Profile from './profile'  

// Tabs
import Tab from '../../components/tabs/tab'

// TabNavigator options
const options = {
    lazyLoad: true,
    tabBarOptions: {
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

export default createBottomTabNavigator({

    List:       { 
            screen: Home, 
            navigationOptions: { 
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="home" />) 
        }
    },
    Search:      { 
        screen: Search, 
        navigationOptions: { 
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="search" />) 
        }
    },
    Record:      { 
        screen: Record, 
        navigationOptions: { 
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="photo-camera" />) 
        }
    },    
    Message:      { 
        screen: Message, 
        navigationOptions: { 
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="chat" />) 
        }
    },

    User:      { 
        screen: Profile, 
        navigationOptions: { 
            tabBarLabel: '', 
            tabBarIcon: (props) => (<Tab {...props} icon="person" />) 
        }
    }   

}, options);
