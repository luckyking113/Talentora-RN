import {
    createStackNavigator,
} from 'react-navigation';

import Home from '../../components/card/home'
import Detail from '../../components/card/detail'

const options = {

}

export default createStackNavigator({

    Home:   { screen: Home },
    Detail: { screen: Detail }

}, options);
