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
    DeviceEventEmitter,
    ActivityIndicator,
    FlatList
} from 'react-native'

import {view_profile_category} from '@api/response'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconCustom } from '@components/ui/icon-custom';

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
// import ImagePicker from 'react-native-image-picker';

import ImagePickerCrop from 'react-native-image-crop-picker';


import uuid from 'react-native-uuid';
import { postMedia, postApi, putApi, getApi, deleteApi } from '@api/request';
import RNFetchBlob from 'react-native-fetch-blob';
import Video from 'react-native-video';

import { CachedImage, ImageCache, CustomCachedImage } from "react-native-img-cache";
import ImageProgress from 'react-native-image-progress';
import {ProgressBar, ProgressCircle} from 'react-native-progress';

import PhotoBoxItem from '@components/user/comp/photo-box-item';

import { UserHelper, StorageData, Helper, GoogleAnalyticsHelper } from '@helper/helper';

import _ from 'lodash'

import moment from 'moment'

const {width, height} = Dimensions.get('window');

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: false,
  };
  

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
            selected: (new Map(): Map<string, boolean>),
            data: [],
            extraData: [{_id : 1}],
        }

        that = this;

    }

    _generateBox = (_boxs) => {
        
        _boxs = _.filter(_boxs,function(v,k){
            return v.boxType == 'photo';
        })

        let _missingBox = 5 - _boxs.length

        // if(_boxs.length>=3)

        if(_missingBox>=0){
            _boxs.push({
                boxType: 'add_more',
                is_featured: false,                
                created_date: new Date('01/01/1970').getTime()
            })
        }

        for(let _i =0; _i<=_missingBox; _i++){
            _boxs.push({
                boxType: null,
                is_featured: false,
                created_date: new Date('01/01/1969').getTime()
            })
        }

        // _boxs = _.sortBy(_boxs, [function(v,k) {

        //         return v.created_date; 

        // }]);

        return _boxs;

    }

    _getPhoto = () => {   
        let that = this;
        // let _allImg = UserHelper.UserInfo.photos;

        let API_URL = '/api/media?type=photo';
        getApi(API_URL).then((_response) => {
            console.log('Get All Photo : ', _response);

            if(_response.code == 200){
                let _allImg = _response.result;

                // console.log('Total image', _allImg);  
                let _tmp = [];
                _.each(_allImg,function(v,k){
                    // _tmp.push({'id': k, 'uri':v.preview_url_link, 'uuid':v.upload_session_key});
                    _tmp.push({
                        'id': k,
                        'type':'image', 
                        'boxType': 'photo', 
                        'uri':v.thumbnail_url_link,
                        created_date: new Date().getTime(),                                            
                        'uuid':v.upload_session_key, 
                        is_featured:v.is_featured
                    });
                })
                // let mainTmp=_.chunk(_.cloneDeep(_tmp),3);
                // console.log("main tmp ", mainTmp);


                that.setState({ 
                    // img: mainTmp,
                    allImg: _allImg,
                    idx: _tmp.length,
                    data: that._generateBox(_tmp),
                })  
                // console.log("final testing photo",that.state);
            }
        });
    } 

    _removePhoto = (_media, _mediaIndex) => {

        let that = this;
        // let _mediaInfo = null;

        // _mediaInfo = this.state.allImg[_media.id] ? this.state.allImg[_media.id] : null;

        if(this.state.allImg.length == 1){
            alert('You cannot delete featured image. Please upload another image as feature first.');
            return;
        }

        console.log('_media : ', _media);
        
        let _mediaInfo = null;
        // _mediaInfo = this.state.img[_mediaIndex] ? this.state.img[_mediaIndex] : null;
        _mediaInfo = _.filter(this.state.allImg,function(v,k){
            if(v.uuid)
                return v.uuid == _media.uuid;
            else
                return v.upload_session_key == _media.uuid
        });

        if(_mediaInfo.length>0){
            _mediaInfo = _.head(_mediaInfo);
        }


        console.log('_mediaInfo : ', _mediaInfo);
        // return;
        // if(_mediaInfo.is_featured && this.state.allImg.length > 1){
        //     alert('You cannot delete featured image. Please select another image as feature first.');
        //     return;
        // }else if(_mediaInfo.is_featured){
        //     alert('You cannot delete featured image. Please upload another image as feature first.')
        //     return;
        // }
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
  
                        if(v.uuid)
                            return v.uuid != _media.uuid;
                        else
                            return v.upload_session_key != _media.uuid
                    });

                    let tmpChunk =[];

                    _.each(_imageTmp,function(v,k){
                        tmpChunk.push({
                            'id': k,
                            'type':'image', 
                            'uri':v.thumbnail_url_link, 
                            'uuid':v.upload_session_key,
                            'boxType': 'photo',
                            is_featured:v.is_featured
                        })
                    })

                    // console.log('_videoFromApi :', _videoFromApi);
                    // console.log('_imageTmp :', _imageTmp);

                    // that._updateCoverPhotoProfile(img);

                    // let mainTmp=_.chunk(_.cloneDeep(tmpChunk),3);
                    // console.log("main tmp ", mainTmp);

                    UserHelper.UserInfo.photos = _imageTmp;
                    // save to final strorage key
                    let _userData =  StorageData._saveUserData('TolenUserData',JSON.stringify(UserHelper.UserInfo)); 
                    // assign for tmp user obj for helper
                    _userData.then(function(result){
                        console.log('complete final save sign up'); 
                    });

                    that.setState({ 
                        //img: mainTmp,
                        allImg: _imageTmp,
                        idx: _imageTmp.length,
                        data: [],                    
                        extraData: [{_id : that.state.extraData[0]._id++}]                        
                    }, function(){


                        that.setState({
                            data: that._generateBox(tmpChunk),                    
                            extraData: [{_id : that.state.extraData[0]._id++}]  
                        }, function(){
                            if(_mediaInfo.is_featured){
                                if(that.state.data.length>0){
    
                                    that._setPhotoFeature(that.state.data[0].uuid || that.state.data[0].upload_session_key);
    
                                }
                            }
                        });
                        
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
        if(this.state.allImg.length>0){
            this._setPhotoFeature(item.uuid);
        }

    }    

    _setPhotoFeature = (_id) => {
        console.log('_id :', _id);
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
                v.type = 'image';
                v.boxType = 'photo';
                v.id = k;
                v.uri = v.thumbnail_url_link;
                v.uuid = v.upload_session_key;

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
            console.log("final state _tmpCloneImg",_tmpImg);
            that.setState({ 
                img: _tmpCloneImg,
                allImg: _tmpImg,
                idx: _tmpImg.length,
                data: [],
                extraData: [{_id : that.state.extraData[0]._id++}]
            }, function(){

                that.setState({
                    data: that._generateBox(_tmpImg),                    
                    extraData: [{_id : that.state.extraData[0]._id++}]  
                });

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

    imageCropUpload = (imgData = null, _UUID = '') => {
        let that = this;
        if(imgData){

            this.setState({
                uploading: true
            })

            let tmpSource = ( Helper._isIOS() ? 'file://' : '' ) + imgData.path;
            let source = { uri: tmpSource };

            let _photoUUID = _UUID;
            let data = imgData.data;
             
            let url = '/api/media/photos/'+ _photoUUID +'/save';
            // return;
            console.log('tmpSource: ', tmpSource);
            // console.log('Image data: ', data);

            postMedia(url, [
                // {name: response.fileName , filename: response.fileName, data: data, type: 'image/jpg'},
                {name: 'image' , filename: imgData.filename, data: data, type:'image/jpg'}
            ]).then((response) => {
                console.log('success response: ', response);
                if(response.code == 200){
                    const _photoId = response.result.upload_session_key;
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
                            'boxType': 'photo',
                            created_date: new Date().getTime(),                                                
                            tmpSource: _photoId == v.upload_session_key ? tmpSource :  null,
                            is_featured:v.is_featured
                        }
                        // if(k == allImgClone.length-1){
                        //     _tmp = _.extend({
                        //         tmpSource: tmpSource,
                        //     }, _tmp)
                        // }
                        tmpAllImg.push(_tmp);
                    })

                    console.log('tmpAllImg: ', tmpAllImg);

                    // let _chunkObj=_.chunk(_.cloneDeep(tmpAllImg),3);
                    this.setState({
                        //img: _chunkObj,
                        allImg: UserHelper.UserInfo.photos,                        
                        idx: tmpAllImg.length,
                        data: [],
                        extraData: [{_id : that.state.extraData[0]._id++}]
                    }, function(){

                        console.log('after upload: ', that.state.data);

                        that.setState({
                            data: that._generateBox(tmpAllImg),                    
                            extraData: [{_id : that.state.extraData[0]._id++}]  
                        });

                        DeviceEventEmitter.emit('UpdateHeader');

                    })

                    // console.log('Update Photo to user data : ', UserHelper.UserInfo);
                    StorageData._saveUserData('TolenUserData',JSON.stringify(UserHelper.UserInfo)); 
                }

                this.setState({
                    uploading: false
                }) 

            });
        }
    }
    
    chooseImage = () => {
        let that = this;

        if(this.state.uploading)
            return;

        // console.log('check is first photo : ', that.state.isFirstPhoto);

        ImagePickerCrop.openPicker({
            mediaType: 'photo',
            // cropping: true,
            includeBase64: true,
          }).then(image => {
            console.log('Image B4 Crop: ', image);
            const _sizeCrop = Helper._getSizeCrop(image);
            // console.log('_sizeCrop: ', _sizeCrop);
            ImagePickerCrop.openCropper({
                ..._sizeCrop,
                path: image.path,
                includeBase64: true,
            }).then(imageAfterScrop => {

                let _imageData = imageAfterScrop;
                let defUUID = uuid.v4();
                _imageData.filename = image.filename || defUUID;
                console.log('imageAfterScrop : ',imageAfterScrop);

                this.imageCropUpload(_imageData, defUUID);
                
            }).catch(e => {
                // alert(e);
                console.log('error : ', e);
            });

            
        }).catch(e => {
            // alert(e);
            console.log('error : ', e);
        });

    }

    _mediaOption = (_media) => {
        let _SELF = this;
        _mediaIndex = _media.id;
        if(Helper._isIOS()){
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
        }else{
            // for android ask with alert message with button
            // Works on both iOS and Android
            Alert.alert(
            'Are you sure you want to delete this photo?',
            '', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () =>  _SELF._removePhoto(_media, _mediaIndex) },
            ],
            { cancelable: false }
            )
        }
    }

    componentDidMount(){
        
    }

    UNSAFE_componentWillMount(){
        this._getPhoto();
    }

    componentWillUnmount(){
        
        // clear tmp for crop & upload image
        ImagePickerCrop.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            console.log('cannot removed all tmp images from tmp directory');
        });
        
    }

    _keyExtractor = (item, index) => index;
    
    _renderItem = ({item}) => {
        return (  
            <PhotoBoxItem { ...item } uploading={this.state.uploading} chooseImage={ this.chooseImage } rowPress={ this._onRowPress } checkActiveTag={this.checkActiveTag} selectedTag={this.selectedTag} _mediaOption={this._mediaOption} />
    )};

    render(){
        return(

            <View style={[ styles.justFlexContainer, styles.mainScreenBg]}>  
            
                {/* image upload */}
                <View style={[styles.marginBotMD, {paddingHorizontal: 10}]}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.7}}>
                            <Text style={{fontWeight:'bold'}}>
                            Photos
                            </Text>
                        </View>
                        
                        <View style={{flex:0.3}}>
                            <Text style={[ {color: Colors.primaryColor, textAlign:'right'} ]}>
                                {this.state.allImg.length || 0}/6 Photos
                            </Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    style={{flex: 1}}
                    extraData={this.state.extraData}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    ref={ref => this.listRef = ref}
                    //ListHeaderComponent={this.renderHeader}
                    horizontal={false}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ margin: 5 }}
                    //ListFooterComponent={this.renderFooter}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    viewabilityConfig={VIEWABILITY_CONFIG}

                    //onViewableItemsChanged = {this.onViewableItemsChanged}

                    //refreshing={this.state.refreshing}
                    //onRefresh={this.handleRefresh}
                    //onEndReachedThreshold={0.5}
                    //onEndReached={this.handleLoadMore}
                />

            </View>

        )
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