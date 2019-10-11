import {
    createStackNavigator,
} from 'react-navigation';

import MediaRecord from '../../components/media/media-record'
import ProfileUser from '../../components/user/profile'

const options = {
    headerMode: 'screen',
    initialRouteName: 'Record',
}


export default createStackNavigator({

    Record:   { screen: MediaRecord },
    Detail: { screen: ProfileUser }

}, options);
