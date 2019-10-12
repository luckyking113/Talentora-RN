import React, { Component} from 'react'
import { connect } from 'react-redux'

import * as AuthActions from '@actions/authentication'

import RootNavigator from '@navigators/root'
import RootAuthNavigator from '@navigators/auth-root'
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';

import Authenticate from '@components/authentication/authenticate';
import LoadingScreen from '@components/other/loading-screen'; 
import OneSignal from 'react-native-onesignal'; 

import { UserHelper, StorageData } from '@helper/helper';

import _ from 'lodash'

class Root extends Component {

    constructor(props){
        super(props);
        //your codes ....

        this.state = {  
            userData: null,
            isLoading: true,
        }
    }

    // For Notification (OneSignal)
    componentWillMount() {
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        // OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }
    
    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
		console.log('Device info: ', device);
    }

    _removeStorage = () => {
        StorageData._removeStorage('TolenUserData');
    } 

    _loadInitialState = () => {

        let that = this;
        let _userData =  StorageData._loadInitialState('TolenUserData');
        
        _userData.then(function(result){ 

            // console.log('result', result);

            // if has user login data
            if(!_.isEmpty(result)){
                UserHelper.UserInfo = JSON.parse(result);

                // console.log('lol : ',UserHelper.UserInfo);

                // delay 500ms to show loading screen
                setTimeout(function() {
                    that.props.authenticate(that);
                // }, 500); 
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
            console.log('SignUpProcess :', result);
        });
    }

    componentDidMount() {

        // this._removeStorage(); // open this statement to remove user data. so we will see login screen first
        this._loadInitialState();  
        // this._loadInitialStateSignUpProcess();  
        // this.props.userData = null;

    }

    render() {
        // console.log(this.props.user, this.state.userData);
        // show login form on first load
        // console.log(this.props);

        if(this.state.isLoading){
            return (
                <LoadingScreen/>
            ) 
        }
        else{
            if (this.props.user)
        
                return (<RootNavigator />)   

            else

                return (
                    
                    <RootAuthNavigator /> 
                    
                );
        }
        
    }
}

function mapStateToProps(state) {
    // console.log(state);
    return {
        user: state.user,
        navigation: state.navigation,
    }
}

export default connect(mapStateToProps, AuthActions)(Root)
