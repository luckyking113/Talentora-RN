import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as AuthActions from '@actions/authentication';
import {StyleSheet, View, DeviceEventEmitter} from 'react-native';
import {GoogleAnalyticsHelper, Helper} from '@helper/helper';
import _ from 'lodash';
import {Colors} from '@themes/index';
import Styles from '@styles/card.style';
import Utilities from '@styles/extends/ultilities.style';
import Tabs from '@styles/tab.style';
import ButtonRight from '@components/header/button-right';
import ButtonLeft from '@components/header/button-left';
import Videos from '@components/discovery/video';
import People from '@components/discovery/people';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomizeTabBar from '@components/ui/scroll-tab-view-custom-tab/customize-tab-item';
const dismissKeyboard = require('react-native-dismiss-keyboard');

let _SELF = null;

class DiscoveryRoot extends Component {
  constructor(props) {
    super(props);
    //your codes ....
    this.state = {
      selectedTab: 0,
      modalVisible: false,
      tabSelected: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Discover',

      headerLeft: (
        <ButtonLeft
          icon="invite-icon"
          navigate={navigation.navigate}
          to="InviteFriend"
        />
      ),
      headerRight: navigation.state.params ? (
        navigation.state.params.hasOwnProperty('hideFilter') ? (
          navigation.state.params.hideFilter ? null : (
            <View style={[styles.flexVerMenu, styles.flexCenter]}>
              <ButtonRight
                icon={
                  navigation.state.hasOwnProperty('params')
                    ? navigation.state.params.hasOwnProperty('filtered')
                      ? 'filter-icon'
                      : 'filter-icon'
                    : 'filter-icon'
                }
                // eslint-disable-next-line react-native/no-inline-styles
                style={{marginRight: 10}}
                navigate={navigation.navigate}
                navigation={navigation}
                isFilter={true}
                filterType={'discover'}
                to="Filters"
              />
            </View>
          )
        ) : null
      ) : null,

      headerRight1: (
        <View style={[styles.flexVerMenu, styles.flexCenter]}>
          <ButtonRight
            icon={
              navigation.state.hasOwnProperty('params')
                ? navigation.state.params.hasOwnProperty('filtered')
                  ? 'filter-icon'
                  : 'filter-icon'
                : 'filter-icon'
            }
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginRight: 10}}
            navigate={navigation.navigate}
            navigation={navigation}
            isFilter={true}
            filterType={'discover'}
            to="Filters"
          />
        </View>
      ),
    };
  };

  UNSAFE_UNSAFE_componentWillMount() {
    DeviceEventEmitter.addListener('UpdateFilterIconDiscover', data => {
      const {navigate, goBack, setParams} = this.props.navigation;
      setParams({
        tabType: 'Videos',
        // filtered: data.dataFilter ? true : false
      });
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener('UpdateFilterIconDiscover');
  }

  componentDidMount() {
    GoogleAnalyticsHelper._trackScreenView('Discover');

    // eslint-disable-next-line consistent-this
    _SELF = this;
    // init video type for filter
    const {setParams} = this.props.navigation;
    setParams({
      tabType: 'Videos',
      // filtered: true
    });
  }

  onTabPress = _tabIndex => {
    this.setState({
      selectedTab: _tabIndex,
    });
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onChangeTab = e => {    
    dismissKeyboard();
    if (!e.ref) {
      return;
    }
    // eslint-disable-next-line eqeqeq
    if (e.i == 1) {      
      e.ref.props.navigation.setParams({
        hideFilter: false,
      });
    } else {      
      e.ref.props.navigation.setParams({
        hideFilter: true,
      });
    }   

    const {setParams} = this.props.navigation;

    this.setState(
      {
        tabSelected: e.ref.props.tabLabel,
      },
      function() {
        setParams({
          tabType: e.ref.props.tabLabel,
        });
      },
    );
  };

  render() {
    return (
      <View style={[styles.justFlexContainer, styles.mainScreenBg]}>
        <ScrollableTabView
          style={[{marginTop: 0}]}
          // renderTabBar={() => (
          //   <CustomizeTabBar
          //     style={[{borderColor: Colors.componentBackgroundColor}]}
          //   />
          // )}
          // tabBarUnderlineStyle={[
          //   // eslint-disable-next-line react-native/no-inline-styles
          //   {backgroundColor: Colors.primaryColor, height: 2},
          // ]}
          tabBarUnderlineStyle={[
            // eslint-disable-next-line react-native/no-inline-styles
            {backgroundColor: 'red', height: 2},
          ]}
          tabBarBackgroundColor="white"
          tabBarPosition="overlayTop"
          tabBarActiveTextColor={Colors.primaryColor}
          tabBarInactiveTextColor={Colors.textBlack}
          scrollWithoutAnimation={false}
          // eslint-disable-next-line react-native/no-inline-styles
          tabBarTextStyle={{fontSize: 16}}
          onChangeTab={this.onChangeTab}
          prerenderingSiblingsNumber={1} // load content in all tav
          // eslint-disable-next-line react/no-string-refs
          ref={'scrollableTabView'}>
          <Videos
            tabLabel="Videos"
            navigation={this.props.navigation}
            discoverState={this.state}
          />
          <People
            tabLabel="People"
            navigation={this.props.navigation}
            discoverState={this.state}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    // user: state.user,
    // navigation: state.navigation,
    // nav: state.navigation
  };
}

const styles = StyleSheet.create({
  ...Styles,
  ...Utilities,
  ...Tabs,
  tabItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabsContainer: {
    justifyContent: 'center',
  },
  scrollableTabBar: {
    width: 120,
    height: 64,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10,
    // paddingTop: 20
  },
  tabBarUnderline: {
    //  height: 4,
    //  bottom: 5,
    //  borderRadius: 5,
    marginLeft: 50,
    width: 60,
    //  backgroundColor: '#57a8f5'
  },
});

export default connect(
  mapStateToProps,
  AuthActions,
)(DiscoveryRoot);
