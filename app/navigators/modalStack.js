import {
    createStackNavigator,
} from 'react-navigation';

import Settings from '../components/card/settings'

export default createStackNavigator({

    SettingsModal: { screen: Settings },

}, {});
