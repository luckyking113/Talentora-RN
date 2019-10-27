import React from 'react';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation';
import {DeviceEventEmitter} from 'react-native';
import {Colors} from '@themes/index';
import Job from './job';
import Discovery from './discovery';
import Message from './message';
import _Notification from './notification';
import User from './profile';

// Tabs
import Tab from '@components/tabs/tab';

import {defaultHeaderStyle} from '@styles/components/transparentHeader.style';

// TabNavigator options
const options = {
  initialRouteName: 'Job',
  lazy: true, // lazy = true it mean not load the component util user click on tab icon to shw it
  tabBarPosition: 'bottom',
  tabBarOptions: {
    inactiveTintColor: Colors.tabBarInactiveTintColor,
    activeTintColor: Colors.primaryColor,
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: Colors.tabBarBg,
      borderTopColor: Colors.lineColor,
    },
  },

  animationEnabled: false,
  swipeEnabled: false,
  // tabBarComponent: TabBarComponent

  // customize event on click tab index and did other thing
  tabBarComponent: props => (
    <TabBarComponent
      {...props}
      jumpToIndex={index => {
        const lastPosition = props.navigationState.index;
        const tab = props.navigationState.routes[index];
        const tabRoute = tab.routeName;
        const firstTab = tab.routes[0].routeName;
        const _emitEvent = 'clearBadgeNumber_' + firstTab;

        if (index != 2) {
          setTimeout(function() {
            DeviceEventEmitter.emit('clearBadgeNumber', {
              tabType: firstTab,
            });

            // refresh data when user click on tab that still have red dot
            if (firstTab == 'Discovery') {
              DeviceEventEmitter.emit('Refresh_Discovery_People');
              DeviceEventEmitter.emit('Refresh_Discovery_Video');
            } else if (firstTab == 'JobList') {
              DeviceEventEmitter.emit('refreshJopListList');
            } else if (firstTab == 'Notification') {
              DeviceEventEmitter.emit('refreshNoti');
            }
          }, 500);
        }

        if (index === 2) {
          DeviceEventEmitter.emit('reloadMesssageList', {});
          DeviceEventEmitter.emit('UpdateUserEnterExitChatRoom', {
            status: true,
          });
          jumpToIndex(index);
        } else {
          DeviceEventEmitter.emit('UpdateUserEnterExitChatRoom', {});
          jumpToIndex(index);
        }
      }}
    />
  ),
};

const navOptions = {
  headerStyle: defaultHeaderStyle,
  headerTitleStyle: {textAlign: 'center', alignSelf: 'center'},
  // headerTintColor: Colors.textColorDark,
};

const TabBarComponent = props => <BottomTabBar {...props} />;

export default createBottomTabNavigator(
  {
    Job: {
      screen: Job,
      navigationOptions: ({navigation}) => ({
        ...navOptions,
        headerVisible: false,
        tabBarLabel: '',
        tabBarIcon: props => (
          <Tab
            {...props}
            navigation={navigation}
            iconType="C"
            icon="job-icon"
            notiType="job"
          />
        ),
      }),
    },

    Discovery: {
      screen: Discovery,
      navigationOptions: ({navigation}) => ({
        headerVisible: false,
        tabBarLabel: '',
        tabBarIcon: props => (
          <Tab
            {...props}
            navigation={navigation}
            iconType="C"
            icon="discover-icon"
            notiType="discover"
          />
        ),
      }),
    },

    Chat: {
      screen: Message,
      navigationOptions: ({navigation}) => ({
        headerVisible: false,
        tabBarLabel: '',
        tabBarIcon: props => (
          <Tab
            {...props}
            navigation={navigation}
            iconType="C"
            icon="message-icon"
            notiType="chat"
          />
        ),
      }),
    },

    Notification: {
      screen: _Notification,
      navigationOptions: ({navigation}) => ({
        headerVisible: false,
        tabBarLabel: '',
        tabBarIcon: props => (
          <Tab
            {...props}
            navigation={navigation}
            iconType="C"
            icon="notification-icon"
            notiType="noti"
            badgeNumber={
              typeof navigation.state.params === 'undefined'
                ? 0
                : navigation.state.params.badgeCount
            }
          />
        ),
      }),
    },

    User: {
      screen: User,
      navigationOptions: ({navigation}) => ({
        headerVisible: false,
        tabBarLabel: '',
        //tabBarIcon: (props) => (<Tab {...props} iconType="M" icon="person" />)
        tabBarIcon: props => (
          <Tab
            {...props}
            navigation={navigation}
            iconType="C"
            icon="profile-icon"
            notiType="user"
          />
        ),
      }),
    },
  },
  options,
);
