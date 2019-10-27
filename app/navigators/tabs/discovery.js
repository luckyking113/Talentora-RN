import React from 'react';
import {NavigationActions, createStackNavigator} from 'react-navigation';

import {Colors} from '@themes/index';

// tabel (user)
import Discovery from '@components/discovery/discovery';
import ProfileUser from '@components/user/profile';
import MessageDetail from '@components/message/message';
import Review from '@components/user/review';
import LeaveReview from '@components/user/leave-review';

import {defaultHeaderStyle} from '@styles/components/transparentHeader.style';

// TabNavigator options
const optionsStack = {
  initialRouteName: 'Discovery',
  lazyLoad: true,
};

const options = {
  initialRouteName: 'People',
  lazyLoad: true,
  tabBarPosition: 'top',
  tabBarOptions: {
    // inactiveTintColor: '#aaa',
    inactiveTintColor: Colors.tabBarInactiveTintColor,
    activeTintColor: Colors.primaryColor,
    showIcon: false,
    showLabel: true,
    style: {
      height: 40,
      paddingHorizontal: 15,
      backgroundColor: Colors.tabBarBg,
      borderTopWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: Colors.lineColor,
      elevation: 1,
      shadowColor: Colors.lineColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 3,
      shadowOpacity: 0.5,
    },
  },
  animationEnabled: false,
  swipeEnabled: false,
};

const navOptions = {
  headerStyle: defaultHeaderStyle,
};

const discoveryStack = createStackNavigator(
  {
    Discovery: {
      screen: Discovery,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
      }),
    },
    Profile: {
      screen: ProfileUser,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
      }),
    },
    Review: {
      screen: Review,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
      }),
    },
    LeaveReview: {
      screen: LeaveReview,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
      }),
    },
    Message: {
      screen: MessageDetail,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
      }),
    },
  },
  optionsStack,
);

const navigateOnce = getStateForAction => (action, state) => {
  const {type, routeName} = action;
  return state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
    ? null
    : getStateForAction(action, state);
  // you might want to replace 'null' with 'state' if you're using redux (see comments below)
};

discoveryStack.router.getStateForAction = navigateOnce(
  discoveryStack.router.getStateForAction,
);

export default discoveryStack;
