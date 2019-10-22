import {
    createStackNavigator, NavigationActions, createAppContainer
} from 'react-navigation';
import VideoScreen from '@components/discovery/video-view';
import VideoTrimScreen from '@components/user/comp/video-trim-view';
import TabNavigator from '@navigators/landing'

const options = {
    initialRouteName: 'RootScreen',
    lazyLoad: true,
    navigationOptions: {
        headerVisible: false,
        header: null,
    },
    mode: 'modal'
}

const authRootStack = createStackNavigator({
        
    RootScreen:   { 
        screen: TabNavigator, 
        navigationOptions: {
            headerVisible: false,
            header: null,
        } 
    },
    VideoScreen:   { 
        screen: VideoScreen,
        navigationOptions: {
            headerVisible: false,
            header: null,
        }},
    VideoTrimScreen:   { 
        screen: VideoTrimScreen,
        navigationOptions: {
            headerVisible: false,
            header: null,
        }},
}, options);

const navigateOnce = (getStateForAction) => (action, state) => {
    const {type, routeName} = action;
    // console.log('action: ', action, ' === ', 'state: ', state);
    return (
      state &&
      type === NavigationActions.NAVIGATE &&
      routeName === state.routes[state.routes.length - 1].routeName
    ) ? null : getStateForAction(action, state);
    // you might want to replace 'null' with 'state' if you're using redux (see comments below)
  };
  
  
  authRootStack.router.getStateForAction = navigateOnce(authRootStack.router.getStateForAction);
  
  export default createAppContainer(authRootStack);  