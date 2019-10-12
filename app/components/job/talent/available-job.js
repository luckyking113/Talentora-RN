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
    RefreshControl,
    TextInput,
    FlatList,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';

import BoxWrap from '@styles/components/box-wrap.style';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'
import SearchBox from '@components/ui/search'

import _ from 'lodash'
import { UserHelper, StorageData, Helper } from '@helper/helper';

import ViewPostJob from '@components/job/talent-seeker/view-post-job'     


import { getApi } from '@api/request';

import MatchJobRow from '@components/job/comp/match-job-list'  


function mapStateToProps(state) {
    return {
        // detail: state.detail
    }
}

const _talentType = [{
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
                    }];

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};


class AvailableJob extends Component {

    constructor(props){
        super(props)

        this.state = {
            offset: 0,
            page: 1,
            limit: 4,
            searchText: '',
            loading: false,
            refreshing: false,
            extraData: [{_id : 1}],
            selected: (new Map(): Map<string, boolean>),
            isLoading: false,
            isPullRefresh: false,
            allJobList: [],
            allJobListOrigin: [],
            allJobList1 : [{
                id: 1,
                title: 'Stunt Team For Doctor Strange',
                cover: 'http://www.cheatsheet.com/wp-content/uploads/2016/04/doctor-strange-pic-full.jpg',
                apply_count: 0,
                talent_type: _talentType,
            },{
                id: 2,
                title: 'Spider Man Home Coming Stunt',
                cover: 'https://resizing.flixster.com/U-9mhXMwtyMI-TWXDCuLLAeENLs=/206x305/v1.bTsxMjM1MTUxMztqOzE3MzMyOzEyMDA7NzExOzEwODA',
                apply_count: 4,
                talent_type: _talentType,
            },{
                id: 3,
                title: 'Thor Ragnarok Actor',
                cover: 'http://media.comicbook.com/2017/03/thor-ragnarok-chris-hemsworth-237057.jpg',  
                apply_count: 0,
                talent_type: _talentType,
            },{
                id: 4,
                title: 'Hollywood Movie Actor',
                cover: 'http://static.metacritic.com/images/products/movies/6/77471222784c9946afc3c57c642024a3.jpg',
                apply_count: 4,
                talent_type: _talentType,
            }]
        }


        // console.log('chunk: ', _.chunk(_test, 2));

        // console.log('Check User: ',UserHelper._isUser()); 
        // console.log('Check Employer: ',UserHelper._isEmployer());

    }


    static navigationOptions = ({ navigation }) => ({
            // title: '', 
            // headerVisible: true,
            headerTitle: 'Posted Jobs',
            headerLeft: (<ButtonLeft
                icon="person-add"
                navigate={navigation.navigate}
                to=""
            />),
            headerStyle: defaultHeaderStyle,
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
        });

    componentWillMount(){
        let _SELF = this;
        DeviceEventEmitter.addListener('refreshApplyList', (data) => {
            _SELF._getVailableJob('', true);
        });
    }

    // Fetch detail items
    // Example only options defined
    componentDidMount() {
        this._getVailableJob()

    }

    componentWillUnmount(){
        DeviceEventEmitter.removeListener('refreshApplyList');
    }

    PostAJob = () => {
        const { navigate, goBack } = this.props.navigation;
        navigate('CreatePostJob');
    }

    goToJobDetail = (_jobId) => { 
        // console.log(_jobId, '==', this.props.navigation);
        const { navigate, goBack } = this.props.navigation;
        navigate('JobDetail', {job: _jobId});

    }

    // get vailable job (all match job)
    _getVailableJob = (_search = '', isLoading) => {
        // /api/users/me/jobs
        let _SELF = this;
        let _offset
        // console.log('Paging : ', this.state.page);
        if(this.state.refreshing || isLoading){
            _offset = 0;
            this.setState({ 
                page: 1,
            })
        }
        else
            _offset = (this.state.page - 1) * this.state.limit;

        let API_URL = '/api/users/me/jobs?offset='+ _offset +'&limit='+this.state.limit;

        if(isLoading || this.state.searchText != ''){
            this.setState({ 
                isLoading: true,
            })
            API_URL += '&search=' + this.state.searchText || _search;
        }
        
        // console.log('API_URL : ',API_URL);

        getApi(API_URL).then((_response) => {
            // console.log('All Available Job : ', _response);
            if(_response.code == 200){
                let _allAvailableJob = _response.result;

                if(_allAvailableJob.length>0){

                    // console.log('All Vailable Job : ', _SELF); 

                    // let _offset = (this.state.page - 1) * this.state.limit
                    if(_SELF.state.refreshing || isLoading || _SELF.state.allJobList.length == 0){
                        _SELF.setState({
                            // allJobList: 
                            // allJobList: _.chunk(_allAvailableJob, 2)
                            allJobList: _allAvailableJob,
                            page: _SELF.state.page+1,
                            extraData: [{_id : _SELF.state.extraData++}],
                        })
                    }
                    else{

                        _SELF.setState({
                            allJobList: [..._SELF.state.allJobList, ..._allAvailableJob],
                            page: _SELF.state.page+1
                        })
                    }

                }

                // ($scope.cur_page - 1) * $scope.num_per_page

                // console.log('this ', _.chunk(this.state.allJobList, 2));

            }


            if(isLoading || this.state.searchText != ''){
                _SELF.setState({
                    isLoading: false,
                })
            }

            _SELF.setState({
                isPullRefresh: false,
                refreshing: false,
            })

            setTimeout(function(){
                _SELF.setState({
                    loading: false
                })
            },1500)

        });
    }


    searchNow = (txtSearch, isEmpty=false) => {
        // console.log('Search Text: ', txtSearch);
        if(!isEmpty){
            this.setState({
                searchText: txtSearch
            }, function(){

                this._getVailableJob(txtSearch, true);
                if(txtSearch == ''){
                    this.setState({
                        page: 1
                    })
                }
                
            })
        }
    }

    // test flatlist

    _keyExtractor = (item, index) => index;

    _renderItem = ({item}) => (
        <MatchJobRow
            onPressItem={this.goToDetail}
            selected={!!this.state.selected.get(item.id)}
            allJobList = {item}
            navigation = {this.props.navigation}
        />
    );

    renderHeader = () => {
        return (
            <View style={[ styles.marginBotSM ]}>
                <SearchBox placeholder={'Search'} onSubmit={this.searchNow} isLoading={this.state.isLoading} />
            </View>
        )
    }

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
        <View
            style={{
                paddingVertical: 20,
                /*borderTopWidth: 1,*/
                borderColor: "#CED0CE"
            }}
        >
            <ActivityIndicator animating size="small" />
        </View>
        );
    };

    testRefresh = () => {
        // console.log('testRefresh');
    }

    handleRefresh = () => { 
        // return;
        let that = this;
        // console.log('handleRefresh');
        
        this.setState({
            refreshing: true,
            isPullRefresh: true,
        }, function(){
            that._getVailableJob();
        })
        
    }

    handleLoadMore = () => {
        // return;
        // console.log('handleLoadMore', this.state.loading);
        // return;
        let that = this;

        if(!this.state.loading){

            this.setState({
                loading: true,
            },() => {  
                that._getVailableJob();
            })

        }

    }


    render() {

        return (
            // <View style={[ styles.justFlexContainer, styles.mainScreenBg]}>  

                <FlatList
                    data={_.chunk(this.state.allJobList, 2)}
                    extraData={this.state.extraData}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.handleLoadMore}

                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />

            // </View>
        );
        
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxWrap, ...TagsSelect,

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps)(AvailableJob)
