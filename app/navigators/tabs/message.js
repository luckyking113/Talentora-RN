import {
    createStackNavigator,
} from 'react-navigation';

import Message from '@components/message/message'
// import Notification from '@components/messsage/notification/notification'


const options = {
    headerMode: 'screen',
    initialRouteName: 'Message',
}


export default createStackNavigator({

    Message:   { screen: Message },
    // Notification: { screen: Notification }

}, options);
