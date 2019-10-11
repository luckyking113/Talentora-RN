import {
    createStackNavigator,
} from 'react-navigation';

import Search from '../../components/card/home'
import ProfileUser from '../../components/user/profile'

const options = {

}

export default createStackNavigator({

    Home:   { screen: Search },
    Detail: { screen: ProfileUser }

}, options);
