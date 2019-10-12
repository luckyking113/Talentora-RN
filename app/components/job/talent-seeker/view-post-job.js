import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar,
    ListView,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native'

import { NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@themes/index';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import FlatForm from '@styles/components/flat-form.style';
import BoxWrap from '@styles/components/box-wrap.style';
import BoxAvatarCover from '@styles/components/box-avatar-cover.style';

import JobApplyRow from '@components/lists/job/job-apply-row';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'
import * as DetailActions from '@actions/detail'
import { getApi, postApi, putApi } from '@api/request';

import { transparentHeaderStyle, defaultHeaderStyle } from '@styles/components/transparentHeader.style';

import _ from 'lodash'

import { UserHelper, StorageData, Helper } from '@helper/helper';


function mapStateToProps(state) {
    return {
        // detail: state.detail
    }
}

class ViewJobList extends Component { 

    constructor(props){
        super(props);
        //your codes ....

        const { navigate, goBack, state } = this.props.navigation;
        // console.log('The item: ', state.params.job);
        // ._id, .reference_detail[0].thumbnail_url_link, sub_reference_detail.criteria .'gender , max_age,
        // min_age , type[] , title, description, status, 

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        let _jobInfo = state.params.job;

        // console.log('Job Object: ', _jobInfo);

        _jobInfo = _.extend({
            cover: _.head(_jobInfo.reference_detail)
        },_jobInfo);

        this.state = {
            // cover: _.head(state.params.job.reference_detail),
            refreshing: false,
            jobInfo: _jobInfo,
            recommendTalent: [],
            appliedDataSource: ds.cloneWithRows([]),
            appliedData: [],
            isUpdatingState: false,
            default_cover: require('@assets/job-banner.jpg'),
            options: {
                    isLoadingTail: false,
                    isShowReviewApp : false,
                    applicationCount : 0,
                    dataSource: ds.cloneWithRows([])
            }
        }

        // console.log('this state :', state.params.job);
    }

    static navigationOptions = ({ navigation }) => ({
            // title: '', 
            // headerVisible: true,
            headerTitle: navigation.state.params.job.sub_reference_detail.title,
            headerLeft: (<ButtonBack
				// colBtn={ {color: Colors.primaryColDark }}
                isGoBack={ navigation }
                // btnLabel= "Back" 
            />),
            headerStyle: defaultHeaderStyle,  
            headerRight: (
                
                <View style={[styles.flexVerMenu, styles.flexCenter]}>

                    <ButtonRight
                        //icon="add"
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        nav={navigation}
                        to="CreatePostJob"
                        btnLabel= "Edit"
                    />

                    {/*<ButtonRight
                        icon="menu"
                        navigate={navigation.navigate}
                        to="Settings"
                    />*/}

                </View>
            ),
    });

    // get recommended tablent if no talent apply yet
    _getRecommendedTalen = () => {
        let API_URL = '';
        let _SELF = this;

        const { navigate, goBack, state } = this.props.navigation;
        
        if(state.params.job.sub_reference_detail.job_applied_count > 0){
            console.log('Job ID: ', this.props.navigation.state.params.job._id);
            API_URL = '/api/jobs/' + this.props.navigation.state.params.job._id + '/apply?v1';
            getApi(API_URL).then((response) => {
                console.log('Job Applied: ', response);
                if(response.code == 200){
                    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        appliedData: response.result,
                        appliedDataSource: ds.cloneWithRows(response.result),

                    })
                }
                _SELF.setState({
                    refreshing: false
                })
            });

        }else{
            // console.log('The job id: ', this.props.navigation.state.params);
            API_URL = '/api/jobs/' + this.props.navigation.state.params.job._id + '/candidate';
            getApi(API_URL).then((response) => {
                console.log('Job Candidates (Recommend Applicants): ', response);
                if(response.code == 200){
                    _SELF.setState({
                        recommendTalent: response.result,
                    })
                }
                _SELF.setState({
                    refreshing: false
                })
            });
        }
    }


    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        
    }

    openReviewApp = () => {
        var _options = _.extend({}, this.state.options);
        _options.isShowReviewApp = true;
        _options.applicationCount = 6;
        this.setState({options: _options});
    }

    // go to create new job
    PostAJob = () => {
        const { navigate, goBack } = this.props.navigation;
        navigate('CreatePostJob');
    }

    // view profile 
    viewProfile = (_item) => {
        // candidate
        // console.log('This is user info: ', _item); return;
        const { navigate, goBack } = this.props.navigation;
        navigate('Profile',{ user_info: _item });
    }


    // remove after click on unsuitable & start refresh application list
    _updateApplicationList = (_type,applicationId, updateStatus) => {
        let _tmpData = _.cloneDeep(this.state.appliedData);
        // let _tmpApp = [];
        if(_type == 'short_listed'){
            _.each(_tmpData,function(v,k){
                if(v._id == applicationId){
                    v.status = updateStatus;
                }
            })
        }
        else{
            _tmpData = _.filter(_tmpData,function(v,k){
                return v._id != applicationId; 
            })
        }

        console.log('_tmpData : ', _tmpData);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            appliedData: _tmpData,
            appliedDataSource: ds.cloneWithRows(_tmpData),
        })
    }

    // update status application when user click on short-list or unsuitable
    _updateStatusApplication = (_type, applicationItem) => {
        let _SELF = this; 
        console.log('Type: ', _type, ' -===- Application: ', applicationItem);
        if(_type && !this.isUpdatingState){
            this.setState({
                isUpdatingState: true
            })  
            let API_URL = '/api/jobs/' + this.props.navigation.state.params.job._id + '/status';
            putApi(API_URL,
                JSON.stringify({
                    "status": _type,
                    "application_id": applicationItem._id
                })
            ).then((response) => {
                console.log('_updateStatusApplication: ', response);
                if(response.code == 200){

                    _SELF._updateApplicationList(_type, applicationItem._id, response.result.status, );

                }
                this.setState({
                    isUpdatingState: false
                })
            });
        }
    }

    // mark application as short list
    markAsShortList = (_item) => {
        let _SELF = this;
        Alert.alert(
            'Are you sure you want to accept this application in short list?',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => _SELF._updateStatusApplication('short_listed', _item) },
            ],
        )
        
    }

    // mark application as unsuitable
    markAsUnsuitable = (_item) => {
        let _SELF = this;
        Alert.alert(
            'Are you sure you want to remove this application?',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => _SELF._updateStatusApplication('no_longer_consideration', _item) },
            ],
        )      
    }

    onEndReached = () => {

        console.log(this.state.options);

        // We're already fetching
        if (this.state.options.isLoadingTail) {
            return;
        }
        var _options = _.extend({}, this.state.options);
        _options.isLoadingTail = true;
        this.setState({
            options: _options,
        });

        setTimeout(function(){

            _options.isLoadingTail = false;
            this.setState({
                options: _options,
            });

        }, 3000)

        // this.fetchPets();
    }

    componentDidMount(){
        const { navigate, goBack, state } = this.props.navigation;
        
        if(state.params.job.apply_count>0){
            this.openReviewApp();
        }

        this._getRecommendedTalen();

    }

    // close listing job api
    _closeJob = () => {

        let _SELF = this;
        
        // console.log('Close Job');
        let API_URL = '/api/jobs/'+ this.state.jobInfo._id +'/cancel';
        postApi(API_URL).then((response) => {
            console.log('Cancel Job Post: ', response);
            if(response.code == 200){
                
                const { navigate, goBack, dispatch } = _SELF.props.navigation;
                
                Alert.alert(
                    'This job has been deleted.',
                    '',
                    [
                        {text: 'OK', onPress: () => {
                            const resetAction = NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'JobList'}], key: 'JobList' })
                            dispatch(resetAction);
                        }},
                    ],
                )

            }
        });
    }

    // when user click on close listing job
    _onClosePress = () =>{
        // Works on both iOS and Android
        Alert.alert(
            'Are you sure you want to close this job?',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this._closeJob()},
            ],
        )
    }

    renderFooter = () => {
        // if (!this.state.options.isLoadingTail) {
        //     return <View style={styles.scrollSpinner} />;
        // }
        if (this.state.options.isLoadingTail) {
            return <ActivityIndicator style={styles.scrollSpinner} />;
        }
    }


    _getCover = (item) => {
        return Helper._getCover(item) ?  {uri: Helper._getCover(item,'thumbnail_url_link')} : require('@assets/icon_profile.png');
    }

    _onPullRefresh = () => {
        this.setState({
            refreshing: true
        }, function(){

            this._getRecommendedTalen();

        })
    }

    render() {

        const { navigate, goBack, state } = this.props.navigation;

        // console.log(this.state);
        return (
                
            <View style={[ styles.justFlexContainer, styles.mainScreenBg ,  {paddingBottom: 50}]} onPress={() =>  dismissKeyboard()}>
                <ScrollView contentContainerStyle={[ styles.defaultContainer1, {paddingBottom: 20} ]}
                
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={ () => this._onPullRefresh() }
                            progressBackgroundColor="#ffff00"
                        />
                    }>
                    {/* cover & avatar */}

                    <View style={[styles.boxAvatarCoverContainer]}> 
                        {/*{console.log('This Job info: ', this.state.jobInfo)}*/}
                        <Image style={[styles.boxCover]} source={this.state.jobInfo.cover ? { uri:  this.state.jobInfo.cover.preview_url_link } : this.state.default_cover }/>
                        <View style={[ styles.fullWidthHeightAbsolute ]}>

                            <Image
                                style={[ styles.boxAvatar, styles.whiteBorder ]} 
                                source={this.state.jobInfo.cover ? { uri: this.state.jobInfo.cover.preview_url_link } : this.state.default_cover }  
                            />
                            <Text style={[ {color: 'white', marginTop: 8, fontSize: 16}, styles.fontBold ]}>{ this.state.jobInfo.sub_reference_detail.title }</Text>
                            <Text style={{color: 'white', marginTop: 2}}>{ this.state.jobInfo.sub_reference_detail.job_applied_count } Application</Text>

                        </View>
                    </View>

                    {/* recomment talent */}
                    {/*{console.log('The applied count: ', this.state.jobInfo.sub_reference_detail.job_applied_count)}*/}
                    { this.state.jobInfo.sub_reference_detail.job_applied_count <= 0 && (

                        <View style={[ styles.marginTopMD, styles.mainHorizontalPadding ]}>

                            <Text style={[ styles.grayLessText ]} onPress={ () => this.openReviewApp() }>Recommended talents</Text>

                            <View style={[ styles.boxWrapContainer, styles.marginTopXS ]}> 
                                
                                {this.state.recommendTalent.map((item, index) => {
                                    {/*console.log('This is recommended applicants[' + index +']: ', item);*/}
                                    return (
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[ styles.boxWrapItem, styles.boxWrapItemSizeSM, styles.marginBotXXS, styles.grayLessBg ]} 
                                            onPress = {() => this.viewProfile(item)}
                                        >

                                            <Image
                                                style={[styles.userAvatarFull, styles.bgCover]}
                                                source={ this._getCover(item) }
                                            />

                                        </TouchableOpacity>     
                                    )
                                })}

                            </View>

                        </View>

                    )}
                    {/*<Text>{this.state.jobInfo.sub_reference_detail.job_applied_count}</Text>*/}
                    {/* if have someone apply to this job  */}
                    { this.state.jobInfo.sub_reference_detail.job_applied_count>0 && ( 

                        <View style={[ styles.marginTopMD ]}>

                            <Text style={[ styles.grayLessText, styles.mainHorizontalPadding ]} onPress={ () => {} }>Review applicants ({ this.state.jobInfo.sub_reference_detail.job_applied_count })</Text>

                            <View style={[ styles.listContainer, styles.marginTopSM ]}>
                                <ListView
                                    dataSource={this.state.appliedDataSource} 
                                    renderFooter={this.renderFooter}
                                    onEndReachedThreshold={10}
                                    onEndReached={() => { 
                                        {/*console.log("fired"); // keeps firing*/}
                                    }}
                                    renderRow={(rowData) => <JobApplyRow {...rowData} func_1={this.markAsShortList} func_2={this.markAsUnsuitable} viewProfileFunc={this.viewProfile} /> }
                                    
                                    automaticallyAdjustContentInsets={false} 
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="always"
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}

                                />
                            </View>

                        </View>

                    )}

                </ScrollView>

                
                <View style={styles.absoluteBoxBottom}>
                    <View style={[styles.txtContainer, {flex: 1}]}> 
 
                        <TouchableOpacity activeOpacity = {0.8} style={[styles.flatButton, styles.noRadius, styles.grayBg, styles.noBorder]} onPress={() => this._onClosePress() }>
                            <Text style={[styles.flatBtnText, styles.btFontSize]}>CLOSE LISTING</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxAvatarCover, ...BoxWrap,

  scrollSpinner: {
    marginVertical: 20,
  },

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps, DetailActions)(ViewJobList)
