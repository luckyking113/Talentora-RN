import React from 'react'
import {
    // TabNavigator,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

import { Colors } from '@themes/index';
// tabel (user)
import AvailableJob from '@components/job/talent/available-job'
import AppliedJob from '@components/job/talent/applied-job'

// Tabs
import TabItem from '@components/tabs/tab-item'
import ViewPostJob from '@components/job/talent-seeker/view-post-job'     


// TabNavigator options
const options = {
    initialRouteName: 'Available',
    lazyLoad: true,
    tabBarPosition: 'top',
    tabBarOptions: {
        // inactiveTintColor: '#aaa',
        inactiveTintColor: Colors.tabBarInactiveTintColor,
        activeTintColor: Colors.primaryColor,
        showIcon: false,
        showLabel: true,
        style: {
            height: 45,
            paddingHorizontal: 15,
            backgroundColor: Colors.tabBarBg, 
        }
    },
    animationEnabled: false,
    swipeEnabled: false,
    // tabBarComponent: TabBarComponent
}


const TabBarComponent = (props) => {
    console.log('TabBarComponent Props: ', Object.keys(props));
}

const optionsStack = {
    initialRouteName: 'AvailableJob',
    lazyLoad: true,
}

const StackRoute = createStackNavigator({
    AvailableJob:   { screen: AvailableJob },
    ViewPostJob:   { screen: ViewPostJob },
}, optionsStack);

// export default TabNavigator({
export default createSwitchNavigator({
    Available:       { 
                    screen: AvailableJob,  
                    navigationOptions: ({ navigation }) => ({ 
                        headerVisible: false,  
                        tabBarLabel: (props) => (<TabItem {...props} label="Available" iconType="M" icon="card-travel" />),                        
                    })
                },

    Applied:     { 
                    screen: AppliedJob, 
                    navigationOptions: { 
                        tabBarLabel: (props) => (<TabItem {...props} label="Applied" iconType="M" icon="card-travel" />),                        
                    }
                },

}, options);