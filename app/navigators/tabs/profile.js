import {
    createStackNavigator,
} from 'react-navigation';

import Profile from '../../components/user/profile'
// import ProfileUser from '../../components/user/profile'

const options = {
    headerMode: 'screen',
    initialRouteName: 'Profile',
}


export default createStackNavigator({

    Profile:   { screen: Profile },
    // Detail: { screen: ProfileUser }

}, options);
