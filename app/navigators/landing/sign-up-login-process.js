import React from 'react'

import {
    createStackNavigator,
} from 'react-navigation';

import SignUp from '@components/user/profile'
import Authenticate from '@components/authentication/authenticate'

const options = {
    headerMode: 'screen',
    initialRouteName: 'LogIn',
}

export default createStackNavigator({

    LogIn:   { 
        screen: (props) => <Authenticate navigate = {props.navigation.navigate} />
    },
    SignUp: { screen: SignUp }

}, options);
