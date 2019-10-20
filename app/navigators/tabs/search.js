import {
    NavigationActions,
    createStackNavigator
} from 'react-navigation';

import Search from '../../components/card/home'
import { headerStyle, titleStyle } from '../../styles/header.style'

const options = {
    navigationOptions:{
        headerStyle: headerStyle,  
        headerTitleStyle: titleStyle    
    }
}

const searchStack = createStackNavigator({
    Home:   { screen: Search },    
}, options);

const navigateOnce = (getStateForAction) => (action, state) => {
  const {type, routeName} = action;
  return (
    state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
  ) ? null : getStateForAction(action, state);
  // you might want to replace 'null' with 'state' if you're using redux (see comments below)
};

searchStack.router.getStateForAction = navigateOnce(searchStack.router.getStateForAction);

export default searchStack;
