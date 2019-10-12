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
    RefreshControl
} from 'react-native'


import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';

import BoxWrap from '@styles/components/box-wrap.style';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'
import * as DetailActions from '@actions/detail'

import _ from 'lodash'
import { UserHelper, StorageData, Helper } from '@helper/helper';

import { getApi, postApi } from '@api/request';
import {notification_data} from '@api/response';

function mapStateToProps(state) {
    // console.log('state xxx : ',state);
    return {
        // detail: state.detail
        // navigation: state.navigation,
    }
}

let API_URL = '/api/posts/jobs';
let that;
let _SELF = null;

class PostJobList extends Component {

    constructor(props){
        super(props)

        that = this;
        this.state = { 
            refreshing: false,
            allJobList : [] 
        };
    }


    static navigationOptions = ({ navigation }) => {
        _SELF = navigation;
        console.log('_SELF NAV: ',_SELF);
        return ({
            // title: '', 
            // headerVisible: true,
            headerTitle: 'Posted Jobs',
            headerLeft: (<ButtonLeft
                icon="person-add"
                navigate={navigation.navigate}  
                to=""
            />),
            headerRight: (
                <View style={[styles.flexVerMenu, styles.flexCenter]}>
                    <ButtonRight
                        icon="add"
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        to="CreatePostJob"
                    />
                </View>
            ),
        })};

    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        
    }

    _getAllPostedJob = () => {
        let _SELF = this;
        getApi(API_URL).then((response) => {
            console.log('Response Object Posted Job: ', response);
            if(response.status == "success"){
                this.setState({
                    allJobList : response.result,
                    // defaultCover: 'http://static.metacritic.com/images/products/movies/6/77471222784c9946afc3c57c642024a3.jpg',
                    defaultCover : require('@assets/job-banner.jpg')
                });
                // console.log('The state: ', this.state);
                // console.log('', this.state.allJobList[0].reference_detail[0].s3_url);
                // console.log('', this.state.allJobList[0].reference_detail[0].thumbnail_url_link);
                // console.log('', this.state.allJobList[0].sub_reference_detail.job_applied_count);

                if(notification_data.length > 0){
                    let API_GET_JOB = '/api/posts/' + notification_data[0].data.id;
                    // console.log(API_URL);
                    getApi(API_GET_JOB).then((_response) => {
                        // console.log('GET JOB BY ID : ', _response);
                        if(_response.code == 200){
                            notification_data.splice(0,1);
                            const { navigate, goBack } = this.props.navigation;
                            // navigate('ViewPostJob', {job: _job_info});
                            navigate('ViewPostJob', {job: _response.result});
                        }
                    });
                }
            }

            _SELF.setState({
                refreshing: false
            })

        });
    }

    componentDidMount(){
        this._getAllPostedJob();
    }

    PostAJob = () => {
        // console.log('Navigation ddd: ', this.props);
        const { navigate, goBack } = this.props.navigation;
        navigate('CreatePostJob');
    }

    goToJobDetail = (_job_info) => {  
        // console.log('_SELF : ', _SELF); 
        // console.log('_SELF', this.props.navigation);
        const { navigate, goBack } = this.props.navigation;
        navigate('ViewPostJob', {job: _job_info});
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        }, function(){
            this._getAllPostedJob();
        })
    }

    render() {

        if(_.isEmpty(this.state.allJobList))
            return (
                <View style={[ styles.defaultContainer ]}>

                    <Text style={[styles.blackText, styles.btFontSize]}>
                        You’ve not post any jobs yet.
                    </Text>

                    <Text style={[styles.grayLessText, styles.marginTopXS]}>
                        Post a job in less than 30 seconds.
                    </Text>

                    <TouchableOpacity style={[styles.flatButton, styles.flatButtonSizeSM, styles.marginTopMDD]} onPress={() => this.PostAJob() }>
                        <Text style={[styles.flatBtnText, styles.btFontSize]}>Post a job</Text>
                    </TouchableOpacity>

                </View>
            );
        else{
            return (
                <View style={[ styles.justFlexContainer, styles.mainScreenBg]}>  

                    <ScrollView contentContainerStyle={[ styles.defaultScrollContainer ]}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={ () => this.onRefresh() }
                                progressBackgroundColor="#ffff00"
                            />
                        }>

                        <View style={[ styles.justFlexContainer, styles.marginTopSM]}>

                            {_.chunk(this.state.allJobList, 2).map((itemMain, indexmain) => {
                                return(
                                    <View key={ indexmain }  style={[ styles.boxWrapContainerNew, styles.mainHorizontalPaddingMD ]}>
                                        
                                        {itemMain.map((item, index) => { 
                                            {/*console.log('item : ',item);*/}
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity = {0.9} 
                                                    key={ index }  
                                                    onPress={() => this.goToJobDetail(item)}
                                                    style={[ styles.boxWrapItem, styles.boxWrapItemTwoCol, index==0 && {  marginRight: 10 }]}   
                                                >

                                                    <Image 
                                                        style={[styles.userAvatarFull, {height: 200, width: 200 }]} 
                                                        source={ item.reference_detail[0] ? { uri:item.reference_detail[0].thumbnail_url_link } : this.state.defaultCover}
                                                    />

                                                    <View style={[ styles.fullWidthHeightAbsolute, styles.defaultContainer, styles.infoBottom, styles.mainVerticalPaddingSM, styles.mainHorizontalPaddingMD ]}>

                                                        <Text style={[ {color: 'white', textAlign: 'left'}, styles.fontBold, styles.marginBotXXS ]}>{ item.sub_reference_detail.title }</Text> 
                                                        {/* tag normal */}
                                                        <View style={[ styles.tagContainerNormal, styles.paddingBotNavXS]}>   

                                                            <View style={[ styles.tagsSelectNormal, styles.withBgGray, item.sub_reference_detail.job_applied_count>0 && styles.tagSelectedGreen, styles.tagsSelectAutoWidth, styles.noMargin, styles.marginTopXXS ]}>
                                                                <Text style={[ styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM, item.sub_reference_detail.job_applied_count>0 && styles.tagTitleSelectedGreen ]}>
                                                                    { item.sub_reference_detail.job_applied_count } applicants
                                                                </Text>
                                                                
                                                            </View>      

                                                        </View>
                                                    </View>

                                                </TouchableOpacity>     
                                            )
                                        })}

                                        { itemMain.length==1 && <View style={[ styles.boxWrapItem, styles.boxWrapItemTwoCol, {opacity:0} ]}></View> }

                                    </View>
                                )
                            })}

                        </View>
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxWrap, ...TagsSelect,

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps)(PostJobList)
