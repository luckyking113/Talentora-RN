import React from 'react'
import {
    createBottomTabNavigator,
    BottomTabBar
} from 'react-navigation';

import { Colors } from '@themes/index';

// import ButtonRight from '@components/header/button-right'
// import ButtonLeft from '@components/header/button-left'

// Screens
// Only one for now, add more as required
import Job from './job'
import Discovery from './discovery'
// import Search from './search'
// // import Record from './media'  
// import Message from './message'  
// import _Notification from './notification'  
// import User from './profile'  

// Tabs
import Tab from '@components/tabs/tab'

import { transparentHeaderStyle, defaultHeaderStyle } from '@styles/components/transparentHeader.style';


// TabNavigator options
const options = {
    initialRouteName: 'Job',
    lazy: true, // lazy = true it mean not load the component util user click on tab icon to shw it
    tabBarPosition: 'bottom',
    tabBarOptions: {
        inactiveTintColor: Colors.tabBarInactiveTintColor,
        activeTintColor: Colors.primaryColor,
        showIcon: true,
        showLabel: false,
        style: {
            backgroundColor: Colors.tabBarBg,
        }
    },

    animationEnabled: false,
    swipeEnabled: false,
    // tabBarComponent: TabBarComponent

    // customize event on click tab index and did other thing
    tabBarComponent: props => (
        <TabBarComponent
            {...props}
            jumpToIndex={index => {
                {/*console.log('props: ', props);*/}
                if (index === 2) {
                    jumpToIndex(index)
                }
                else {
                    jumpToIndex(index)
                }
            }}
        />

    )
}

const navOptions =  {   
    headerStyle: defaultHeaderStyle,  
    headerTitleStyle :{textAlign: 'center',alignSelf:'center'}, 
    // headerTintColor: Colors.textColorDark, 
}

// const TabBarComponent = (props) => {
//     console.log('TabBarComponent Props: ', Object.keys(props));
// }

const TabBarComponent = props => <BottomTabBar {...props} />;

export default createBottomTabNavigator({

    Job:       { 
                    screen: Job,  
                    navigationOptions: ({ navigation }) => ({ 
                        ...navOptions,
                        headerVisible: false,  
                        tabBarLabel: '',
                        tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="card-travel" />)
                    })
                },

    Discovery:     { 
                    screen: Discovery, 
                    navigationOptions: { 
                        headerVisible: false,  
                        tabBarLabel: '',
                        tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="public" />)
                    }
                },

    // Chat:     { 
    //                 screen: Message, 
    //                 navigationOptions: { 
    //                     headerVisible: false,  
    //                     tabBarLabel: '',
    //                     tabBarIcon: (props) => (<Tab {...props} iconType="I" icon="ios-chatbubbles-outline" />),
    //                 }
    //             },

    // Notification:    { 
    //                 screen: _Notification, 
    //                 navigationOptions: { 
    //                     headerVisible: false,  
    //                     tabBarLabel: '',
    //                     tabBarIcon: (props) => (<Tab {...props} iconType="I" icon="ios-notifications-outline" />)
    //                 }
    //             },

    // User:       { 
    //                 screen: User, 
    //                 navigationOptions: { 
    //                     headerVisible: false,  
    //                     tabBarLabel: '',
    //                     tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="person" />)
    //                 }
    //             },

}, options);
