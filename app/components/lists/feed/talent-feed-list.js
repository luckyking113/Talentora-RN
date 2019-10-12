import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import * as DetailActions from '@actions/detail'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    // TouchableWithoutFeedback,
    Image,
    Alert,
    // Modal,
    Dimensions,
    ActionSheetIOS,
    ActivityIndicator
} from 'react-native'

// import { view_profile_category } from '@api/response'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style'; 

// import ButtonRight from '@components/header/button-right'
// import ButtonTextRight from '@components/header/button-text-right'
// import ButtonLeft from '@components/header/button-left'
// import ButtonBack from '@components/header/button-back'

import SendBird from 'sendbird';
import _ from 'lodash'

import Video from 'react-native-video';

import { UserHelper, StorageData, Helper, ChatHelper } from '@helper/helper';

const { width, height } = Dimensions.get('window')
const sb = null;

import CacheableImage from 'react-native-cacheable-image';


var BUTTONS_DELETE = [
  'Delete',
  'Cancel',
];
var BUTTONS_REPORT = [
  'Report',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

export default class TalentFeedList extends Component {

    constructor(props){
        super(props);

        sb = SendBird.getInstance();



        this.state = {
            paused: true,
            height : Dimensions.get('window').width / (16 / 9),
            initHeight: false,
        }

        // console.log('height :', Dimensions.get('window').height);
    }

    _togglePlayVideo = (_isMuted) => {
        // this.setState({
        //     paused : !this.state.paused, 
        // })s
        // console.log('this.props', this.props);
        if(this.props.togglePlayVideo){
            this.props.togglePlayVideo(this.props.videoId, _isMuted);
        }
    }

	// _createChannel(_item) {

	// 	// let _SELF = this;

	// 	const { navigate, goBack, state } = this.props.navigation;
		

	// 	let name = '';
	// 	let _channelURL = '';
	// 	let userIds = [this.props.id];
	// 	let coverFile = this.props.cover;
	// 	let data = '{}';
	// 	let customType = ''; 


    //     // console.log(' ID : ', userIds, ' coverFile: ', coverFile);
    //     // return;


	// 	// For typical 1-to-1 chat which is unique between two users
	// 	// if user already make channel it will return data as openChannel
	// 	// open the new one
	// 	sb.GroupChannel.createChannelWithUserIds(userIds, true, name, coverFile, data, customType, function (createdChannel, error) { 

	// 	// open channel that already existed
	// 	// sb.GroupChannel.getChannel(_channelURL, function (channel, error) {


	// 		console.log('Create Channed 1-to-1 : ', channel); 

	// 		if (error) {
	// 			console.error(error);
	// 			return;
	// 		}


	// 		// mark as read message to clear badge number of message list for partner that user selected
	// 		// channel.markAsRead();

	// 		// userChannel = channel;
	// 		// _SELF._getPreviousMessage(channel);


	// 	}); 

	// }

    _openMessage = () => {
        // console.log('Talent Feed List : ', this.props);
        
        let userObj = {
            id : this.props.userId,
            cover : this.props.cover, 
            full_name : this.props.title, 
        }
        let _SELF = this;

        ChatHelper._sendBirdLogin(function(_sb){ 
            sb = _sb;
            ChatHelper._createChannel(sb, userObj, null, function(_channel){
                // console.log('This is props: ', _SELF.props);

                const { navigate, goBack, state } = _SELF.props.navigation;

                let _tmpChatData = {
                    name: userObj.full_name,
                    channelUrl: _channel.url,
                    chat_id: userObj.id,
                }

                let  _chkExistInChannel = _.head(ChatHelper._checkExistUserInChennel(userObj.id));

                // console.log('_chkExistInChannel: ', _chkExistInChannel);
                
                let _paramObj = {
                    message_data: _tmpChatData
                };

                // if(_.isEmpty(_chkExistInChannel)){
                //     // navigate('Message',{message_data: _tmpChatData, resetScreen : 'RootScreen'}); 
                //     _paramObj = _.extend({
                //         routeIndex : 0,
                //         resetScreen : 'MessageList',
                //         routeKey : 'MessageList'
                //     },_paramObj);
                // }
                navigate('Message',_paramObj); 
            })
        })

    }

    setHeight = (e) => {
        console.log('Video Loaded');
        let _SELF = this;
        const naturalRatio = 16 / 9;
        const videoRatio = e.naturalSize.width / e.naturalSize.height;
        if (videoRatio !== naturalRatio) {

            let _totalHeight = (_SELF.state.height * naturalRatio) / videoRatio;
            if(_totalHeight>665){
                _totalHeight -= (163+59); // 142 tab bar bottom, tab bar custom & header height, 59 height of box info
            }
           _SELF.setState({ height: _totalHeight },function(){
                //    console.log('this state :', this.state);
           });
           
        }
        // console.log('this state :', _SELF.state);
        // console.log('setHeight :', (_SELF.state.height * naturalRatio) / videoRatio);

        this._videoLoaded();

    }

    _videoLoaded = () => {
        let _SELF = this;
        setTimeout(function(){
            _SELF.props.updateVideoStatus(_SELF.props.videoId);
        },500)
        
    }

    getMessageAction = () => {
        if(this.props.myVideo)
            return 'Are you sure you want to delete this post?'
        else
            return 'Are you sure you want to report this post?'
    }

    // show action sheet or message popup
    postAction = (_postId) => {
        let _SELF = this;


        if(Helper._isIOS){
            // popup message from bottom with ios native component
            ActionSheetIOS.showActionSheetWithOptions({

                message: this.getMessageAction(),
                options: this.props.myVideo ? BUTTONS_DELETE : BUTTONS_REPORT,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

            },
            (buttonIndex) => {

                console.log(buttonIndex);
                //   this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex==0){
                    this.doAction(_postId)
                }

            });
        }
        else{

            // for android ask with alert message with button

            // Works on both iOS and Android
            Alert.alert(
            this.getMessageAction(),
            // 'My Alert Msg', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: this.props.myVideo ? 'Delete' : 'Report', onPress: () =>  
            
                    this.doAction(_postId)
        
                },
            ], 
            { cancelable: false }
            )
        }

    };

    // delete or report post
    doAction = (_postId) => {
        if(this.props.myVideo)
            this.props.deleteVideo(_postId);
        else
            this.props.reportVideo(_postId);
    }

    goToProfile = (_profile) =>{
        console.log('_profile :',_profile.userObj);
        // console.log('goToSetting: ', item);
        const { navigate, goBack, state } = this.props.navigation;
        navigate('Profile' , {'user_info': _profile.userObj.profile}); 
    }


    _getImageSize = (imgUrl) => {
        // console.log('Before Image Size: ', this.state);
        if(!this.state.initHeight){
            Image.getSize(imgUrl, (srcWidth, srcHeight) => {
                const maxHeight = Dimensions.get('window').height; // or something else
                const maxWidth = Dimensions.get('window').width;

                const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                    this.setState({ width: srcWidth * ratio, height: srcHeight * ratio, initHeight: true }, function(){
                        // console.log('Image Size: ', this.state);
                    });
            }, error => {
                console.log('error:', error);
            });
        }
    }

    _onErrorVideoLoaded = (err) => {
        console.log('Video Loaded Error: ', err);
    }

    componentDidMount() {
        this._getImageSize(this.props.videoThum);
    }

    fullScreen = () => {
        // Later to trigger fullscreen
        this.player.presentFullscreenPlayer();
        let that = this;
        setTimeout(function(){
            that.player.presentFullscreenPlayer();
        },3000)
    }

    render() {
        // console.log('Talent Feed List : ', this.props);

        const _cover = this.props.cover ? { uri: this.props.cover } : require('@assets/job-banner.jpg');
        const _profileCover = this.props.profile_cover ? { uri: this.props.profile_cover } : require('@assets/icon_profile.png');
        // console.log('UserHelper._isMe(this.props.profile_id) :', UserHelper._isMe(this.props.profile_id));
        const _createdAt = Helper._getTimeFromNow(this.props.createdAt);
        // console.log('this.props.loaded : ', this.props.loaded);
        return (

            <View style={[ styles.justFlexContainer]}>  
                {/*<Text>{this.props.media_type}</Text>*/}
                {/* video section */}
                <View style={[styles.middleSection, { height: this.state.height }]}>
                    <TouchableOpacity activeOpacity={.9} onPress={ () => this._togglePlayVideo()} style={[styles.imgContainer, { height: this.state.height }]}> 
                        { !this.props.videoUrl && <Image
                            style={[styles.avatar, styles.mybgCover, {width: 400, height: 300,}]} 
                            source={ _cover }
                        /> }                                                     

                        { !this.props.loaded && <View style={[ styles.justFlexContainer ]}>
                            <CacheableImage
                                resizeMode="contain"
                                style={[styles.myAvatar, styles.mybgcover, { height: this.state.height }]}
                                source={ {uri: this.props.videoThum } }
                            />
                        </View> }   


                        { this.props.loaded && this.props.videoUrl && <Video source={{ uri: this.props.videoUrl }}   // Can be a URL or a local file.                             // Store reference
                            ref={(ref) => {
                                this.player = ref
                            }}  
                            rate={1.0}                              // 0 is paused, 1 is normal.
                            volume={1.0}                            // 0 is muted, 1 is normal.
                            muted={this.props.muted}                            // Mutes the audio entirely.
                            paused={this.props.paused}                          // Pauses playback entirely.
                            resizeMode="contain"                      // Fill the whole screen at aspect ratio.*
                            controls={true}
                            repeat={true}                           // Repeat forever.
                            playInBackground={false}                // Audio continues to play when app entering background.
                            playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                            ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                            progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                            style={[styles.backgroundVideo, { backgroundColor: 'blue',height: this.state.height }]}
                            onLoad={this.setHeight}               // Callback when video loads
                            onError={ this._onErrorVideoLoaded }

                        /> }

                    </TouchableOpacity>
                    

                    {this.props.videoUrl && !this.props.paused && <TouchableOpacity onPress={ () => this._togglePlayVideo(true)} style={[ styles.absoluteBoxBottom, {padding: 10}, this.props.paused && {opacity: 0} ]} activeOpacity={.8}>
                            <Icon 
                                tintColor={"#fff"}
                                name={ !this.props.muted ? 'volume-up' : 'volume-mute'}  
                                style={[ styles.volumnIcon, {fontSize: 20, color: 'white', backgroundColor: 'transparent'} ]}
                            />
                    </TouchableOpacity>}


                    {/* fullscreen mode */}
                    {/*{this.props.videoUrl && !this.props.paused && <TouchableOpacity onPress={ () => this.fullScreen()} style={[ styles.absoluteBoxBottomRight, {padding: 10, right: 20}, this.props.paused && {opacity: 0} ]} activeOpacity={.8}>
                            <Icon 
                                tintColor={"#fff"}
                                name={ 'fullscreen' }  
                                style={[ styles.volumnIcon, {fontSize: 20, color: 'white', backgroundColor: 'transparent'} ]}
                            />
                    </TouchableOpacity>}*/}

                    {this.props.videoUrl && this.props.loaded && !this.props.alreadyLoaded && <TouchableOpacity onPress={ () => this.fullScreen()} style={[ styles.absoluteBoxBottomRight, {padding: 10, right: 0}, this.props.paused && {opacity: 0} ]} activeOpacity={.8}>
                        <ActivityIndicator animating size="small" />
                    </TouchableOpacity>}
                    

                    { this.props.paused && this.props.media_type == "video" && <TouchableOpacity onPress={ () => this._togglePlayVideo()} activeOpacity={.8} style={[styles.iconContainer,{backgroundColor:'rgba(0, 0, 0, 0.2)'}  ]}>
                        
                            <Icon 
                                tintColor={"#fff"}
                                name={'play-circle-filled'}  
                                style={[ styles.myiconUploadAvatar ]}
                            />
                            {/*<Text style={[ {marginTop: 10, backgroundColor: 'transparent', color: 'white',fontSize:15} ]}>
                                See next video 
                            </Text>*/}
                    
                    </TouchableOpacity> }

                </View>
                
                <View style={[styles.cardInfo,{paddingLeft:10,paddingRight:0}]}>
                    <TouchableOpacity onPress={() => this.goToProfile(this.props) } style={[styles.userInfo,{flex:2, justifyContent: 'center'}]}>
                        { !this.props.myVideo && <View style={[styles.avatarContainer]}>

                            <Image 
                                style={[styles.userAvatar,{borderRadius:20}]}
                                source={ _profileCover }
                            />

                        </View> }
                        {/*<View style={[{flexDirection:'column'}]}>*/}
                            { !this.props.myVideo && <View style={[ styles.textInfo ]}>
                                    <Text style={[styles.cardTitle]}>{ this.props.caption }</Text>
                                    <Text style={[styles.cardTitle,{fontSize:12,color:'#B9B9B9'}]}>{ this.props.title }</Text>
                                    
                                </View> }
                            
                            { this.props.myVideo && <View style={[ styles.textInfo ]}>
                                    <Text style={[styles.cardTitle]}>{ this.props.caption }</Text>
                                    <Text style={[styles.cardTitle,{fontSize:12,color:'#B9B9B9'}]}>{ _createdAt }</Text>
                                </View> }
                        {/*</View>*/}
                        
                    </TouchableOpacity>
                    { !UserHelper._isMe(this.props.profile_id) && <View style={[styles.userAction, this.props.myVideo && {justifyContent: 'flex-end'}, {justifyContent: 'flex-end', right: 15}]}>
                        
                        { !this.props.myVideo && <TouchableOpacity
                            onPress={() => this._openMessage() }
                            name={"favorite-border"} 
                            style={[{borderColor:Colors.buttonColor,borderWidth:1,paddingHorizontal:10,paddingVertical:5}]}>
                            <Text style={[{color:Colors.buttonColor,fontWeight:'bold'}]}>Message</Text>
                        </TouchableOpacity> }
                        {/*<TouchableOpacity onPress={() => this.postAction(this.props.videoId) }>
                            <Icon
                                name={"more-vert"}
                                style={[{fontSize:35,opacity:0.5,paddingHorizontal:0}]} />
                        </TouchableOpacity>*/}
                    </View> }
                </View> 
            </View>
            
        );

    }

    
}


var styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...TagsSelect, ...BoxWrap,
    topSection:{
        height:height-113,
        // flex: 1,
        justifyContent:'flex-end',
    },
    middleSection:{
        alignItems: 'stretch',
        // height:300
    },
    bottomSection:{
        backgroundColor:'white',
        height:200
    },
    mywrapper:{
        flex:1,
    },
    mybgcover:{
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    mybgOverlay: {
        flex: 1,
        position: 'absolute',
        bottom:0,
        padding:20 ,
        width:width,
        zIndex: 2,
    },
    iconContainer:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        alignItems:'center',
        justifyContent:'center'
    },
    myiconUploadAvatar:{
        fontSize: 70,
        color: "rgba(255,255,255,0.6)",
        backgroundColor: 'transparent'
    },
    favorite:{
        paddingTop:20,
        flexDirection:'row'
    },
    favoriteNumber:{
        color:'white',
        fontWeight:'bold',
        fontSize:18,
        marginRight:120
    },
    favoriteText:{
        color:'white'
    },
    btnMessage:{
        backgroundColor:Colors.buttonColor,
        paddingVertical:10,
        marginTop:5,
        borderRadius:5,
        paddingLeft:30,
        paddingRight:30,
        borderColor:Colors.buttonColor,
        marginRight:30,
    },
    btnMessageText:{
        color:'white',
        fontSize:20,
        fontWeight:'300'
    },
    btnEditProfile:{
        backgroundColor:'white',
        paddingVertical:10,
        marginTop:5,
        borderRadius:5,
        paddingHorizontal:30
    },
    imgContainer:{
        // flex: 1,
        // opacity:0.5
    },  
    alignSpaceBetween:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    myAvatar:{
        width: Dimensions.get('window').width / 3 - 10 ,
        height: Dimensions.get('window').width / 3 - 10,
        resizeMode: 'contain',
    }
});
