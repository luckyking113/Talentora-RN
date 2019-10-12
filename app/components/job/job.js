import React, { Component} from 'react'
import { connect } from 'react-redux'

// import {
//     addNavigationHelpers
// } from 'react-navigation';

import * as AuthActions from '@actions/authentication'

import AllJobPosted from '@components/job/talent-seeker/post-job-list' // for talent seeker (employer)
// import AvailableJobApplied from '@navigators/tabs/job-tabs' // for talent (user)

import { StyleSheet, Text, View, AsyncStorage, Alert, TouchableOpacity } from 'react-native';

// import Authenticate from '@components/authentication/authenticate';
// import LoadingScreen from '@components/other/loading-screen'; 
// import OneSignal from 'react-native-onesignal'; 

import { getApi } from '@api/request';  
import { UserHelper, StorageData, Helper } from '@helper/helper';

import _ from 'lodash'
import { Colors } from '@themes/index';

import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';

import BoxWrap from '@styles/components/box-wrap.style';
import Tabs from '@styles/tab.style';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'

import AvailableJob from '@components/job/talent/available-job'
import AppliedJob from '@components/job/talent/applied-job'

// var ScrollableTabView = require('react-native-scrollable-tab-view'); 

import ScrollableTabView, {DefaultTabBar } from 'react-native-scrollable-tab-view';
// import {notification_data} from '@api/response';

let _SELF = null;

class JobRoot extends Component {

    constructor(props){
        super(props);

        // console.log('=== create job start ===');

        //your codes ....
        this.state = {  
            selectedTab: 0,
            initPage: 0
        }

        // if(notification_data)
        //     console.log('This is notification: ', notification_data);
        // else
        //     console.log('No NOTIFICATION DATA');
        // console.log('User: ', UserHelper.UserInfo);
    }

    static navigationOptions = ({ navigation }) => {
        // console.log('navigation : ', navigation);
        _SELF = navigation;
        // console.log('_SELF NAV: ',_SELF);
        return ({

            // headerVisible: true,
            headerTitle: UserHelper._isEmployer() ? 'Posted Jobs' : 'Jobs',
            headerLeft: (<ButtonLeft
                icon="person-add"
                navigate={navigation.navigate}
                to="InviteFriend"
            />),
            headerRight: UserHelper._isEmployer() ? (
                
                <View style={[styles.flexVerMenu, styles.flexCenter]}>

                    <ButtonRight
                        icon="add"
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        to="CreatePostJob"
                    />

                </View>
            ) : null,
        })};


    // on first load app get all photo & save with storage
    // photo will update next time user edit cover or add more photo
    _getAndUpdatePhoto = () => {

        let _SELF = this;

        let API_URL = '/api/media?type=photo';
        console.log(API_URL);

        let _userObj = _.cloneDeep(UserHelper.UserInfo);

        getApi(API_URL).then((_response) => {
            console.log('Get All Photo : ', _response);
            if(_response.code == 200){
                let _allImg = _response.result;

                const _cover = _.filter(_allImg, function(v,k){
                    return v.is_featured;
                });
                console.log('Cover Only: ',_cover);
                let userInfoWithPhoto = _.extend({
                    cover: _.head(_cover),
                    photos: _allImg,
                },_userObj)

                _SELF.setState({
                    reloadHeader: true,
                })

                let _userData =  StorageData._saveUserData('TolenUserData',JSON.stringify(userInfoWithPhoto)); 
                UserHelper.UserInfo = userInfoWithPhoto; // assign for tmp user obj for helper
                // _userData.then(function(result){
                //     console.log('complete final save sign up'); 
                // });

                console.log('Photo & Cover: ', userInfoWithPhoto);
            }

        });
    }

    componentDidMount() {

        // get first photo
        if(!UserHelper.UserInfo.cover)
            this._getAndUpdatePhoto();

    }

    onTabPress = (_tabIndex) => {
        this.setState({
            selectedTab: _tabIndex,
        })
        
    }

    _triggerSelectedTab = (_tabIndex) => {
        this.refs.scrollableTabView.goToPage(_tabIndex);
        // this.setState({
        //     initPage: _tabIndex
        // })
        // console.log('this state: ', this.state);
    }

    goToJobDetail = () => {  
        /* 
        console.log('Notification Data: ', notification_data);
        // console.log('Notification Data: ', notification_data[0].data.id);

        let API_URL = '/api/posts/' + notification_data[0].data.id;
        // console.log(API_URL);
        getApi(API_URL).then((_response) => {
            console.log('GET JOB BY ID : ', _response);
            if(_response.code == 200){
                const { navigate, goBack } = this.props.navigation;
                // navigate('ViewPostJob', {job: _job_info});
                navigate('ViewPostJob', {job: _response.result});
            }
        });
        */
    }

    render() {
        // console.log(this.props.user, this.state.userData);
        if (UserHelper._isEmployer())
            return(<AllJobPosted navigation={_SELF} />)
        else
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
                    
                    ref={'scrollableTabView'}
                    >
                        <AvailableJob  tabLabel='Available' navigation={_SELF}/>
                        <AppliedJob triggerTab={this._triggerSelectedTab} tabLabel='Applied' navigation={_SELF}/>
                    </ScrollableTabView>
                </View>
            
            );
            /*return (
                // <AllJobPosted navigation={_SELF} />
                <View style={[ styles.justFlexContainer, styles.mainScreenBg ]}>
 
                    <View style={[ styles.flexVerMenu, styles.customTabContainer, styles.flexCenter ]}>

                        <TouchableOpacity onPress={ () => this.onTabPress(0) } style={[ styles.customTabItem, this.state.selectedTab == 0 && styles.customTabItemSelected ]} activeOpacity={.8}>
                            <View style={[ styles.justFlexContainer, styles.customTabTextContainer ]}>
                                <Text style={[ styles.customTabItemText, this.state.selectedTab == 0 && styles.costomTabItemTextSelected ]}>Available</Text>
                            </View>
                        </TouchableOpacity> 

                        <TouchableOpacity onPress={ () => this.onTabPress(1) } style={[ styles.customTabItem, this.state.selectedTab == 1 && styles.customTabItemSelected ]} activeOpacity={.8}>
                            <View style={[ styles.justFlexContainer, styles.customTabTextContainer ]}>
                                <Text style={[ styles.customTabItemText, this.state.selectedTab == 1 && styles.costomTabItemTextSelected ]}>Applied</Text>
                            </View>
                        </TouchableOpacity> 

                    </View>

                    { this.state.selectedTab ==0 && <AvailableJob navigation={_SELF}/>}

                    { this.state.selectedTab ==1 && <AppliedJob navigation={_SELF}/>}

                </View>
                
            );*/
        
        
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

export default connect(mapStateToProps, AuthActions)(JobRoot)
