import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as DetailActions from '@actions/detail'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar,
    Alert,
    Picker,
    Platform,
    Dimensions,
    ActionSheetIOS,
    DeviceEventEmitter
} from 'react-native'

import {view_profile_category} from '@api/response'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import {Colors} from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style';

import ButtonRight from '@components/header/button-right'
import ButtonTextRight from '@components/header/button-text-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'

import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';
import ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { postMedia, postApi, putApi, getApi, deleteApi } from '@api/request';
import RNFetchBlob from 'react-native-fetch-blob';
import Video from 'react-native-video';

import { UserHelper, StorageData, Helper } from '@helper/helper';

import _ from 'lodash'

import moment from 'moment'
import Prompt from 'react-native-prompt';

const {width, height} = Dimensions.get('window')


const options = {
    title: 'Video Picker',
    takePhotoButtonTitle: 'Take Video...',
    mediaType: 'video',
    videoQuality: 'high'
};

var BUTTONS = [
  'Delete',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

export default class VideoUploadEditProfile extends Component {

    constructor(props) {
        super(props);

        
        this.state = {
            startUpload: false,
            tmpUUID: '',
            video:[],
            videoFromApi: [], // store video from api for delete
            idx: 0,
            isFirstVideo: false,
            promptVisible: false,
            promptMessage: '', 
        }

        that = this;

        console.log('Video Props : ',this.props);

    }

    _playVideo = (_item) => {
        // console.log('Play Video', _item);
        let _videos = _.cloneDeep(this.state.video);
        _.each(_videos,function(v,k){
            if(v.id == _item.id){
                v.paused = !v.paused;
            }
            else{
                v.paused = true;
            }
        })
        this.setState({
            video: _videos
        })

        // console.log(this.state.video);
    }

    checkActiveTag = (item) => {

        return item.is_featured;
    }

    selectedTag = (item) => {

        // console.log('item selected : ', item)

        if(this.state.item_selected != item.id){
            if(this.state.video.length>=1){
                this._setProfileVideoFeature(item.uuid);
            }
        }
    
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
            let _tmp = _.cloneDeep(that.state.video);
            _.each(_tmp, function(v,k){
                console.log(v.upload_session_key,' == ', _id)
                if(v.uuid == _id){
                    v.is_featured = true;
                }
                else{
                    v.is_featured = false;
                }
            })
            console.log('_tmp : ', _tmp);
            this.setState({
                video: _tmp,
            })

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

                let _photoUUID = uuid.v4();

                arrVideo.push(
                    { 
                        'id': _id, 
                        'uuid': _photoUUID,
                        'fileName': response.fileName ? response.fileName : '', 
                        'uri': source.uri, 
                        'paused': true
                    }
                );
                let vdo_idx = arrVideo.length + this.state.already_upload;


                this.setState({
                    startUpload: true,
                    tmpUUID: _photoUUID,
                    video: arrVideo,
                    idx: vdo_idx
                });

                // console.log('Video Length: ', this.state.video.length);
            }
        });
    }

    onLoad(value) {
        console.log("On Load Value",value);
        // prevent on video load from api no need to upload again
        if(!that.state.startUpload)
            return;

        // console.log('value: ',value, 'Duration : ' + value.duration);
        // return;
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
            // let _videoUUID = uuid.v4();
            that.setState({
                isUploading: true,
                promptVisible: true,
            });
        }
    }
    _uploadVideo(caption){
            let vdoIdx = that.state.video.length - 1;
            let _videoUUID = that.state.tmpUUID;
            let url = '/api/media/videos/'+ _videoUUID +'/save';

            let vdo = that.state.video;
            vdo[vdoIdx].caption = caption;
            that.setState({
                video: vdo,
                idx: vdo.length
            });

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
                    filename: _videoUUID,
                    data: RNFetchBlob.wrap(that.state.video[vdoIdx].uri),
                    type: 'video',
                    is_hd: true
                })
            }
            url +='?by_pass=1&caption=' +  encodeURI(caption);
            // console.log('This is data: ', data);
            // console.log('fileName: ', that.state.video[vdoIdx].fileName);
            postMedia(url, data).then((response) => {
                console.log('success response: ', response);

                if(response.code != 200){
                    alert('Can not upload the video. Please try again.');
                    return;
                }

                //  _userInfo.profile.video_uploaded_count++;
                // console.log("Last User Info : ",_userInfo);

                _userInfo = _.cloneDeep(UserHelper.UserInfo);

                // store video that already upload for delete
                that.setState((previousState) => {
                    // console.log('previousState.messages : ',previousState.messages);
                    previousState.videoFromApi.push(response.result);
                    return {
                        startUpload: false,
                        videoFromApi: previousState.videoFromApi
                    };
                });


                if(_userInfo.videos){
                    _userInfo.videos.push(response.result);
                }
                else{
                    _userInfo = _.extend({
                        videos: [response.result]
                    }, _userInfo);
                }


                let _userData =  StorageData._saveUserData('SignUpProcess',JSON.stringify(_userInfo));

                // UserHelper.UserInfo = _result; // assign for tmp user obj for helper
                _userData.then(function(result){
                    // console.log('complete save sign up process 3'); 
                });

                // set cover on first upload image 
                if(!that.state.isFirstVideo && that.state.video.length==1){ 
                    // let _photoId =  response.result._id;
                    that._setProfileVideoFeature(_videoUUID);
                    that.setState({
                        isFirstVideo: true
                    })
                }
                // this.state

                setTimeout(function(){
                    // trigger to force flatlist re-render
                    // DeviceEventEmitter.emit('updateProfileInfo',  {update_video: true})
                    const { navigate, goBack, state, setParams } = that.props.navigation;
                    setParams({
                        updateUserVideoList: true
                    }); 
                },5000)

            });
    }
    // get photo that user already upload
    _getVideo = () => {
        // GET /api/media?type=photo or /api/media?type=video or  /api/media
        let that = this;
        
        let API_URL = '/api/media?type=video';
        // console.log(API_URL);
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
                        'uuid': v.upload_session_key, 
                        'fileName': v.file_name, 
                        'uri': _videoUrl, 
                        'paused': true,
                        'uuid': v.upload_session_key,
                        'is_featured': v.is_featured,
                    });
                })

                that.setState({
                    videoFromApi: _allImg,
                    video: _tmp,
                    idx: _tmp.length
                })


                
            }

        });
    }

    _removeVideo = (_media, _mediaIndex) => {
        let that = this;
        let _mediaInfo = this.state.videoFromApi[_mediaIndex] ? this.state.videoFromApi[_mediaIndex] : null;

        // console.log('_mediaInfo : ', _mediaInfo);
        // console.log('this.state.videoFromApi : ', this.state.videoFromApi);
        
        if(_mediaInfo && _mediaInfo._id){

            let API_URL = '/api/media/videos/'+ _mediaInfo._id;

            // console.log('this.state.videoFromApi : ', this.state.videoFromApi);
            // console.log('_mediaIndex : ', _mediaIndex, ' === ', '_mediaInfo :', _mediaInfo);

            // return;

            deleteApi(API_URL).then((_response) => {
                console.log('Delete video : ', _response);
                if(_response.code == 200){

                    var _videoFromApi = _.filter(_.cloneDeep(that.state.videoFromApi), function(v,k) {
                        return k != _mediaIndex;
                    });
                    var _videoTmp = _.filter(_.cloneDeep(that.state.video), function(v,k) {
                        return k != _mediaIndex;
                    });


                    // console.log('_videoFromApi :', _videoFromApi);
                    // console.log('_videoTmp :', _videoTmp);

                    that.setState({
                        videoFromApi: _videoFromApi,
                        video: _videoTmp,
                        idx: _videoTmp.length
                    }, function(){
                        // trigger to force flatlist re-render
                        DeviceEventEmitter.emit('updateProfileInfo',  {update_video: true})
                    })

                    
                }

            });
        }
        else{
            alert('Can not delete this video. Please try again.');
        }
    }

    _mediaOption = (_media, _mediaIndex) => {
        let _SELF = this;


        if(Helper._isIOS){
            // popup message from bottom with ios native component
            ActionSheetIOS.showActionSheetWithOptions({

                message: 'Are you sure you want to delete this video?',
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

            },
            (buttonIndex) => {

                // console.log(buttonIndex);
                //   this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex==0){
                    _SELF._removeVideo(_media, _mediaIndex)
                }

            });
        }
        else{

            // for android ask with alert message with button

            // Works on both iOS and Android
            Alert.alert(
            'Are you sure you want to delete this video?',
            // 'My Alert Msg', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () =>  _SELF._removeVideo(_mediaId, _mediaIndex) },
            ],
            { cancelable: false }
            )
        }
    }

	componentDidMount() {
        // if user not yet completed register
        // get all video that user upload 
        if(UserHelper._getUserInfo()){

            this._getVideo();
        }
    }
    _prompt = () =>{
        console.log("Prompt calling");
        return (
            <Prompt
                title="Input video name"
                placeholder="video name"
                //defaultValue="Hello"
                visible={this.state.promptVisible}
                onCancel={ () => { 
                    alert('You need to provide video name');
                    /* this.setState({
                        // promptVisible: false,
                        message: "Unnamed Video"
                    }).then(function(){
                        console.log('This is video name: ', this.state.promptMessage);
                        this._uploadVideo()
                    }) } */
                } }
                onSubmit={(value) => { 
                    if(value == '') return;
                    this.setState({
                        promptVisible: false,
                        promptMessage: value
                    })
                    
                    setTimeout(function(){
                        // console.log('This is video name: ', that.state.promptMessage);
                        that._uploadVideo(that.state.promptMessage);
                    }, 50)}
                }
            />
        );
    }
    render() {

        // {console.log("This is the information of the user: ", this.props.userInfo)}
        return ( 
            <View style={[ styles.justFlexContainer ]}>

                <View style={[styles.marginBotMD]}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.7}}>
                            <Text style={{fontWeight:'bold'}}>
                            Videos
                            </Text>
                        </View>  
                        <View style={{flex:0.3}}>
                            <Text style={[ {color: Colors.primaryColor, textAlign:'right'} ]}>
                                {this.state.video.length || 0}/4 Videos
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[styles.boxWrapContainer, styles.boxWrapContainerNoWrap,{flexDirection: 'row',justifyContent:'flex-start'}]}> 

                        {this.state.video.map((item, index) => {
                            {/*console.log(item);*/}
                            return (
                                <View key={ index } style={[ styles.justFlexContainer ]}>

                                    <TouchableOpacity
                                        activeOpacity = {0.9} 
                                        style={[styles.boxWrapItem, styles.boxWrapItemNoWrap, this.checkActiveTag(item) && styles.boxWrapSelected, {width:300,marginRight:10}]} 
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

                                    <TouchableOpacity style={[ styles.iconPlayTopRight, {right: 25} ]} onPress={() => this._playVideo(item) }>
                                        <Icon 
                                            name={ item.paused==true ? 'play-circle-filled' : 'pause-circle-filled' }
                                            style={[ {color: 'white', fontSize: 40}, styles.shadowBox ]} 
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[ styles.iconPlayBottomRight, {right: 25} ]} onPress={() => this._mediaOption(item, index) }>
                                        <Icon 
                                            name={ 'more-horiz' }
                                            style={[ {color: 'white', fontSize: 30}, styles.shadowBox ]} 
                                        />
                                    </TouchableOpacity>
                                </View>    
                            )
                        })}

                        { this.state.video.length >= 4 ? null : 
                            
                                <TouchableOpacity
                                    activeOpacity = {0.9}
                                    style={[styles.boxWrapItem, styles.boxWrapItemNoWrap, styles.flexCenter,{width:300,marginRight:20}]} 
                                    onPress={this.chooseVideo.bind(this)}>

                                    <Icon
                                        name="add"
                                        style={[ styles.iconPlus ]} 
                                    />
                                </TouchableOpacity>
                                
                        
                        }

                    </View>
                </ScrollView>
                {this._prompt()}
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