// import React from 'react';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'

import { StyleSheet, Image, ScrollView, Text, View, TextInput, TouchableOpacity, Alert, StatusBar, ActivityIndicator,
Platform } from 'react-native';

import { SEND_BRID_APP_ID } from '@constants/Consts';
import SendBird from 'sendbird';
import _ from 'lodash'

import ButtonBack from '@components/header/button-back'

import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';
import ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { postMedia, postApi, putApi, getApi } from '@api/request';
import RNFetchBlob from 'react-native-fetch-blob';
import Video from 'react-native-video';

import { UserHelper, StorageData, Helper } from '@helper/helper';


let sb = null;

const options = {
    title: 'Video Picker',
    takePhotoButtonTitle: 'Take Video...',
    mediaType: 'video',
    videoQuality: 'high'
};

const pic = [
    // {
    //     id: 1,
    //     uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/13690662_777391902401412_7742506644238257845_n.jpg?oh=88ea15a000a4ae04db0c72065af02abb&oe=59876F91',
    // },
    // {
    //     id: 2,
    //     uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/17799245_820895741395836_893744169114306193_n.jpg?oh=9f5dbd67b6df76217571ec7b8804e6f1&oe=59993FD3',
    // },
    // {
    //     id: 3,
    //     uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16508988_1075299335933144_3547182206399928845_n.jpg?oh=c1e90ca0968e7175be239e9131799261&oe=594CE7FD',
    // },
    // {
    //     id: 4,
    //     uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/14670629_106377253167543_2254683061619192365_n.jpg?oh=aa154b6e14368353322494cb048cc7f3&oe=597E1B1C',
    // },
];

let that;
let _userInfo;

function mapStateToProps(state) {
    console.log(state)
    return {
        user: state.user,
        user_info: UserHelper.UserInfo,
        // navigation: state.navigation
    }
}

// export default class SignUpInfo extends React.Component {
class UploadVideo extends Component{
    constructor(props){
        super(props);
        //your codes ....

        const { navigate, goBack, state } = this.props.navigation;
        
        _userInfo = state.params.sign_up_info;
        let video_uploaded = 0;
        console.log('user info video f: ', _userInfo);
        if(_userInfo.profile.video_uploaded_count)
            video_uploaded = _userInfo.profile.video_uploaded_count;

        that = this;
        this.state = {
            item_selected: -1,
            // video: [{'id':0, 'uri': 'https://talentora-rn.s3.amazonaws.com/resources/clouds/5906addab81611399dadd78b/videos/preview/367fda20-3176-11e7-b8f9-270be727ae37.mp4', 'paused':false}],
            // video: [{'id':0, 'uri': 'https://talentora-rn.s3.amazonaws.com/resources/clouds/5906addab81611399dadd78b/videos/preview/streaming/2b4f1a7b-a105-4dce-bf78-6c5c0d253913/hls720p/eae5ab90-317e-11e7-9615-59b0539b61c6.mp4', 'paused':false}],
            // video: [{'id':0, 'uri': 'https://talentora-rn.s3.amazonaws.com/resources/clouds/5906addab81611399dadd78b/videos/preview/9f6fee90-317f-11e7-9615-59b0539b61c6.mp4', 'paused':false}],
            video:[],
            already_upload: video_uploaded,
            idx: 0,
            isFirstVideo: false,  
        }
        // console.log('User Info : ',state.params);
        // console.log('Back button NWQ: ', this.props.navigation);
    }

    static navigationOptions = ({ navigation }) => ({
        // title: '',
        headerVisible: true,
        headerLeft: navigation.state.params.noBackButton ? null : (<ButtonBack
            isGoBack={ navigation }
            btnLabel= "Upload your photos"
        />),
    });


    _createSendBirdUser = (_userInfo) => {
		// sb = SendBird.getInstance();
		var _SELF = this;

        const { navigate, goBack, state } = this.props.navigation;
        // _userInfo = state.params.sign_up_info;
        console.log('Send Obj', sb, _userInfo._id);
		sb.connect(_userInfo._id, function (user, error) {
			if (error) { 
				_SELF.setState({
					userId: '',
					username: '',
					errorMessage: 'Login Error'
				});
				console.log(error);
				return;
			}

			console.log('create sendbrid user : ', user);

			// if (Platform.OS === 'ios') {
			//   if (sb.getPendingAPNSToken()){
			//     sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
			//       console.log("APNS TOKEN REGISTER AFTER LOGIN");
			//       console.log(result);
			//     });
			//   }
			// } else {
			//   if (sb.getPendingGCMToken()){
			//     sb.registerGCMPushTokenForCurrentUser(sb.getPendingGCMToken(), function(result, error){
			//       console.log("GCM TOKEN REGISTER AFTER LOGIN");
			//       console.log(result);
			//     });
			//   }
			// }

			sb.updateCurrentUserInfo(UserHelper._getUserFullName(), state.params.sign_up_info.featuredPhoto, function(response, error) {

			  console.log('updateCurrentUserInfo : ', response);
                _SELF.setState({
                    joining: false
                });
                // show home page 
                _SELF.props.authenticate(); 

			});

		});
    }

    joinUsNow() {
        // Alert.alert('login now');
        // dismissKeyboard();
        // const { navigate, goBack } = this.props.navigation;
        // navigate('WhatAreYou');

    }

    getStarted = () => {
        // Alert.alert('login now');
        // dismissKeyboard();
        // const { navigate, goBack } = this.props.navigation;
        // navigate('WhatAreYou');
        // console.log(this.props); 
        // this.props.authenticate();

        this.setState({
            joining: true
        });

        let that = this;

        let API_URL = '/api/users/register/completed';

        postApi(API_URL,
            JSON.stringify({})
        ).then((response) => {

            console.log('Response Object: ', response);
            if(response.status=="success"){

                let _result = response.result;

                // remove tmp storage
                StorageData._removeStorage('SignUpProcess');

                // save to final strorage key
                let _userData =  StorageData._saveUserData('TolenUserData',JSON.stringify(_result)); 
                UserHelper.UserInfo = _result; // assign for tmp user obj for helper
                _userData.then(function(result){
                    console.log('complete final save sign up'); 
                });

                // create sendbird user
                that._createSendBirdUser(_result);

                console.log('the most final data : ', UserHelper.UserInfo);

                // navigate('UploadPhoto', { sign_up_info: signUpInfo});
            }

        })

    }

    checkActiveTag = (item) => {
        // console.log('this.state.item_selected', this.state.item_selected , item);
        if(item.is_featured)
            return true;
        else
            return this.state.item_selected == item.id;
    }

    selectedTag = (item) => {
        // console.log(item);
        // Set other video not to play
        this.state.video.map((v, k) => {
            if(v.id != item.id)
                v.paused = true;
            else{
                v.paused = !v.paused;
            }
        });
        // if(item.paused)
        //     this.setState({
        //         video: 
        //     })
        //     item.paused = false;
        // else
        //     item.paused = true;

        console.log('item selected : ', item)

        if(this.state.item_selected != item.id){
            if(this.state.video.length>1){
                this._setProfileVideoFeature(item.uuid);
            }
        }
        
        this.setState({
            item_selected: item.id
        });
    }

    // set feature photo
    _setProfileVideoFeature = (_id) => {
        let that = this;
        // let API_URL = '/api/users/me/picture';
        let API_URL = '/api/users/me/feature/video';
        postApi(API_URL,JSON.stringify({
            feature : _id
        })).then((_response) => {
            console.log('success set photo cover response: ', _response);
        });
    }

    chooseVideo () {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('Response: ', response);
                let source = { uri: response.uri };
                // console.log('The state: ', this.state);
                let arrVideo = this.state.video.slice();
                let _id =0;
                if(arrVideo.length > 0)
                    _id = arrVideo.length;

                // console.log('fileName: ', response.fileName);
                arrVideo.push(
                    {
                        'id': _id, 
                        'fileName': response.fileName ? response.fileName : '', 
                        'uri': source.uri, 
                        'paused': true
                    }
                );
                let vdo_idx = arrVideo.length + this.state.already_upload;
                this.setState({
                    video: arrVideo,
                    idx: vdo_idx
                });

                // console.log('Video Length: ', this.state.video.length);
            }
        });
    }

    onLoad(value) {
        // console.log('value: ',value, 'Duration : ' + value.duration);
        // console.log('This : ', that);
        let vdoIdx = that.state.video.length - 1;
        if(value.duration > 61.0){
            // console.log('remove item from list cus of length > 60', vdoIdx);
            let vdo = that.state.video;
            vdo.splice(vdoIdx, 1);
            Alert.alert('The video length must be 1 minute max!');
            that.setState({
                video: vdo,
                idx: vdo.length
            });
        }
        else{
            let id = uuid.v4();
            let url = '/api/media/videos/'+ id +'/save';
            // console.log('Response: ', response);
            // console.log('Source URI: ', source.uri);
            // console.log('Fetch wrap 1: ', RNFetchBlob.wrap(response.uri));
            // console.log('Fetch wrap: ', RNFetchBlob.wrap((response.uri).replace('file://', '')));
            // let data = [
            //     {
            //         name: 'video' , 
            //         filename: response.fileName, 
            //         data: RNFetchBlob.wrap((response.uri).replace('file://', '')), 
            //         type:'video'
            //     }
            // ];

            let data = [];
            if(Platform.OS === 'ios'){
                data.push({
                    name: 'video' , 
                    filename: that.state.video[vdoIdx].fileName, 
                    data: RNFetchBlob.wrap((that.state.video[vdoIdx].uri).replace('file://', '')), 
                    type:'video',
                    is_hd: true
                })

            }else{
                data.push({
                    name: 'video',
                    filename: id,
                    data: RNFetchBlob.wrap(that.state.video[vdoIdx].uri),
                    type: 'video',
                    is_hd: true
                })
            }
            // console.log('This is data: ', data);
            // console.log('fileName: ', that.state.video[vdoIdx].fileName);
            postMedia(url, data).then((response) => {
                // console.log('success response: ', response);
                 _userInfo.profile.video_uploaded_count++;
                // console.log("Last User Info : ",_userInfo);
                let _userData =  StorageData._saveUserData('SignUpProcess',JSON.stringify(_userInfo)); 
                // UserHelper.UserInfo = _result; // assign for tmp user obj for helper
                _userData.then(function(result){
                    console.log('complete save sign up process 3'); 
                });
            });
        }
    }

    // get photo that user already upload
    _getVideo = () => {
        // GET /api/media?type=photo or /api/media?type=video or  /api/media
        let that = this;
        
        let API_URL = '/api/media?type=video';
        console.log(API_URL);
        getApi(API_URL).then((_response) => {
            // console.log('User Video Already Uploaded : ', _response);
            if(_response.code == 200){
                let _allImg = _response.result;

                console.log('User Video Already Uploaded : ', _response);
                let _tmp = [];
                _.each(_allImg,function(v,k){

                    let _videoUrl = v.s3_url + v.formatted_sd_video_url;

                    _tmp.push({
                        'id': k, 
                        'fileName': v.file_name, 
                        'uri': _videoUrl, 
                        'paused': true,
                        'uuid': v.upload_session_key,
                        'is_featured': v.is_featured,
                    });
                })

                that.setState({ 
                    video: _tmp,
                    idx: _tmp.length
                })


                
            }

        });
    }

	componentDidMount() {
		let _SELF = this;
		// init send bird
		sb = new SendBird({ appId: SEND_BRID_APP_ID });

        // if user not yet completed register
        // get all video that user upload 
        if(UserHelper._getUserInfo()){

            this._getVideo();
        }

    }

    _playVideo = (_item) => {
        // console.log('Play Video', _item);
        let _videos = _.cloneDeep(this.state.video);
        _.each(_videos,function(v,k){
            if(v.id == _item.id){
                v.paused = !v.paused;
            }
        })
        this.setState({
            video: _videos
        })

        // console.log(this.state.video);
    }


    render() {
        return (    
                <View style={[styles.container,styles.mainScreenBg]} onPress={() =>  dismissKeyboard()}>
                    <ScrollView style={[ styles.justFlexContainer ]}>
                        <View style={[styles.mainPadding]}>

                            <View style={[ styles.marginBotXS ]}>
                                <Text style={[styles.blackText, styles.btFontSize]}>
                                    Show your works
                                </Text>
 
                                <Text style={[styles.grayLessText, styles.marginTopXS]}>
                                    Feature your best work on video.
                                </Text>
                                <Text style={[ styles.marginTopMD, {color: Colors.primaryColor, textAlign:'right'} ]}>
                                    {this.state.video.length || 0}/4 Videos
                                </Text>
                            </View>

                            
                                <View style={[styles.boxWrapContainer, styles.boxWrapContainerNoWrap]}> 

                                    {this.state.video.map((item, index) => {
                                        {/*console.log(item);*/}
                                        return (
                                            <View key={ index } style={[ styles.justFlexContainer ]}>

                                                <TouchableOpacity
                                                    activeOpacity = {0.9} 
                                                    style={[styles.boxWrapItem, styles.boxWrapItemNoWrap, index != this.state.video.length-1  && styles.marginBotSM, this.checkActiveTag(item) && styles.boxWrapSelected]} 
                                                    onPress={ () => this.selectedTag(item) }>
                                                    <View style={[ styles.justFlexContainer ]}>
                                                        <Video source={{uri: item.uri}}   // Can be a URL or a local file.
                                                            ref={(ref) => {
                                                                this.player = ref
                                                            }}                                      // Store reference
                                                            rate={1.0}                              // 0 is paused, 1 is normal.
                                                            volume={1.0}                            // 0 is muted, 1 is normal.
                                                            muted={false}                           // Mutes the audio entirely.
                                                            paused={item.paused}                          // Pauses playback entirely.
                                                            resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
                                                            repeat={true}                           // Repeat forever.
                                                            playInBackground={false}                // Audio continues to play when app entering background.
                                                            playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                                                            ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                                                            progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                                                            //onLoadStart={this.loadStart}            // Callback when video starts to load
                                                            onLoad={this.onLoad}               // Callback when video loads
                                                            //onProgress={this.setTime}               // Callback every ~250ms with currentTime
                                                            //onEnd={this.onEnd}                      // Callback when playback finishes
                                                            //onError={this.videoError}               // Callback when video cannot be loaded
                                                            //onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                                            //onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
                                                            style={styles.backgroundVideo} />

                                                        {this.checkActiveTag(item) && (
                                                        
                                                            <View style={[styles.absoluteBox,styles.boxFeatured]}> 
                                                                <View style={[styles.boxWrapStatusContainer,styles.mainHorizontalPaddingSM]}> 
                                                                    <Text style={[styles.boxWrapSelectStatus, styles.fontBold]}>
                                                                        Featured
                                                                    </Text>
                                                                </View>
                                                            </View> 

                                                        )}
                                                    </View>
                                                    
                                                </TouchableOpacity> 

                                                <TouchableOpacity style={[ styles.iconPlayTopRight ]} onPress={() => this._playVideo(item) }>
                                                    <Icon 
                                                        name={ item.paused==true ? 'play-circle-filled' : 'pause-circle-filled' }
                                                        style={[ {color: 'white', fontSize: 40}, styles.shadowBox ]} 
                                                    />
                                                </TouchableOpacity>

                                            </View>    
                                        )
                                    })}

                                    { this.state.video.length >= 4 ? null :
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            style={[styles.boxWrapItem, styles.boxWrapItemNoWrap, styles.flexCenter, this.state.video.length>1 && styles.marginTopSM]} 
                                            onPress={this.chooseVideo.bind(this)}>

                                            <Icon
                                                name="add"
                                                style={[ styles.iconPlus ]} 
                                            />
                                        </TouchableOpacity> 
                                    }
                                </View>
                        </View>
                    </ScrollView>
                    
                    <View style={styles.absoluteBox}>
                        <View style={[styles.txtContainer,styles.mainHorizontalPadding]}>

                            <TouchableOpacity activeOpacity = {0.8} style={[styles.flatButton,]} onPress={() => this.getStarted() }>
                                {   
                                    !this.state.joining ? <Text style={[styles.flatBtnText, styles.btFontSize]}>Get Started</Text> : <ActivityIndicator color="white" animating={true} /> 
                                }
                            </TouchableOpacity>

                            <View style={[styles.centerEle, styles.marginTopSM]}>
                                <TouchableOpacity onPress={ () => { this.getStarted() } }>
                                    <Text style={styles.darkGrayText}> Skip this step </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>

                
            
        );
    }
}


var styles = StyleSheet.create({ ...FlatForm, ...Utilities, ...BoxWrap,
    container: {
        flex: 1,
        paddingBottom: 120
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingBottom: 200,
        // flexWrap: 'wrap'
    },
    txtContainer: {
        flex:1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

});

export default connect(mapStateToProps, AuthActions)(UploadVideo)
