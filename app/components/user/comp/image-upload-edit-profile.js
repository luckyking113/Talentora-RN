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

const {width, height} = Dimensions.get('window')


const options = {
    title: 'Image Picker',
    takePhotoButtonTitle: 'Take Image...',
    mediaType: 'image',
};

var BUTTONS = [
  'Delete',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

export default class ImageUploadEditProfile extends Component {

    constructor(props) {
        super(props);

        
        this.state = {
            img:[],
            allImg: [],
            photoUploaded: [],
            idx: 0,
            isFirstPhoto: false,
        }

        that = this;

    }

 

    _getPhoto = () => {
        let that=this;
        let _allImg = UserHelper.UserInfo.photos;

            // console.log('Total image', _allImg);
            let _tmp = [];
            _.each(_allImg,function(v,k){
                // _tmp.push({'id': k, 'uri':v.preview_url_link, 'uuid':v.upload_session_key});
                _tmp.push({'id': k,'type':'image', 'uri':v.thumbnail_url_link, 'uuid':v.upload_session_key, is_featured:v.is_featured});
            })
                let mainTmp=_.chunk(_.cloneDeep(_tmp),3);
                // console.log("main tmp ", mainTmp);

            that.setState({ 
                img: mainTmp,
                allImg: _allImg,
                idx: _tmp.length
            })
            // console.log("final testing photo",that.state);
    } 
    _removePhoto = (_media, _mediaIndex) => {

        let that = this;
        let _mediaInfo = this.state.allImg[_mediaIndex] ? this.state.allImg[_mediaIndex] : null;

        console.log('_mediaInfo : ', _mediaInfo);
        console.log('this.state.videoFromApi : ', this.state.allImg);
        
        if(_mediaInfo && _mediaInfo._id){

            let API_URL = '/api/media/photos/'+ _mediaInfo._id;

            // console.log('this.state.videoFromApi : ', this.state.videoFromApi);
            // console.log('_mediaIndex : ', _mediaIndex, ' === ', '_mediaInfo :', _mediaInfo);

            // return;

            deleteApi(API_URL).then((_response) => {
                console.log('Delete photos : ', _response);
                if(_response.code == 200){

                    var _imageTmp = _.filter(_.cloneDeep(that.state.allImg), function(v,k) {
                        return k != _mediaIndex;
                    });

                    let tmpChunk =[];

                    _.each(_imageTmp,function(v,k){
                        tmpChunk.push({
                            'id': k,
                            'type':'image', 
                            'uri':v.thumbnail_url_link, 
                            'uuid':v.upload_session_key,
                            is_featured:v.is_featured
                        })
                    })

                    // console.log('_videoFromApi :', _videoFromApi);
                    // console.log('_imageTmp :', _imageTmp);

                    // that._updateCoverPhotoProfile(img);

                    let mainTmp=_.chunk(_.cloneDeep(tmpChunk),3);
                    console.log("main tmp ", mainTmp);

                    UserHelper.UserInfo.photos = _imageTmp;
                    // save to final strorage key
                    let _userData =  StorageData._saveUserData('TolenUserData',JSON.stringify(UserHelper.UserInfo)); 
                    // assign for tmp user obj for helper
                    _userData.then(function(result){
                        console.log('complete final save sign up'); 
                    });

                    that.setState({ 
                        img: mainTmp,
                        allImg: _imageTmp,
                        idx: _imageTmp.length
                    })
                    
                }

            });
        }
        else{
            alert('Can not delete this video. Please try again.');
        }
    }
    checkActiveTag = (item) => {
        // console.log("Active Tag",item);
        // return this.state.item_selected == item.id;
        return item.is_featured || false;
    }
    selectedTag = (item) => {

        // console.log('item selected : ', this.state.img)
        if(this.state.allImg.length>1){
            this._setPhotoFeature(item.uuid);
        }

    }    

    _setPhotoFeature = (_id) => {
        let that = this;
        // let API_URL = '/api/users/me/picture';
        let API_URL = '/api/users/me/feature/photo';
        postApi(API_URL,JSON.stringify({
            feature : _id
        })).then((_response) => {
            console.log('success set photo cover response: ', _response);

            that._getFeaturePhotoLink(_response.result)
            
            let _tmpImg = _.cloneDeep(that.state.allImg);
            // console.log("1 final state _tmpImg",_tmpImg);
            
            _.each(_tmpImg, function(v,k){
                // console.log(v.upload_session_key,' == ', _id)
                if(v.upload_session_key == _id){
                    v.is_featured = true;
                    UserHelper.UserInfo.cover = v;
                }
                else{
                    v.is_featured = false;
                }
            })

            UserHelper.UserInfo.photos = _tmpImg || [];
            

            // console.log("final state _tmpImg",_tmpImg);

            let _userData =  StorageData._saveUserData('TolenUserData',JSON.stringify(UserHelper.UserInfo)); 
            // assign for tmp user obj for helper
            _userData.then(function(result){
                // console.log('complete final save sign up'); 
            });


            let _tmpCloneImg = _.cloneDeep(that.state.img);
            _.each(_tmpCloneImg, function(v,k){
                _.each(v,function(vsub,ksub){
                    if(vsub.uuid == _id){
                        vsub.is_featured = true;
                    }
                    else{
                        vsub.is_featured = false;
                    }
                })
                // console.log(v.upload_session_key,' == ', _id)
            })            
            // console.log("final state _tmpCloneImg",_tmpCloneImg);
            that.setState({ 
                img: _tmpCloneImg,
                allImg: _tmpImg,
                idx: _tmpImg.length
            })            


            // trigger to force flatlist re-render
            DeviceEventEmitter.emit('updateProfileInfo',  {})
            

        });
    }
    
    // on get started complete we will create sendbird account for user
    _getFeaturePhotoLink = (_featuredPhotoResp) => {
        // let _allImg = this.state.photoUploaded;

        // console.log('_allImg: ', _allImg);

        // // feature_photo
        // let _featuredPhoto = _.filter(_allImg,function(v,k){
        //     return v.upload_session_key == _featuredPhotoResp.feature_photo;
        // })
        // console.log('_featuredPhoto: ' , _featuredPhoto);
        // // store photo uploaded 
        // this.setState((previousState) => {
        //     return {
        //         featuredPhoto: _.head(_featuredPhoto).thumbnail_url_link,
        //     };
        // });

        // console.log('_getFeaturePhotoLink : ', this.state);
    }

    chooseImage () {
        let that = this;

        // console.log('check is first photo : ', that.state.isFirstPhoto);

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
                let tmpSource = response.uri;
                let source = { uri: response.uri };
                // console.log('The state: ', this.state);
                // let arrImg = this.state.allImg.slice();
                // let arrImg = this.state.img;
                // let _id =0;
                // if(arrImg.length > 0)
                //     _id = arrImg.length;

                let _photoUUID = uuid.v4();

                // arrImg.push({'id': _id,'type':'image', 'uri':source.uri, 'uuid':_photoUUID,is_featured:false});
                // // console.log('chuck : ', _.chunk(arrImg,3));

                // let mainTmp=_.chunk(_.cloneDeep(arrImg),3);
                // console.log("main tmp ", mainTmp);

                // this.setState({
                //     img: mainTmp,
                //     idx: arrImg.length
                // })
                // console.log('state tmp',this.state);
                
                
                let data = response.data;
                 
                let url = '/api/media/photos/'+ _photoUUID +'/save';
                // return;
                // console.log('Response: ', response);
                postMedia(url, [
                    // {name: response.fileName , filename: response.fileName, data: data, type: 'image/jpg'},
                    {name: 'image' , filename: response.fileName, data: data, type:'image/foo'}
                ]).then((response) => {
                    console.log('success response: ', response);  
                    UserHelper.UserInfo.photos.push(response.result);
                    // let _tmp = _.cloneDeep(this.state.allImg);

                    // arrImg.push({'id': _id,'type':'image', 'uri':source.uri, 'uuid':_photoUUID,is_featured:false});
                    
                    let tmpAllImg =[];
                    let allImgClone = _.cloneDeep(UserHelper.UserInfo.photos);
                    _.each(allImgClone,function(v,k){
                        let _tmp = {
                            'id': k,
                            'type':'image', 
                            'uri':v.thumbnail_url_link, 
                            'uuid':v.upload_session_key,
                            is_featured:v.is_featured
                        }
                        if(k == allImgClone.length-1){
                            _tmp = _.extend({
                                tmpSource: tmpSource,
                            }, _tmp)
                        }
                        tmpAllImg.push(_tmp);
                    })

                    // console.log('tmpAllImg: ', tmpAllImg);

                    let _chunkObj=_.chunk(_.cloneDeep(tmpAllImg),3);
                    this.setState({
                        img: _chunkObj,
                        allImg: UserHelper.UserInfo.photos,                        
                        idx: tmpAllImg.length
                    })

                    // console.log('Update Photo to user data : ', UserHelper.UserInfo);

                    StorageData._saveUserData('TolenUserData',JSON.stringify(UserHelper.UserInfo)); 
                    // assign for tmp user obj for helper
                    // console.log("Upload Complete",this.state);
                    // let _tmpPhotoUpload = this.state.photoUploaded;
                    // _tmpPhotoUpload.push(response.result);

                    // // store photo uploaded
                    // that.setState((previousState) => {
                    //     // console.log('previousState.messages : ',previousState.messages); 
                    //     return {
                    //        photoUploaded: _tmpPhotoUpload
                    //     };
                    // });

                    // console.log('photo uploaded: ', this.state);
                    // UserHelper.UserInfo.photos=
                });
            }
        });
    }

    _mediaOption = (_media, _mediaIndex) => {
        let _SELF = this;


        if(Helper._isIOS){
            // popup message from bottom with ios native component
            ActionSheetIOS.showActionSheetWithOptions({

                message: 'Are you sure you want to delete this photo?',
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

            },
            (buttonIndex) => {

                // console.log(buttonIndex);
                //   this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex==0){
                    _SELF._removePhoto(_media, _mediaIndex)
                }

            });
        }
        else{

            // for android ask with alert message with button

            // Works on both iOS and Android
            Alert.alert(
            'Are you sure you want to delete this photo?',
            // 'My Alert Msg', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () =>  _SELF._removePhoto(_mediaId, _mediaIndex) },
            ],
            { cancelable: false }
            )
        }
    }

    componentDidMount(){
        this._getPhoto();
    }

    render() {

        // {console.log("This is the information of the user: ", this.props.userInfo)}
        return ( 
            <View style={[ styles.justFlexContainer ]}>

                {/* image upload */}
                <View style={[styles.marginBotMD]}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.7}}>
                            <Text style={{fontWeight:'bold'}}>
                            Photos
                            </Text>
                        </View>
                        
                        <View style={{flex:0.3}}>
                            <Text style={[ {color: Colors.primaryColor, textAlign:'right'} ]}>
                                {this.state.allImg.length || 0}/10 Photos
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View style={[ {flex:1} ]}> 
                    {this.state.img.map((itemMain, indexMain) => {
                        return (
                            <View key={indexMain} style={[styles.boxWrapContainer,styles.marginTopMD1]}>    
                                {itemMain.map((item, index) => {
                                
                                    {/*console.log("render item value",item);*/}

                                        return (
                                        <View style={[styles.boxWrapItem, styles.myWrap, this.checkActiveTag(item) && styles.boxWrapSelected]} key={ index } >
                                                <TouchableOpacity
                                                    activeOpacity = {0.9}
                                                    style={[{flex:1}]} 
                                                    onPress={ () => this.selectedTag(item) }>

                                                    <Image
                                                        style={styles.userAvatarFull}
                                                        source={{ uri: item.tmpSource || item.uri }}
                                                    />

                                                    {this.checkActiveTag(item) && (
                                                    
                                                        <View style={[styles.absoluteBox,styles.boxFeatured]}> 
                                                            <View style={[styles.boxWrapStatusContainer,styles.mainHorizontalPaddingSM]}> 
                                                                <Text style={[styles.boxWrapSelectStatus, styles.fontBold]}>
                                                                    Featured
                                                                </Text>
                                                            </View>
                                                        </View> 

                                                    )}
                                            
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={[{position:'absolute', right: 5, top: 0}]}
                                                    onPress={ () => this._mediaOption(item, index)}>
                                                    <Icon
                                                        name={"more-horiz"}
                                                        style={[ styles.iconPlus,{fontSize:24,color:'white', backgroundColor: 'transparent'} ]} 
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                })}


                                { itemMain.length==1 &&  
                    
                                        <TouchableOpacity 
                                            
                                            activeOpacity = {0.9}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ]} 
                                            onPress={this.chooseImage.bind(this)} >

                                            <Icon
                                                name="add"
                                                style={[ styles.iconPlus ]} 
                                            />
                                        </TouchableOpacity>

                                }
                                
                                { itemMain.length==1 &&  
                    
                                            <TouchableOpacity 
                                            
                                            activeOpacity = {0}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ,{opacity:0}]} 
                                                >

                                        </TouchableOpacity>

                                }
                                {
                                    itemMain.length==2 &&   
                                
                                        <TouchableOpacity 
                                            
                                            activeOpacity = {0.9}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ]} 
                                            onPress={this.chooseImage.bind(this)} >

                                            <Icon
                                                name="add"
                                                style={[ styles.iconPlus ]} 
                                            />
                                        </TouchableOpacity>
                                        
                                    

                                }
                                    

                            </View>
                            )
                        })}


                        {  ((this.state.img.length>0 && this.state.img[this.state.img.length-1].length==3) || this.state.img.length==0) && <View style={[styles.boxWrapContainer,styles.marginTopMD1]}>
                                        <TouchableOpacity 
                                            
                                            activeOpacity = {0.9}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ]} 
                                            onPress={this.chooseImage.bind(this)} >

                                            <Icon
                                                name="add"
                                                style={[ styles.iconPlus ]} 
                                            />
                                        </TouchableOpacity>
                                            <TouchableOpacity 
                                            
                                            activeOpacity = {0}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ,{opacity:0}]} 
                                                >

                                        </TouchableOpacity>
                                            <TouchableOpacity 
                                            
                                            activeOpacity = {0}
                                            style={[ styles.boxWrapItem, styles.myWrap, styles.flexCenter ,{opacity:0}]} 
                                                >

                                        </TouchableOpacity>
                        </View>}

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