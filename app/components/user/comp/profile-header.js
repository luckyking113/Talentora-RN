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
    InteractionManager,
    FlatList,
    Modal,
    ActivityIndicator
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

import {UserHelper, StorageData, Helper, ChatHelper} from '@helper/helper';
import SendBird from 'sendbird';
import _ from 'lodash'

import Carousel from 'react-native-looped-carousel';

import moment from 'moment'

import CacheableImage from 'react-native-cacheable-image';

const {width, height} = Dimensions.get('window')

const sb = null;

export default class ProfileHeader extends Component {

    constructor(props) {
        super(props);

        sb = SendBird.getInstance();
        var a = moment([moment().year(), 0]);
        var b = moment([UserHelper.UserInfo.profile.attributes.date_of_birth.value, 0]);
        // console.log('Years Old ',a.diff(b, 'years')); 
        // console.log(moment("01/01/1992", "MM/DD/YYYY").month(0).from(moment().month(0),true));

        let _profileAttr = UserHelper.UserInfo.profile;
        // console.log('testindsfkjsdlf : ',UserHelper.UserInfo.profile);
        if(!UserHelper._isMe(this.props.userInfo._id)){
            _profileAttr = this.props.userInfo;
        }

        // console.log('_Profile Attr:', _profileAttr);

        this.state = {
            modalPhotoGallery: false,
            moreInfo: [
                {
                    label: 'Country',
                    value: _profileAttr.country || 'N/A',
                },
                {
                    label: 'Language',
                    value: _profileAttr.attributes.language ? this._chkEmptyVal(_profileAttr.attributes.language.value) : 'N/A',
                },
                {
                    label: 'Gender',
                    value: _profileAttr.attributes.gender ? Helper._getGenderLabel(_profileAttr.attributes.gender.value) : 'N/A',
                },
                {
                    label: 'Age',
                    // value: moment("01/01/"+_profileAttr.attributes.date_of_birth.value, "MM/DD/YYYY").month(0).from(moment().month(0),true),
                    value: a.diff(b, 'years'),
                },
                {
                    label: 'Ethnicity',
                    value: _profileAttr.attributes.ethnicity ? this._chkEmptyVal(_profileAttr.attributes.ethnicity.value) : 'N/A',
                },
                {
                    label: 'Height',
                    value: _profileAttr.attributes.height ? this._chkEmptyVal(_profileAttr.attributes.height.value) : 'N/A',
                },
                {
                    label: 'Weight',
                    value: _profileAttr.attributes.weight ? this._chkEmptyVal(_profileAttr.attributes.weight.value) : 'N/A',
                },
                {
                    label: 'Hair color',
                    value: _profileAttr.attributes.hair_color ? this._chkEmptyVal(_profileAttr.attributes.hair_color.value) : 'N/A',
                },
                {
                    label: 'Eye color',
                    value: _profileAttr.attributes.eye_color ? this._chkEmptyVal(_profileAttr.attributes.eye_color.value) : 'N/A',
                },
            ],
            // isHasPhotos: (UserHelper._isMe(this.props.userInfo.user) ? UserHelper.UserInfo.photos>0 : this.props.userInfo.photos),
            isHasPhotos: true,
        }

        // console.log('Sort by featured photo : ',_.sortBy(this.props.userInfo.photos, function(v){ return !v.is_featured; }));

        // console.log('Profile Header : ', this.props.userInfo);

    }


    _chkEmptyVal = (_val) => {
        return !_.isEmpty(_val) ? _val : 'N/A';
    }

    _createChannel(_item) {

        const {navigate, goBack, state} = this.props.navigation;

        let name = '';
        let _channelURL = '';
        let userIds = [this.props.id];
        let coverFile = this.props.cover;
        let data = '{}';
        let customType = '';

        sb
            .GroupChannel
            .createChannelWithUserIds(userIds, true, name, coverFile, data, customType, function (createdChannel, error) {

                console.log('Create Channed 1-to-1 : ', channel);

                if (error) {
                    console.error(error);
                    return;
                }
            });
    }

    directToMessage = () => {
        // Alert.alert('Bring me to message page'); console.log('Talent Feed List : ',
        // this.props);
        let userObj = {
            id: this.props.userInfo.user._id,
            cover: Helper._getCover(this.props.userInfo),
            full_name: Helper._getUserFullName(this.props.userInfo.attributes)
        }
        let _SELF = this;
         
        // let sb = SendBird.getInstance();
        ChatHelper._sendBirdLogin(function(sb){ 
            // console.log('.... sb : ', sb);
            ChatHelper._createChannel(sb, userObj, null, function (_channel) {
                // console.log('This is props: ', _SELF.props);

                const {navigate, goBack, state} = _SELF.props.navigation;

                let _tmpChatData = {
                    name: userObj.full_name,
                    channelUrl: _channel.url,
                    chat_id: userObj.id
                }

                let _chkExistInChannel = _.head(ChatHelper._checkExistUserInChennel(userObj.id));

                // console.log('_chkExistInChannel: ', _chkExistInChannel);

                let _paramObj = {
                    message_data: _tmpChatData
                };

                // if(_.isEmpty(_chkExistInChannel)){     // navigate('Message',{message_data:
                // _tmpChatData, resetScreen : 'RootScreen'});     // _paramObj = _.extend({
                // //     routeIndex : 0,     //     resetScreen : 'MessageList',     //
                // routeKey : 'MessageList'     // },_paramObj); }
                navigate('Message', _paramObj);
            })
        })

    }

    directToEdit = () => {
        const { navigate, goBack, state } = this.props.navigation;
        navigate('EditProfile');
    }

    // filter for carousel to show featured photo first
    getPhotosSortByFeature = () => {

        let _photos = UserHelper._isMe(this.props.userInfo.user) ? UserHelper.UserInfo.photos : this.props.userInfo.photos
        // console.log('getPhotosSortByFeature', _photos)
        let _tmp = _.sortBy(_photos, function(v){ return !v.is_featured; });
        // console.log('getPhotosSortByFeature : ',_tmp);
        return _tmp;
    }

    render() {

        // {console.log("This is the information of the user: ", this.props.userInfo)}

        let _cover = '';

        // if me get my cover
        if(UserHelper._isMe(this.props.userInfo.user)){
            _cover = UserHelper._getCover('preview_url_link') ? { uri: UserHelper._getCover('preview_url_link') } : require('@assets/img-default.jpg');
            // _cover = require('@assets/img-default.jpg');
            // console.log(' Cover 1', UserHelper._getCover('preview_url_link'));
        }
        else{
            // view other profile user
            _cover = { uri : this.props.userInfo.photo.preview_url_link };
            // console.log(' Cover 2', _cover);
        }

        // console.log(' Cover ', _cover);

        return (

                <View style={[styles.topSection]}>

                    <Modal
                    animationType={"fade"}
                    //animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalPhotoGallery}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                    >

                        <TouchableOpacity   
                            style={[ {zIndex: 99,position: 'absolute', top: 0, right:0, backgroundColor: 'transparent'} ]}
                            onPress={()=> { this.setState({
                                modalPhotoGallery: false 
                            }) }}
                            activeOpacity={.8} >
                            <Icon name={'close'} style={styles.closeButton} />
                        </TouchableOpacity>

                        <Carousel
                            autoplay={false}
                            bullets={this.state.isHasPhotos && this.getPhotosSortByFeature().length > 1 && true}
                            style={{
                            width: width,
                            height: height,
                            flex: 1,
                            backgroundColor: 'black'
                        }}>
                            {this.state.isHasPhotos ? this.getPhotosSortByFeature()
                                .map((item, index) => {
                                    return (
                                        <CacheableImage 
                                            key={index}
                                            style={{
                                                flex: 1,
                                                height: height,
                                                width: width,
                                                resizeMode: 'contain',
                                                alignSelf: 'center'
                                            }}
                                            source={{ uri: item.preview_url_link }}
                                        />
                                    );
                                })
                                :
                            <Image
                                style={{
                                height: 300,
                                width: width,
                                alignSelf: 'center'
                            }}
                            source={require('@assets/img-default.jpg')}/>
                            }
                        </Carousel>
                    </Modal>

                    <CacheableImage 
                        //checkNetwork={false} 
                        //networkAvailable={true}
                        resizeMode="cover"
                        style={[styles.avatar, styles.mybgcover, styles.fullWidthHeightAbsolute]}
                        source={_cover}
                        />
                    

                        {/*<CacheableImage
                            style={[styles.avatar, styles.mybgcover]}
                            source={require('@assets/img-default.jpg')}
                            defaultSource={_cover}
                        >
                        </CacheableImage>*/}

                    

                    {/*<Image
                        style={[styles.avatar, styles.mybgcover]}
                        source={_cover}>*/}
                        
                        {this.state.isHasPhotos && <TouchableOpacity
                            activeOpacity={1}
                            onPress={()=> { this.setState({
                                modalPhotoGallery: true 
                            }) }}
                            style={{
                            width: 35,
                            padding: 5,
                            margin: 15,
                            backgroundColor: 'rgb(215, 188, 177)',
                            borderRadius: 5,
                            alignSelf: 'flex-end',
                            zIndex:1,
                            position: 'absolute',
                            top: 0,
                            right: 15
                        }}>
                            <Text
                                style={{
                                color: 'rgb(74, 74, 74)',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                1/{ this.getPhotosSortByFeature().length }
                            </Text>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity
                            onPress={()=> { this.setState({
                                modalPhotoGallery: true
                            }) }}
                            style={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            position: 'absolute',
                            backgroundColor: 'rgba(52, 52, 52, 0.4)'
                        }}></TouchableOpacity>

                        {/* basic info */}
                        <View style={[styles.mybgOverlay, styles.bgTransparent]} 
                            onPress={() => {
                                {/*this.setState({
                                    modalPhotoGallery: true 
                                })*/}
                            }}>

                            {/* name & talent type */}
                            <View style={[ {paddingHorizontal: 20} ]}>
                                <Text
                                    style={[{
                                        fontSize: 35,
                                        color: 'white'
                                    }
                                ]}>{Helper._getUserFullName(this.props.userInfo.attributes)}</Text>
                                <View style={[styles.tagContainerNormal, styles.paddingBotNavXS]}>
                                    {UserHelper
                                        ._getKind(this.props.userInfo.attributes.kind ? this.props.userInfo.attributes.kind.value : 'N/A')
                                        .map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.9}
                                                    key={index}
                                                    style={[styles.tagsSelectNormal, styles.withBgGray, styles.tagsSelectAutoWidth, styles.noMargin, styles.marginTopXXS]}>
                                                    <Text style={[styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM]}>
                                                        {Helper._capitalizeText(item.display_name)}
                                                    </Text>

                                                </TouchableOpacity>
                                            )
                                        })}

                                </View>
                            </View>

                            {/* more info */}
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={[ {backgroundColor: 'transparent', paddingHorizontal: 18} ]}>

                                <View style={[ styles.boxWrapContainer, styles.boxWrapContainerNoWrap, {flexDirection: 'row', marginTop: 15, }]}>

                                    { this.state.moreInfo.map((item, index) =>{
                                        {/*console.log(item);*/}
                                        return(
                                            <View key={index} style={[ styles.boxWrapItem, styles.boxWrapItemNoWrap, styles.moreInfoBox, {height: null} ]}>
                                                <Text style={[ styles.moreInfoBoxLabel ]}>{item.label}</Text>
                                                <Text style={[ styles.moreInfoBoxValue,  ]}>{item.value}</Text>
                                            </View>
                                        )

                                    })}
                                </View>

                            </ScrollView>


                            {/* favorite & reviews */}
                            {/*<View style={[styles.favorite]}>
                                <View>
                                    <Text style={[styles.favoriteNumber]}>0</Text>
                                    <Text style={[styles.favoriteText]}>Favorites</Text>
                                </View>
                                <View>
                                    <Text style={[styles.favoriteNumber]}>0</Text>
                                    <Text style={[styles.favoriteText]}>Reviews</Text>
                                </View>
                            </View>*/}

                            {/* profile action */}
                            <View
                                style={[
                                styles.txtContainer1, {
                                    flex: 1,
                                    flexDirection: 'row',
                                    paddingHorizontal: 20,
                                }
                            ]}>
                                {/*<TouchableOpacity style={[styles.btnMessage, styles.marginTopMD]}>
                                    <Text style={[styles.flatBtnText, styles.btFontSize]}>8 Reviews</Text>
                                </TouchableOpacity>*/}

                                {/*{console.log('User Id: ', this.props.userInfo._id , ', and ', UserHelper.UserInfo.profile._id)}*/}

                                {!Helper._isOtherUser(this.props.userInfo._id)
                                    ? <TouchableOpacity
                                            style={[styles.btnEditProfile, styles.marginTopMD]}
                                            onPress=
                                            {() => this.directToMessage() }>
                                            <Text
                                                style={[
                                                styles.flatBtnText,
                                                styles.btFontSize, {
                                                    color: Colors.buttonColor
                                                }
                                            ]}>Message</Text>
                                        </TouchableOpacity>

                                    : <TouchableOpacity
                                        activeOpacity={.8}
                                        style={[styles.btnEditProfile, styles.marginTopMD]}
                                        onPress=
                                        {() => this.directToEdit() }>
                                        <Text
                                            style={[
                                            styles.flatBtnText,
                                            styles.btFontSize, {
                                                color: Colors.buttonColor
                                            }
                                        ]}>Edit Profile</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                    {/*</Image>*/}
                    {/*</CacheableImage>*/}
                </View>
     
        );

    }
}
var styles = StyleSheet.create({
    ...Styles,
    ...Utilities,
    ...FlatForm,
    ...TagsSelect,
    ...BoxWrap,

    moreInfoBoxContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start', 
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',    
    },

    topSection: {
        height: height - 113,
        flex: 1,
        justifyContent: 'flex-end'
    },
    middleSection: {
        alignItems: 'stretch',
        height: 300

    },
    bottomSection: {
        backgroundColor: 'white',
        height: 200
    },
    mywrapper: {
        flex: 1
    },
    mybgcover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    mybgOverlay: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        // padding: 20,
        paddingVertical: 20,
        width: width,
        zIndex: 2
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    myiconUploadAvatar: {
        fontSize: 70,
        color: "rgba(255,255,255,0.6)",
        backgroundColor: 'transparent'
    },
    favorite: {
        paddingTop: 20,
        flexDirection: 'row'
    },
    favoriteNumber: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 120
    },
    favoriteText: {
        color: 'white'
    },
    btnMessage: {
        backgroundColor: Colors.buttonColor,
        paddingVertical: 10,
        // marginTop: 5, 
        borderRadius: 5,
        paddingLeft: 30,
        paddingRight: 30,
        borderColor: Colors.buttonColor,
        marginRight: 20
    },
    btnMessageText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '300'
    },
    btnEditProfile: {
        backgroundColor: 'white',
        paddingVertical: 10,
        marginTop: 5,
        borderRadius: 5,
        paddingHorizontal: 30
    },
    imgContainer: {
        flex: 1,
        opacity: 0.5
    },
    alignSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeButton: {
        color: 'white',
        padding: 8,
        textAlign: 'center',
        margin: 10,
        marginTop: 30,
        alignSelf: 'flex-end',
        fontSize:20
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreInfoBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 0,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,.4)',
        marginHorizontal: 2,
        maxWidth: 200,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    moreInfoBoxLabel: {
        color: 'white'
    },
    moreInfoBoxValue: {
        marginTop: 5,
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    }
});