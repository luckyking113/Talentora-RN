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
    RefreshControl,
    DeviceEventEmitter
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

import _ from 'lodash'
import { UserHelper, StorageData, Helper } from '@helper/helper';

import ApplyRowItem from '@components/job/comp/apply-row-item';

import { getApi } from '@api/request';


function mapStateToProps(state) {
    return {
        // detail: state.detail
    }
}

const _talentType = [
    {
        id: '1',
        category: 'actor',
        display_name: 'Actor'
    },
    {
        id: '3',
        category: 'musician',
        display_name: 'Musician'
    },
    {
        id: '2',
        category: 'singer',
        display_name: 'Singer'
    },
    {
        id: '4',
        category: 'dancer',
        display_name: 'Dancer'
    },
    {
        id: '5',
        category: 'model',
        display_name: 'Model'
    },
    {
        id: '6',
        category: 'host',
        display_name: 'Host'
    }
];

class AppliedJob extends Component {

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        let _tmpData = [{
                id: 2,
                title: 'Spider Man Home Coming Stunt',
                cover: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/p160x160/13010906_1094604257262920_5206116280130189740_n.jpg?oh=7696d1cab8ea39104f2d4e14ddf3d2f3&oe=59B68DDC',
                apply_count: 4,
                createdAt: 1495470850293,
                talent_type: _talentType,
            },{
                id: 1,
                title: 'Stunt Team For Doctor Strange',
                cover: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/p160x160/13010906_1094604257262920_5206116280130189740_n.jpg?oh=7696d1cab8ea39104f2d4e14ddf3d2f3&oe=59B68DDC',
                apply_count: 0,
                createdAt: 1495470850293,
                talent_type: _talentType,
            },{
                id: 3,
                title: 'Thor Ragnarok Actor',
                cover: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/p160x160/13010906_1094604257262920_5206116280130189740_n.jpg?oh=7696d1cab8ea39104f2d4e14ddf3d2f3&oe=59B68DDC',  
                apply_count: 0,
                createdAt: 1495470850293,
                talent_type: _talentType,
            },{
                id: 4,
                title: 'Hollywood Movie Actor',
                cover: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/p160x160/13010906_1094604257262920_5206116280130189740_n.jpg?oh=7696d1cab8ea39104f2d4e14ddf3d2f3&oe=59B68DDC',
                apply_count: 4,
                createdAt: 1495470850293,
                talent_type: _talentType,
            }]

        this.state = {
            isPullRefresh: false,
            dataSource: ds.cloneWithRows([]),
            applyList: []
        }


        // console.log('chunk: ', _.chunk(_test, 2));

        console.log('Applied Job Info : ',this.props);

    }


    startApplying = () => {
        // const { navigate, goBack } = this.props.navigation;
        // navigate('CreatePostJob');
        console.log('this.props: ', this.props);
        this.props.triggerTab(0);
    }

    // goToJobDetail = (_jobId) => { 
    //     console.log("This is job: ", _jobId); return;
    //     const { navigate, goBack } = this.props.navigation;
    //     navigate('ViewPostJob', {job: _jobId});
    // }

    _onRowPress = (_row) => {
        console.log('_onRowPress', _row);
    }

    goToJobDetail = (_job) => { 
        // console.log(_jobId, '==', this.props.navigation);
        const { navigate, goBack } = this.props.navigation;
        navigate('JobDetail', {job: _job, view_only: true, can_remove:true}); 

    }

    // get vailable job (all match job)
    _getAppliedJob = () => {
        // /api/users/me/jobs
        let _SELF = this;
        let API_URL = '/api/users/me/jobs/apply';
        // console.log(API_URL);
        getApi(API_URL).then((_response) => {
            // console.log('User Video Already Uploaded : ', _response);
            if(_response.code == 200){
                let _allAppliedJob = _response.result;

                console.log('All Applied Job : ', _allAppliedJob); 

                // _SELF.setState({
                //     allJobList: _allAvailableJob
                // })

                // console.log('this ', _SELF.state);

                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                _SELF.setState({
                    dataSource: ds.cloneWithRows(_allAppliedJob),
                    applyList: _allAppliedJob,
                })

                // console.log(' Applied Job: ', _SELF);

            }

            _SELF.setState({
                isPullRefresh: false,
            })

        });
    }

    componentWillMount(){
        let _SELF = this;
        DeviceEventEmitter.addListener('refreshApplyList', (data) => {
            _SELF.onRefresh();
        });
    }

    componentDidMount() {
        console.log('hey xxxxxxxx');
        this._getAppliedJob();

    }

    componentWillUnmount(){
        DeviceEventEmitter.removeListener('refreshApplyList');
    }

    onRefresh = () => {
        this.setState({
            isPullRefresh: true,
        })
        this._getAppliedJob();
    }

    render() {

        if(_.isEmpty(this.state.applyList))
            return (
                
                <View style={[ styles.defaultContainer, styles.mainScreenBg ]}>

                    <Text style={[styles.blackText, styles.btFontSize]}>
                        You’ve not apply for any jobs yet.
                    </Text>

                    {/*<Text style={[styles.grayLessText, styles.marginTopXS]}>
                        Post a job in less than 30 seconds.
                    </Text>*/}

                    <TouchableOpacity style={[styles.flatButton, styles.flatButtonSizeSM, styles.marginTopMDD, styles.mainHorizontalPaddingSM]} onPress={() => this.startApplying() }>
                        <Text style={[styles.flatBtnText, styles.btFontSize]}>Start applying</Text>
                    </TouchableOpacity>

                </View>
            );
        else{
            return (
                <View style={[ styles.justFlexContainer, styles.mainScreenBg]}>  

                    {/*<ScrollView contentContainerStyle={[ styles.defaultScrollContainer ]}>*/}

                        <View style={[ styles.justFlexContainer]}>

                            <ListView
                                refreshControl={  
                                <RefreshControl 
                                    refreshing={this.state.isPullRefresh}
                                    onRefresh={ () => this.onRefresh() }
                                    progressBackgroundColor="#ffff00"
                                />
                                }
                                dataSource={this.state.dataSource} 
                                renderFooter={this.renderFooter}
                                onEndReachedThreshold={10}
                                onEndReached={() => { 
                                    {/*console.log("fired"); // keeps firing*/}
                                }}
                                renderRow={(rowData) => <ApplyRowItem { ...rowData } rowPress={ this.goToJobDetail } /> }
                                enableEmptySections={true}
                                automaticallyAdjustContentInsets={false}
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps="always" 
                                showsVerticalScrollIndicator={false}
                                removeClippedSubviews={false}
                            />

                        </View>
                        
                    {/*</ScrollView>*/}

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxWrap, ...TagsSelect,

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps)(AppliedJob)
