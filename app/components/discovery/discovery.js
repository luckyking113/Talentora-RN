import React, { Component} from 'react'
import { connect } from 'react-redux'

// import {
//     addNavigationHelpers
// } from 'react-navigation';

import * as AuthActions from '@actions/authentication'

// import AllJobPosted from '@components/job/talent-seeker/post-job-list' // for talent seeker (employer)
// import AvailableJobApplied from '@navigators/tabs/job-tabs' // for talent (user)

import { StyleSheet, Text, View, AsyncStorage, Alert, TouchableOpacity } from 'react-native';

// import Authenticate from '@components/authentication/authenticate';
// import LoadingScreen from '@components/other/loading-screen'; 
// import OneSignal from 'react-native-onesignal'; 

import { UserHelper, StorageData } from '@helper/helper';

import _ from 'lodash'
import { Colors } from '@themes/index';

import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';

// import BoxWrap from '@styles/components/box-wrap.style';
import Tabs from '@styles/tab.style';

// import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'

// import AvailableJob from '@components/job/talent/available-job'
// import AppliedJob from '@components/job/talent/applied-job'
import Videos from '@components/discovery/video'
import People from '@components/discovery/people'

// var ScrollableTabView = require('react-native-scrollable-tab-view'); 

import ScrollableTabView, {DefaultTabBar } from 'react-native-scrollable-tab-view';

let _SELF = null;

class DiscoveryRoot extends Component {

    constructor(props){
        super(props);
        //your codes ....
        this.state = {  
            selectedTab: 0
        }  
    }

    static navigationOptions = ({ navigation }) => {
        // console.log('navigation : ', navigation);
        _SELF = navigation;
         
        return ({

            // headerVisible: true,
            // headerTitle: UserHelper._isEmployer() ? 'Posted Jobs' : 'Jobs',
            headerTitle: 'Discover',
            headerLeft: (<ButtonLeft
                icon="person-add"
                navigate={navigation.navigate}
                to="InviteFriend"
            />),
            headerRight1: UserHelper._isEmployer() ? (
                
                <View style={[styles.flexVerMenu, styles.flexCenter]}>

                    <ButtonRight
                        icon="filter-list"
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        to="Filters" 
                    />

                </View>
            ) : null,
        })};

    componentDidMount() {
        

    }

    onTabPress = (_tabIndex) => {
        this.setState({
            selectedTab: _tabIndex,
        })
    }

    render() {
        // console.log(this.props.user, this.state.userData);


            return (
                <View style={[ styles.justFlexContainer, styles.mainScreenBg ]}>
                    <ScrollableTabView
                    style={[{marginTop: 0}, styles.boxWithShadow]}
                    renderTabBar={() => <DefaultTabBar />}
                    tabBarUnderlineStyle={{ backgroundColor: Colors.primaryColor,height:2 }}
                    tabBarBackgroundColor='transparent'
                    tabBarActiveTextColor={ Colors.primaryColor }
                    tabBarInactiveTextColor={ Colors.textBlack }
                    scrollWithoutAnimation={true}
                    tabBarTextStyle={{fontSize: 16}}

                    >            
                        <Videos  tabLabel='Videos' navigation={_SELF}/>
                        <People  tabLabel='People' navigation={_SELF}/>
                    </ScrollableTabView>
                </View>
            
            );

        
    }
}

function mapStateToProps(state) {
    // console.log('main state',state);
    return {
        // user: state.user,
        // navigation: state.navigation,
        // nav: state.navigation
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...Tabs,

})

export default connect(mapStateToProps, AuthActions)(DiscoveryRoot)
