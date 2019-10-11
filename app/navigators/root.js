import {
    createStackNavigator,createAppContainer    
} from 'react-navigation';

import TabNavigator from './tabs'
// import Authenticate from '../components/authentication/authenticate'
import Settings from '../components/card/settings'
import Record from '../components/media/media-record'

const MainNavigator = createStackNavigator({

    Home:       { screen: TabNavigator, navigationOptions: { headerVisible: false }},
    Settings:   { screen: Settings },
    Record:   { screen: Record }

}, {
    headerMode: 'screen',
    initialRouteName: 'Home',
});


export default createAppContainer(MainNavigator);
