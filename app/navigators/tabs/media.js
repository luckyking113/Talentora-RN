import {
    createStackNavigator,
} from 'react-navigation';

import MediaRecord from '../../components/media/media-record'
import { headerStyle, titleStyle } from '../../styles/header.style'

const options = {
    headerMode: 'screen',
    initialRouteName: 'Record',

    navigationOptions:{
        headerStyle: headerStyle,  
        headerTitleStyle: titleStyle,        
    }

}


export default createStackNavigator({
    Record:   { screen: MediaRecord }
}, options);
