import {
    createStackNavigator, createAppContainer
} from 'react-navigation';

import TabNavigator from '@navigators/tabs'
// import Authenticate from '../components/authentication/authenticate'
import Settings from '@components/card/settings'
import Message from './tabs/message'  

// import Record from '../components/media/media-record'

// export default DrawerNavigator({
//     Home:       { screen: TabNavigator},
//     // Settings:   { screen: Settings },
//     // Record:   { screen: Record }

// }, {
//     headerMode: 'screen',
//     initialRouteName: 'Home',
//     drawerPosition: 'right',
//     navigationOptions: {
//         drawer: () => ({
//             // label: 'Menu'
//          }),
//     },
//     contentOptions: { 
//        activeTintColor: 'red', 
//     }
// });

const options = {
    initialRouteName: 'RootScreen',
    lazyLoad: true,
    navigationOptions: {
        headerVisible: false,
        header: null,
    },
    mode: 'modal'
}

const MainNavigator = createStackNavigator({

    RootScreen:   { 
        screen: TabNavigator,
        navigationOptions: {
            headerVisible: false,
        }
    },
    Settings:   { 
        screen: Settings,     
        navigationOptions: {
            headerVisible: false,
        }},
    ChatModal:   { 
        screen: Message,     
        navigationOptions: {
            headerVisible: false,
            header: null,
        }},
},options);

// export default TabNavigator;
export default createAppContainer(MainNavigator);


// import {
//     createStackNavigator,createAppContainer    
// } from 'react-navigation';

// import TabNavigator from './tabs'
// // import Authenticate from '../components/authentication/authenticate'
// import Settings from '../components/card/settings'
// import Record from '../components/media/media-record'

// const MainNavigator = createStackNavigator({

//     Home:       { screen: TabNavigator, navigationOptions: { headerVisible: false }},
//     Settings:   { screen: (props) => <Settings navigate = {props.navigation.navigate} /> },
//     Record:   { screen: Record }

// }, {
//     headerMode: 'screen',
//     initialRouteName: 'Home',
// });


// export default createAppContainer(MainNavigator);
