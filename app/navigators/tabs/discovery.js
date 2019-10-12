import React from 'react'
import {
    TabNavigator,
    createStackNavigator
} from 'react-navigation';

import { Colors } from '@themes/index';

// import ButtonRight from '@components/header/button-right'
// import ButtonLeft from '@components/header/button-left'

// tabel (user)
// import Videos from '@components/discovery/video'
// import People from '@components/discovery/people'
import Discovery from '@components/discovery/discovery'

// import ProfileUser from '@components/user/profile'
// import MessageDetail from '@components/message/message'



// Tabs
// import Tab from '@components/tabs/tab' 
// import TabItem from '@components/tabs/tab-item'

import { transparentHeaderStyle, defaultHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';

// TabNavigator options
const optionsStack = {
    initialRouteName: 'Discovery',
    lazyLoad: true,
}

const options = {
    initialRouteName: 'People',
    lazyLoad: true,
    tabBarPosition: 'top',
    // indicatorStyle: {
    //     backgroundColor: 'red',
    // },
    tabBarOptions: {
        // inactiveTintColor: '#aaa',
        inactiveTintColor: Colors.tabBarInactiveTintColor,
        activeTintColor: Colors.primaryColor,
        showIcon: false,
        showLabel: true,
        // indicatorStyle: {
        //     backgroundColor: 'red',
        // },
        style: {
            height: 40,
            paddingHorizontal: 15,
            // marginBottom: 20,
            // paddingBottom: 5,
            backgroundColor: Colors.tabBarBg, 
            // backgroundColor: 'gray', 
            borderTopWidth: 0, 
            borderBottomWidth: 1, 
            borderBottomColor: Colors.lineColor,  
            elevation: 1,
            shadowColor: Colors.lineColor,
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowRadius: 3,
            shadowOpacity: .5
        }
    },
    animationEnabled: false,
    swipeEnabled: false,
}

const navOptions =  {
    headerStyle: defaultHeaderStyle,  
    // headerTintColor: Colors.textColorDark, 
}

// not use
// const discoveryTab = TabNavigator({

//     Videos:       { 
//                     screen: Videos,  
//                     navigationOptions: ({ navigation }) => ({ 
//                         ...navOptions,
//                         tabBarLabel: (props) => (<TabItem {...props} label="Videos" iconType="M" icon="card-travel" />),
//                         // tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="card-travel" />)
//                     })
//                 },

//     People:     { 
//                     screen: People, 
//                     navigationOptions: { 
//                         ...navOptions,
//                         tabBarLabel: (props) => (<TabItem {...props} label="People" iconType="M" icon="card-travel" />),
//                         // tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="public" />)
//                     }
//                 },

// }, options);

export default createStackNavigator({

    Discovery:   { 
        screen: Discovery,
        navigationOptions: ({ navigation }) => ({ 
            ...navOptions,
        })
     },
    // Profile:   { 
    //     screen: ProfileUser,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    // },
    //  Message:   { 
    //     screen: MessageDetail,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    //  },
    // Videos:   { screen: Videos },
    // People:   { screen: People },

}, optionsStack);
