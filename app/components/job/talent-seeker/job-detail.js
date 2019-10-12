import React, { Component } from 'react'
import { connect } from 'react-redux'
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
    Modal,
    Dimensions,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style'; 

import ButtonRight from '@components/header/button-right'
import ButtonTextRight from '@components/header/button-text-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'

import _ from 'lodash'
import { UserHelper, StorageData, Helper } from '@helper/helper';

import { postApi } from '@api/request';

import { NavigationActions } from 'react-navigation';

import { transparentHeaderStyle, defaultHeaderStyle, defaultHeaderWithShadowStyle } from '@styles/components/transparentHeader.style';
import CacheableImage from 'react-native-cacheable-image';

const { width, height } = Dimensions.get('window')
function mapStateToProps(state) {
    // console.log('wow',state)
    return {
        user: state.user,
        user_info: [],
        // navigation: state.navigation
    }
}

const _SELF = null;

class JobDetail extends Component {
    constructor(props){
        super(props);

        const { navigate, goBack, state } = this.props.navigation;

        this.state={
            jobInfo: state.params.job,
            type: [
                {
                    name: 'Actor',
                    value: 'actor',
                },    
                {
                    name: 'Dancer',
                    value: 'dancer',
                },                                 
                {
                    name: 'Musician',
                    value: 'musician',
                },
                {
                    name: 'Singer',
                    value: 'singer',
                },
            ]
        }

        console.log('Apply Constructor', this.state.jobInfo.post);

        // const { navigate, goBack, state } = this.props.navigation;
        // console.log('Job Detail Obj : ', state.params);

    }
    static navigationOptions = ({ navigation }) => ({
        // title: '', 
        headerVisible: false,
        headerTitle: navigation.state.params.job.title || _.head(navigation.state.params.job.job_detail).sub_reference_detail.title,
        headerLeft: (<ButtonBack
                isGoBack={ navigation }
                btnLabel= ""
            />),            
        headerStyle: defaultHeaderWithShadowStyle,  
        headerRight1: (<ButtonTextRight  
                callBack={ navigation.state.params }
                btnLabel= "Apply"
            />),
        headerRight: !navigation.state.params.view_only  ? (

             <View style={[styles.flexVerMenu, styles.flexCenter]}>
                {/*<Text style={[styles.txt]}>Save</Text>*/}
                 {/*{ console.log('_SELF dddd :', UserHelper.UserInfo) }*/}
                
                <TouchableOpacity 
                    style={[{ marginRight: 15 }]}
                    onPress={ () => {
                        console.log('_SELF', _SELF);
                        _SELF._applyJob();
                    }}>
                
                    {/*{ navigation.state.params && navigation.state.params.isLoadingOnHeader ?*/}

                    { navigation.state.params && navigation.state.params.isLoadingOnHeader ?
                        <ActivityIndicator
                            animating={true}
                            style={[  ]}
                            size="small"
                            color="gray"
                        />
                        :

                        <View>
                            { navigation.state.params && navigation.state.params.applied ? <Icon name="done" style={[ styles.doneIcon ]} /> : <Text style={[styles.txtRightHeader]}> Apply </Text> }
                        </View>
                    }
                </TouchableOpacity>
                {/*<Text style={[styles.txt]}>{ navigation.state.params && navigation.state.params.applied ? 'Edit' : 'Save' }</Text>*/}
            </View>


        ) : navigation.state.params && navigation.state.params.can_remove?<View style={[styles.flexVerMenu, styles.flexCenter]}>
                <TouchableOpacity 
                    style={[ {marginRight: 5} , navigation.state.params && navigation.state.params.applied && { marginRight: 15 }]}
                    onPress={ () => {
                        console.log('_SELF', _SELF);
                        _SELF._prepareRemoveJob();
                    }}>
                    { navigation.state.params && navigation.state.params.isLoadingOnHeader ?
                        <ActivityIndicator
                            animating={true}
                            style={[  ]}
                            size="small"
                            color="gray"
                        />
                        :
                        <View>
                            { navigation.state.params && navigation.state.params.applied ? <Icon name="done" style={[ styles.doneIcon ]} /> : <Text style={[styles.txtRightHeader]}> <Icon name="delete" style={[ styles.doneIcon, {color: 'gray', fontSize: 24} ]} /> </Text> }
                        </View>
                    }
                </TouchableOpacity>
                {/*<Text style={[styles.txt]}>{ navigation.state.params && navigation.state.params.applied ? 'Edit' : 'Save' }</Text>*/}
            </View>:null
    });

    _applyJob = () => {

        const { navigate, goBack, state, setParams, dispatch } = this.props.navigation;
        // return;

        setParams({ isLoadingOnHeader: true });

        // console.log('Apply Now');


        // setTimeout(function(v,k){
        //     setParams({ applied: true, isLoadingOnHeader: false });
        // },2000)
    
        let API_URL = '/api/jobs/'+ this.state.jobInfo.post +'/apply';
        postApi(API_URL).then((response) => {
            // console.log('Apply Job: ', response);
            if(response.code == 200){
                // console.log('Applied Completed: ', response);
                setParams({ applied: true, isLoadingOnHeader: false });
                const resetAction = NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'JobList'}], key: 'JobList' })
                dispatch(resetAction);

            }
        });
    }

    _prepareRemoveJob = () => [
        Alert.alert(
            'Are you sure you want to remove this applied job?',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this._removeJob()},
            ],
        )
    ]

    _removeJob = () => {

        const { navigate, goBack, state, setParams, dispatch } = this.props.navigation;
        setParams({ isLoadingOnHeader: true });    
        let API_URL = '/api/jobs/'+ this.state.jobInfo.job_detail[0]._id +'/withdraw';
        postApi(API_URL).then((response) => {
            if(response.code == 200){
                DeviceEventEmitter.emit('refreshApplyList');
                setParams({ applied: false, isLoadingOnHeader: false });
                goBack();
            }
        });

    }

    _getKinds = (item) => {
        if(item.criteria)
            return item.criteria.type;
        else
            return [];
    }

    _getCover = () => {
        let item = this.state.jobInfo;
        const _objDetail = _.head(item.job_detail);
        return _.head(_objDetail.reference_detail) ? {uri: _.head(_objDetail.reference_detail).thumbnail_url_link} : require('@assets/banner-default.jpg');
    }

    componentDidMount() {
        _SELF = this; 
    }

    viewProfile = (_item) => {
        // candidate
        // console.log('This is user info: ', _item); return;
        const { navigate, goBack } = this.props.navigation;
        navigate('Profile', { 'user_info': _item });
    }

    render(){
        const { navigate, goBack, state } = this.props.navigation;
        return(
            <ScrollView  removeClippedSubviews={false} style={[ styles.wrapper ]}>

                <View style={[styles.topSection]}>

                    <CacheableImage 

                        onLoadEnd={(e) => { console.log('OnLoadEnd.',e); }}
                        onLoadStart={(e) => { console.log('OnLoadStart.',e); }}
                        
                        resizeMode="cover"

                        style={[styles.avatar, styles.mybgcover]}
                        
                        source={ this._getCover() } >
  
                            {/*<Image
                                style={[styles.avatar, styles.mybgcover]} 
                                source={ this._getCover() }  
                            />*/}

                    </CacheableImage>
                </View>
                <View style={[styles.middleSection,{padding:20}]}>
                    <View style={[styles.titleContainer,{paddingBottom:20}]}>
                        <Text>Title of job</Text>
                        <Text style={[{fontSize:18,fontWeight:'bold'}]}>{ this.state.jobInfo.title || _.head(this.state.jobInfo.job_detail).sub_reference_detail.title }</Text>
                    </View>
                    <View style={[{paddingBottom:20}]}>
                        <Text>Talent type</Text>
                        <View style={[ styles.tagContainerNormal, styles.paddingBotNavXS ]}>   

                                {this._getKinds(this.state.jobInfo).map((item, index) => {
                                    return (
                                        <TouchableOpacity 
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[ styles.tagsSelectNormal, styles.withBgPinkOld, styles.tagsSelectAutoWidth, styles.noMargin, styles.marginTopXXS ]}
                                        >
                                            <Text style={[ styles.tagTitleSelected, styles.btFontSize, styles.tagTitleSizeSM ]}>
                                                { Helper._capitalizeText(item) }
                                            </Text>
                                            
                                        </TouchableOpacity>     
                                    )
                                })}

                        </View>
                    </View>
                    <View style={[{flexDirection:'row',paddingVertical:20}]}>
                        <View style={[{flex:1}]}>
                            <Text>Gender</Text>
                            <Text style={[{fontSize:18,fontWeight:'bold'}]}>{ Helper._getGenderJob(this.state.jobInfo.criteria.gender) }</Text>
                        </View>
                        <View style={[{flex:1}]}> 
                            <Text>Age</Text>
                            <Text style={[{fontSize:18,fontWeight:'bold'}]}>{ this.state.jobInfo.criteria.min_age + '-' + this.state.jobInfo.criteria.max_age }</Text>
                        </View>
                        <View style={[{flex:2}]}>
                            <Text>Location</Text>
                            <Text style={[{fontSize:18,fontWeight:'bold'}]}>Singapore</Text> 
                        </View>                                                
                    </View>
                    <View style={[{paddingVertical:30}]}>
                        <Text>Contact person</Text>
                        {/*{console.log('User Info: ', this.state.jobInfo.owner_profile)}*/}
                        <TouchableOpacity activeOpacity = {0.8} onPress={() => this.viewProfile(this.state.jobInfo.owner_profile) }>
                            <View style={[styles.userInfo, {marginTop: 15}]}>
                                <View style={[ styles.avatarContainer ]}>
                                    <Image
                                        style={[ styles.userAvatar ]}
                                        source={{ uri: Helper._getCover(this.state.jobInfo.owner_profile) }} 
                                    />
                                </View>  
                                {/*<View style={[{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'red'}]}>*/}
                                    <Text style={[styles.userName,{fontWeight:'bold'}]}>{ Helper._getUserFullName(this.state.jobInfo) }</Text>
                                {/*</View>*/}
                                
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({  ...Styles, ...Utilities, ...FlatForm, ...TagsSelect, ...BoxWrap,
     topSection:{
        height:250,
        justifyContent:'flex-end', 
    },
    mybgcover:{
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    txtRightHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    doneIcon:{
        color: Colors.secondaryCol,
        fontSize: 30,
    }
});    
export default connect(mapStateToProps, DetailActions)(JobDetail)