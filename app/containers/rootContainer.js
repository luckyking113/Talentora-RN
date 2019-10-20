import React, { Component} from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'
import RootNavigator from '@navigators/root'
import RootAuthNavigator from '@navigators/auth-root'
import {Alert, DeviceEventEmitter, Linking } from 'react-native';
import LoadingScreen from '@components/other/loading-screen'; 
import OneSignal from 'react-native-onesignal'; 
import { UserHelper, StorageData, NotificationHelper, ChatHelper, Helper, GoogleAnalyticsHelper } from '@helper/helper';
import { getApi } from '@api/request';
import {notification_data} from '@api/response';
import DeviceInfo from 'react-native-device-info'
import _ from 'lodash'


import ImagePickerCrop from 'react-native-image-crop-picker';

const FBSDK = require('react-native-fbsdk');
const { LoginManager } = FBSDK;

// ignore some warning yellow box you want
console.ignoredYellowBox = ['Remote debugger','source.uri', 'Can only update a mounted', 'Task orphaned for request'];  

// Trigger if the app mount more than once when click android back button, and start app again.
let count = 0;

class Root extends Component {

    constructor(props){
        super(props);
        //your codes ....

        this.state = {  
            userData: null,
            isLoading: true,
            deviceId: null,
            isVisitedTutorialScreen: false,
        }

        this.onIds = this.onIds.bind(this);
        // console.log('Main Props: ', this.props);
        console.log = () => {};
        // console.log('Main Props: ', this.props);
    }

    // For Notification (OneSignal)
    componentWillMount() {
        // count ++;
        // console.log('Panhna Seng ====================== Will Mount', count);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }
 
    
    componentWillUnmount() {
        // console.log('Panhna Seng ====================== Will UnMount', count);
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        // OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }
    
    onReceived(notification) {
        console.log('======================== RECEIVED NOTIFICATION ========================');
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('======================== OPEN NOTIFICATION ========================');        
        console.log('openResult: ', openResult);
        let obj = {
            'type': openResult.notification.payload.additionalData.action,
            'data': openResult.notification.payload.additionalData
        }
        notification_data.push(obj);
        
        // Once the app is not in background (cleared) the event not worked because the app is started, the rootContainer worked befored emit function.
        DeviceEventEmitter.emit('OpenNotificationDetail', {'notificationData': 'any-data'});
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
		// console.log('Device info: ', device);
        // if(UserHelper._isLogIn()){
            if(device.userId){
                // NotificationHelper._registerDeviceToApi(device.userId)
                this.setState({
                    deviceId: device.userId
                }, function(){
                    // console.log('Device ID: ', device.userId);
                })
            }
        // }
        // else{

        // }
    }

    // register device for push notification to api 
    _registerDeviceToApi = () => {
        if(UserHelper._isLogIn()){
            if(this.state.deviceId){
                NotificationHelper._registerDeviceToApi(this.state.deviceId)
            }
        }
    }


    // login or register sendbird
    _sendBirdLoginRegister = () => {
        // check user login
        // try to login sendbird to store instand sendbird 
        // to make message process faster when click
        if(UserHelper._isLogIn()){
            console.log('starting login or register send bird'); 
            ChatHelper._sendBirdLogin(function(_sb){
                console.log('Send Bird Login or Register');
            })
            getApi('/api/devices/version').then((result) => {

                if(Helper._isDEV()) return;

                if(result.code == 200 && result.result){

                    if(Helper._isIOS()?result.result.ios_version > DeviceInfo.getVersion():result.result.android_version > DeviceInfo.getBuildNumber()){
                        Alert.alert('Update Available','A new update of Talentora is available. Please update to the lastest version.',
                        [{
                            text: 'Next time',
                        },{
                            text:'Update', 
                            onPress:() => {
                                let url = 'https://play.google.com/store/apps/details?id=co.talentora.app'
                                if(Helper._isIOS()){
                                    url = 'https://itunes.apple.com/app/talentora/id1164383007'
                                }
                                Linking.openURL(url)
                        }}]);
                    }

                } 
            });
        }
    }


    _loadInitialState = () => {
        // StorageData._removeStorage('IntroScreenVisited');
        let that = this;
        let _userData =  StorageData._loadInitialState('TolenUserData');

        _userData.then(function(result){ 
            // if has user login data
            if(!_.isEmpty(result)){
                UserHelper.UserInfo = JSON.parse(result);
                // delay 500ms to show loading screen
                setTimeout(function() {
                    // check expire user token
                    if(UserHelper._checkUserExpiredToken()){ // true = not expire, false expired
                        console.log('======== User Login ========');
                        that.props.authenticate(that);
                    }
                    else{
                        console.log('========= User Expired Delete Data ========');
                        if(UserHelper._chkFacebookAcc()){
                            LoginManager.logOut();
                        }
                        // remove storage data
                        StorageData._removeStorage('TolenUserData'); 
                        UserHelper.UserInfo = null; // assign null to user info obj. so it auto set autheticate data = null too
                        that.props.authenticate(that);
                    }


                }, 0); 
                
            }
            else{
                that.setState({  
                    isLoading: false,
                })
            }

            // console.log(that.props);
        });
        // console.log(that.props);
    }

    // test load signup process
    _loadInitialStateSignUpProcess = () => {
        let that = this;
        let _userData =  StorageData._loadInitialState('SignUpProcess');
        _userData.then(function(result){ 
            // console.log('SignUpProcess :', result);
        });
    }

    componentDidMount() {
        this._loadInitialState();  
        // this._loadInitialStateSignUpProcess();  

        // Calling clearOneSignalNotifications
        if(Helper._isAndroid())
            OneSignal.clearOneSignalNotifications();
            
    }

    // when state change we try to paused the video that playing by event emitter
    checkToPausedVideo = (prevState, currentState) => {
        try{
            console.log('PrevState: ', prevState, ' === ', 'CurrentState: ', currentState);
            const _prevState = _.head(prevState.routes);
            
            const _prevStateSelected = _prevState.routes[_prevState.index];
            console.log('Route Name: ', _prevStateSelected.routeName);

            const _subPrevState = _prevStateSelected.routes[_prevStateSelected.index];
            console.log('Sub Route Name: ', _subPrevState.routeName);

            if(_subPrevState.routeName == 'Discovery'){
                DeviceEventEmitter.emit('PausedAllVideos', {});
            }

            if(_subPrevState.routeName == 'Profile'){
                DeviceEventEmitter.emit('PausedAllVideosProfile', {});
            }

            else if( _subPrevState.routeName == 'EditProfile'){
                DeviceEventEmitter.emit('PausedAllVideosSetting', {});                    
            }

        }catch(e){
            console.log('Error Check To Paused Video: ', e);
        }

    }

    render() {        
        if(this.state.isLoading){
            return (
                <LoadingScreen/>
            ) 
        }
        else{
            if (this.props.user){
                this._registerDeviceToApi();

                ImagePickerCrop.clean().then(() => {
                    console.log('removed all tmp images from tmp directory');
                }).catch(e => {
                    console.log('cannot removed all tmp images from tmp directory');
                });

                // register user in google analytic
                if(this.props.user._id){
                    // console.log('user id : ',this.props.user._id);
                    GoogleAnalyticsHelper._setUser(this.props.user._id);        
                }
                

                // login or register send bird user
                this._sendBirdLoginRegister();


                return (
                    <RootNavigator onNavigationStateChange={(prevState, currentState) => {}} />
                )   // onNavigationStateChange={null} no console navigation change     
            }
            else
                return (                      
                    <RootAuthNavigator onNavigationStateChange={null} /> // onNavigationStateChange={null} no console navigation change                    
                );
        }
        
    }
}

function mapStateToProps(state) {
    // console.log('root state: ',state);
    return {
        appOption: state.app_option,
        user: state.user,
        navigation: state.navigation,
    }
}

export default connect(mapStateToProps, AuthActions)(Root)
