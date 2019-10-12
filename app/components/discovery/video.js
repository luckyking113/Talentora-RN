import React, { Component } from 'react'
import { connect } from 'react-redux'
// import * as DetailActions from '@actions/detail'
import {
    View,
    // Text,
    // TextInput,
    StyleSheet,
    // Button,
    // ScrollView,
    // TouchableOpacity,
    // TouchableWithoutFeedback,
    // Image,
    // StatusBar,
    // Alert,
    // Picker,
    // Platform,
    // Modal,
    Dimensions,
    // InteractionManager,
    FlatList,
    ActivityIndicator
} from 'react-native'

// import { view_profile_category } from '@api/response'

// import Video from 'react-native-video';


// import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style'; 

// import ButtonRight from '@components/header/button-right'
// import ButtonTextRight from '@components/header/button-text-right'
import ButtonLeft from '@components/header/button-left'
// import ButtonBack from '@components/header/button-back'

// import uuid from 'react-native-uuid';

import TalentFeedItem from '@components/lists/feed/talent-feed-list'
import ProfileHeader from '@components/user/comp/profile-header'

import { UserHelper, StorageData, Helper } from '@helper/helper';
import _ from 'lodash'

import { getApi } from '@api/request';

import SearchBox from '@components/ui/search'


function mapStateToProps(state) {
    // console.log('wow',state)
    return {
        user: state.user,
    }
}
const { width, height } = Dimensions.get('window')


let _SELF = null;


const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: false,
};

class Videos extends React.PureComponent {

    constructor(props){
        super(props);

        this.state={
            offset: 0,
            page: 1,
            limit: 4,
            searchText: '',
            isLoading: false,
            refreshing: false,
            selected: (new Map(): Map<string, boolean>),
            data: [],
            extraData: [{_id : 1}],
        }

        _SELF = this;

    }
    
    
    static navigationOptions = ({ navigation }) => ({
        // title: '', 
        headerVisible: false, 
        headerTitle: 'Discovery',
        headerLeft: (<ButtonLeft
            icon="person-add"
            navigate={navigation.navigate}
            to="ChatModal"
        />),
    }); 

    goToSetting = () => {
        // console.log('goToSetting', this.props);
        const { navigate, goBack, state } = this.props.navigation;
        navigate('Setting'); 
    }

    componentDidMount() {
        let _SELF = this;

        this._getVideoList();

    }

    _getVideoList = (_isLoadMore = false, txtSearch='', isSearchLoading=false) => {
        // 
        let _SELF = this; 

        let _offset= (this.state.page - 1) * this.state.limit;
        
        if(isSearchLoading){
            this.setState({ 
                page: 1,
            })
            _offset = 0;
        }


        // let API_URL = '/api/contacts/search/people?limit=20&sort=-created_at?v2'; 
        let API_URL = '/api/media/public?type=video&is_featured=true&offset='+ _offset +'&limit='+ this.state.limit +'&sort=-created_at'; 


        if(isSearchLoading && this.state.searchText != ''){
            this.setState({ 
                isLoading: true,
                extraData: [{_id : this.state.extraData[0]._id++}] // change this value to re-render header or footer 
            })
            API_URL += '&search=' + this.state.searchText || txtSearch;
        }

        // GET /api/media/public?type=video|photo 
        console.log(API_URL);
        getApi(API_URL).then((_response) => {

            console.log('All Video : ', _response);

            if(_response.status == 'success'){

                // let _allAvailableJob = _response.result;

                // console.log('All Vailable Job : ', _allAvailableJob); 

                let _result = _response.result; 

                // let _goodData = _.filter(_result,function(v,k){
                //     return v.attributes.kind && v.attributes.kind.value!='';
                // });

                if(_result.length>0){

                    let _goodData = [];
                    _goodData = _result;

                    _.each(_goodData, function(v,k){
                        v.paused = true;
                        v.muted = false;
                        v.loaded = false;
                        v.alreadyLoaded = false;
                    })


                    // for(i= 0; i<600; i++ ){
                    //     var _tmp = _.cloneDeep(_result[0]);
                    //     _tmp.user._id = _tmp.user._id + '-panhna-' + i;
                    //     _goodData.push(_tmp);
                    // }

                    console.log('_isLoadMore', _goodData);
                    if(_isLoadMore){
                        _SELF.setState({
                            data: [..._SELF.state.data, ..._goodData],
                            page: _SELF.state.page+1,
                        }, () => {

                        })
                    }
                    else{
                        _SELF.setState({
                            data: _goodData,
                            extraData: [{_id : this.state.extraData[0]._id++}],
                            page: _SELF.state.page+1,
                        }, () => {

                        })
                    }

                }
                // console.log('this ', _SELF.state);

            }

            // console.log('isSearchLoading', isSearchLoading);
            if(isSearchLoading || this.state.searchText != ''){

                _SELF.setState({ 
                    isLoading: false,
                    loading: false,
                    extraData: [{_id : _SELF.state.extraData[0]._id++}] // change this value to re-render header or footer 
                    
                })

            }

            _SELF.setState({
                refreshing: false,
                loading: false,
                extraData: [{_id : _SELF.state.extraData[0]._id++}] // change this value to re-render header or footer 
            })
            console.log('_SELF', _SELF.state);

            // _SELF.listRef.scrollToOffset({offset: 50})
            
        });
    }

    // test = () => {
    //     this.props.navigation.setParams({ handleFunc: this.goToSetting });
    // }

    // test flatlist
    _keyExtractor = (item, index) => index;

    _onPressItem = (id) => {
        // updater functions are preferred for transactional updates
        console.log('ID: ', id);
        // console.log('this.state: ', this.state);
        // this.setState((state) => {
        // // copy the map rather than modifying state.
        //     const selected = new Map(state.selected);
        //     console.log('selected :',selected.get(id));
        //     // selected.set(id, selected.get(id)); // toggle
        //     selected.set(id,'lool'); // toggle
        //     console.log('selected :',selected);
        //     return {selected};
        // },((state)  => {
        //     console.log('after setState: ', this.state);
        // }));
    };

    _togglePlayVideo = (_id, _isMuted = false) => {
        // this.setState({
        //     paused : !this.state.paused,
        // })
        // console.log('video click :', _id, ' =', _isMuted);
        let _tmpData = _.cloneDeep(this.state.data);
        _.each(_tmpData, function(v,k){
            if(v._id == _id){
                
                
                if(_isMuted){
                    v.muted = !v.muted;
                }
                else{
                    v.paused = !v.paused;
                }
                // console.log('V :', v);
            }
            else{
                v.paused = true;
            }
            if(!v.loaded){
                v.loaded = true;
            }
        })
        this.setState({
            data: _tmpData
        }, () => {

        });

    }

    _getVideoCover = (item) => {
        return item.s3_url + item.formatted_video_thumbnail_url.replace('{{FILE_KEY}}',item.file_key)
    }

    _updateVideoStatus = (_id, isLoaded = false) => {
        console.log('_updateVideoStatus : ', _id);
        
         let _tmpData = _.cloneDeep(this.state.data);
        _.each(_tmpData, function(v,k){
            if(v._id == _id){
                v.alreadyLoaded = true;
            }

        });
        console.log('_tmpData : ',_tmpData);
        this.setState({
            data: _tmpData
        }, () => {

        });
    }

    _renderItem = ({item}) => ( 
        <TalentFeedItem
            id={ item._id }  
            userId={ item.user._id }  
            videoId={ item._id }   
            onPressItem={ this._onPressItem } 
            togglePlayVideo={ this._togglePlayVideo }
            selected={ !!this.state.selected.get(item._id) }
            title={ Helper._getUserFullName(item.user) } 
            caption={ item.caption || '' } 
            cover={ Helper._getCover(item.user) } 
            media_type={ 'video' } 
            createdAt={item._created_at} 
            videoUrl={item.s3_url + item.formatted_sd_video_url} 
            paused={item.paused} 
            loaded={item.loaded} 
            alreadyLoaded={item.alreadyLoaded} 
            updateVideoStatus = {this._updateVideoStatus}
            videoThum={this._getVideoCover(item)}  
            userObj={item.user}   
            muted={item.muted}   
            profile_cover={ Helper._getCover(item.user) } 
            profile_id={ item.user._id } 
            navigation={ this.props.navigation }
            paddFirstItem={ true }
        />
        /* <Text>Check for android</Text> */
    );

    _renderHeader = ({item}) => (
        // console.log('item : ', item)
        <ProfileHeader
        onPressItem={this._onPressItem}
        />
    );

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
        <View
            style={{
                paddingVertical: 20,
                borderColor: "#CED0CE"
            }}
        >
            <ActivityIndicator animating size="small" />
        </View>
        );
    };

    handleRefresh = () => {
        console.log('pull to refresh');
        this.setState({
            refreshing: true,
        })
        this._getVideoList(false, '', true);
    }

    handleLoadMore = () => {

        // return;
        
        let that = this;

        if(this.state.loading) return;

        this.setState({
            loading: true,
        },() => {  
            // data testing
            // for increase the list item by 1
            // let _allData = _.cloneDeep(this.state.data); // clone obj to use to prevent conflict id. coz flatlist work by id
            // let _tmp = [];
            // let _obj = _.head(_.shuffle(_allData));
            // _obj.user._id = that.state.data.length + 1;
            // _tmp.push(_obj);

            // // console.log('TMP : ',_obj);

            // that.setState({
            //     data: [...that.state.data, ..._tmp]
            // }, () => {
            //     setTimeout(function(){
            //         that.setState({
            //             loading: false,
            //         })
            //     },0)
            // })

            that._getVideoList(true, '', false);

            // console.log('after push',that.state.data);
        })

    }

    searchNow = (txtSearch, isEmpty=false) => {
        console.log('Search Text: ', txtSearch);
        
        if(!isEmpty){
            
            this.setState({
                searchText: txtSearch
            }, function(){

                this._getVideoList(false, txtSearch, true);
                if(txtSearch == ''){
                    this.setState({
                        page: 1
                    })
                }
                
            })
        }
    }

    onViewableItemsChanged = (e) => {
        console.log('onViewableItemsChanged :', e);

        let _tmpData = _.cloneDeep(this.state.data);

        _.each(e.viewableItems,function(v,k){
            if(v.isViewable && !v.item.loaded){
                _.each(_tmpData, function(v_sub,k_sub){
                    if(v_sub._id == v._id){
                        v_sub.loaded = true;
                    }
                })
            }
        })

        this.setState({
            data: _tmpData
        }, () => {

        });
    }

    renderHeader = () => {
        return (
            <View style={[ styles.justFlexContainer, styles.marginBotSM ]}>
                <SearchBox placeholder={'Search'} onSubmit={this.searchNow} isLoading={this.state.isLoading} />
            </View>
        )
    }

    // end testing flatlist

    render() {

        return (

                <FlatList
                    extraData={this.state.extraData}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    ref={ref => this.listRef = ref}
                    ListHeaderComponent={this.renderHeader}

                    ListFooterComponent={this.renderFooter}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    viewabilityConfig={VIEWABILITY_CONFIG}

                    onViewableItemsChanged = {this.onViewableItemsChanged}

                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    onEndReachedThreshold={0.7}
                    onEndReached={this.handleLoadMore}
                />

        )
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
        height:300

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
        flex: 1,
        opacity:0.5
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
});
export default connect(mapStateToProps)(Videos)