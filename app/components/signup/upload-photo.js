// import React from 'react';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'

import { StyleSheet, Image, ScrollView, Text, View, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';

import ButtonBack from '@components/header/button-back'

import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';
import ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { postMedia, putApi, postApi, getApi } from '@api/request';

import { UserHelper, StorageData, Helper } from '@helper/helper';

let options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const pic = [
    // {
    //     id: 1,
    //     uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/13690662_777391902401412_7742506644238257845_n.jpg?oh=0a5c9f2ec8ab04ffa1533f67b65ca26a&oe=59977320',
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


import _ from 'lodash'


function mapStateToProps(state) {
    // console.log(state)
    return {
        user: state.user,
        // navigation: state.navigation
    }
}

// export default class SignUpInfo extends React.Component {
class UploadPhoto extends Component{

    constructor(props){
        super(props);
        //your codes ....

        // this.selectedTag = this.selectedTag.bind(this);
        this.state = {
            item_selected: '',
            // img: [{'id': 0, 'uri': 'https://talentora-rn.s3.amazonaws.com/resources/clouds/5906addab81611399dadd78b/photos/original/c4e57210-3177-11e7-b8f9-270be727ae37.JPG'}],
            img:[],
            photoUploaded: [],
            idx: 0,
            isFirstPhoto: false,
            featuredPhoto: {}
        }

        // const { navigate, goBack, state } = this.props.navigation;
        // console.log('User Info : ',state.params);
    }

    static navigationOptions = ({ navigation }) => ({
            // title: '',
            headerVisible: true,
            headerLeft: navigation.state.params.noBackButton ? null : (<ButtonBack
                isGoBack={ navigation }
                btnLabel= { UserHelper._getFirstRole().role.name == 'employer' ? 'Welcome to Talentora': 'To the details' }
            />),
        });

    joinUsNow() {
        const { navigate, goBack, state } = this.props.navigation;
        // merge info 
        var signUpInfo = _.extend({
            // talent_category: this.getTalentSelected(),
            featuredPhoto: this.state.featuredPhoto
        }, state.params ? state.params.sign_up_info : {});

        if(this.state.img.length > 0){
            const { navigate, goBack, state } = this.props.navigation;
            navigate('UploadVideo', { sign_up_info: signUpInfo });
        
        }else{
            Alert.alert('Upload at least 1 image to continue.');
        }
    }

    checkActiveTag = (item) => {
        // console.log(item);
        return this.state.item_selected == item.id;
    }

    selectedTag = (item) => {
        // console.log(item);

        console.log('item selected : ', item)
        if(this.state.item_selected != item.id){
            if(this.state.img.length>1){
                this._setPhotoFeature(item.uuid);
            }
        }

        this.setState({
            item_selected: item.id
        })

    }


    // get photo that user already upload
    _getPhoto = () => {
        // GET /api/media?type=photo or /api/media?type=video or  /api/media
        let that = this;
        
        let API_URL = '/api/media?type=photo';
        getApi(API_URL).then((_response) => {

            if(_response.code == 200){
                let _allImg = _response.result;

                console.log('User Photo Already Uploaded : ', _response);
                let _tmp = [];
                _.each(_allImg,function(v,k){
                    _tmp.push({'id': k, 'uri':v.preview_url_link, 'uuid':''});
                })

                that.setState({ 
                    img: _tmp,
                    idx: _tmp.length
                })
            }

        });
    }


    // set feature photo
    _setPhotoFeature = (_id) => {
        let that = this;
        // let API_URL = '/api/users/me/picture';
        let API_URL = '/api/users/me/feature/photo';
        postApi(API_URL,JSON.stringify({
            feature : _id
        })).then((_response) => {
            console.log('success set photo cover response: ', _response);

            that._getFeaturePhotoLink(_response.result)

        });
    }

    // get feature photo link for update profile sendbird
    // on get started complete we will create sendbird account for user
    _getFeaturePhotoLink = (_featuredPhotoResp) => {
        let _allImg = this.state.photoUploaded;

        console.log('_allImg: ', _allImg);

        // feature_photo
        let _featuredPhoto = _.filter(_allImg,function(v,k){
            return v.upload_session_key == _featuredPhotoResp.feature_photo;
        })
        console.log('_featuredPhoto: ' , _featuredPhoto);
        // store photo uploaded 
        this.setState((previousState) => {
            return {
                featuredPhoto: _.head(_featuredPhoto).small_url_link,
            };
        });

        console.log('_getFeaturePhotoLink : ', this.state);
    }

    chooseImage () {
        let that = this;

        console.log('check is first photo : ', that.state.isFirstPhoto);

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
                let source = { uri: response.uri };
                // console.log('The state: ', this.state);
                let arrImg = this.state.img.slice();
                let _id =0;
                if(arrImg.length > 0)
                    _id = arrImg.length;

                let _photoUUID = uuid.v4();

                arrImg.push({'id': _id, 'uri':source.uri, 'uuid':_photoUUID});
                this.setState({
                    img: arrImg,
                    idx: arrImg.length
                })
                
                let data = response.data;
                
                let url = '/api/media/photos/'+ _photoUUID +'/save';

                // console.log('Response: ', response);
                postMedia(url, [
                    // {name: response.fileName , filename: response.fileName, data: data, type: 'image/jpg'},
                    {name: 'image' , filename: response.fileName, data: data, type:'image/foo'}
                ]).then((response) => {
                    console.log('success response: ', response);  

                    let _tmpPhotoUpload = this.state.photoUploaded;
                    _tmpPhotoUpload.push(response.result);

                    // store photo uploaded
                    that.setState((previousState) => {
                        // console.log('previousState.messages : ',previousState.messages); 
                        return {
                           photoUploaded: _tmpPhotoUpload
                        };
                    });

                    console.log('photo uploaded: ', this.state);


                    // Save photo number.
                    const { navigate, goBack, state } = that.props.navigation;
                    let _userInfo = state.params.sign_up_info;
                    _userInfo.profile.photo_uploaded_count++;
                    let _userData =  StorageData._saveUserData('SignUpProcess',JSON.stringify(_userInfo)); 
                    // UserHelper.UserInfo = _result; // assign for tmp user obj for helper
                    _userData.then(function(result){
                        console.log('complete save sign up process 3'); 
                    });

                    // set cover on first upload image 
                    if(!that.state.isFirstPhoto){
                        // let _photoId =  response.result._id;
                        that._setPhotoFeature(_photoUUID);
                        that.setState({
                            isFirstPhoto: true
                        })
                    }
                });
            }
        });
    }


    componentDidMount(){

        // if user not yet completed register
        // get all photo that user upload 
        if(UserHelper._getUserInfo()){
            console.log('get photo');
            // this._getPhoto();
        }
    }

    render() {
        return (    
            <View style={[styles.container,styles.mainScreenBg]} onPress={() =>  dismissKeyboard()}>
                <ScrollView>
                    <View style={[styles.mainPadding]}>

                        <View style={[styles.marginBotMD]}>
                            <Text style={[styles.blackText, styles.btFontSize]}>
                                Upload your photos
                            </Text>

                            <Text style={[styles.grayLessText, styles.marginTopXS]}>
                                Feature your most flattering photo.
                            </Text>

                            <Text style={[ styles.marginTopMD, {color: Colors.primaryColor, textAlign:'right'} ]}>
                                {this.state.img.length || 0}/6 Photos
                            </Text>
                        </View>

                        
                            <View style={[styles.boxWrapContainer,styles.marginTopMD1]}> 

                                {this.state.img.map((item, index) => {
                                    {/*console.log(item);*/}
                                    return (
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[styles.boxWrapItem, styles.boxWrapItemSizeMD, this.checkActiveTag(item) && styles.boxWrapSelected]} 
                                            onPress={ () => this.selectedTag(item) }
                                        >

                                            <Image
                                                style={styles.userAvatarFull}
                                                source={{ uri: item.uri }}
                                            />

                                            {this.checkActiveTag(item) && (
                                            
                                                <View style={[styles.absoluteBox,styles.boxFeatured]}> 
                                                    <View style={[styles.boxWrapStatusContainer,styles.mainHorizontalPaddingSM]}> 
                                                        <Text style={[styles.boxWrapSelectStatus, styles.fontBold]}>
                                                            Featured
                                                        </Text>
                                                    </View>
                                                </View> 

                                            )
                                                
                                            }
                                    
                                        </TouchableOpacity>     
                                    )
                                })}

                                {this.state.idx > 5 ? null : 
                                    <TouchableOpacity 
                                        activeOpacity = {0.9}
                                        style={[ styles.boxWrapItem, styles.boxWrapItemSizeMD, styles.flexCenter ]} 
                                        onPress={this.chooseImage.bind(this)} >

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

                        <TouchableOpacity activeOpacity = {0.8} style={[styles.flatButton,]} onPress={() => this.joinUsNow() }>
                            <Text style={[styles.flatBtnText, styles.btFontSize]}>Continue</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        );
    }
}


var styles = StyleSheet.create({ ...FlatForm, ...Utilities, ...BoxWrap,
    container: {
        flex: 1,
        paddingBottom: 80
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

});

export default connect(mapStateToProps, AuthActions)(UploadPhoto)
