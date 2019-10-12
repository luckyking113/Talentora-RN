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


import PeopleItem from '@components/discovery/comp/people-list'  
// import ProfileHeader from '@components/user/comp/profile-header'

import { transparentHeaderStyle, defaultHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';


// import { UserHelper, StorageData, Helper } from '@helper/helper';
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
  waitForInteraction: true,
};

class People extends React.PureComponent {

    constructor(props){
        super(props);

        this.state={
            offset: 0,
            page: 1,
            limit: 10,
            searchText: '',
            loading: false,
            refreshing: false,
            extraData: [{_id : 1}],
            selected: (new Map(): Map<string, boolean>),
            data: [],
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
            to=""
        />),
        headerStyle: defaultHeaderStyle,
    }); 

    goToDetail = (item) => {
        console.log('goToSetting: ', item);
        const { navigate, goBack, state } = this.props.navigation;
        navigate('Profile' , {'user_info': item}); 
    }


    componentDidMount() {
        let _SELF = this;

        this._getPeopleList();

    }

    _getPeopleList = (isLoadMore = false, txtSearch='', isSearchLoading=false) => {
        // 
        let _SELF = this; 
        let _offset= (this.state.page - 1) * this.state.limit;
        
        if(isSearchLoading || (!isLoadMore && !isSearchLoading))
            _offset = 0;

        // let API_URL = '/api/contacts/search/people?limit=10&sort=-created_at'; 
        let API_URL = '/api/contacts/search/people?offset='+ _offset +'&limit='+ this.state.limit +'&sort=-created_at'; 
        // let API_URL = '/api/users/filter?offset='+ _offset +'&limit='+ this.state.limit; 
        // api/users/filter?type=singer,actor&min_weight=50&max_weight=60&gender=M,F&search=sreng gueckly
        // console.log(API_URL);

        if(isSearchLoading || this.state.searchText != ''){
            this.setState({ 
                isLoading: true,
                extraData: [{_id : this.state.extraData[0]._id++}] // change this value to re-render header or footer 
            })
            API_URL += '&search=' + this.state.searchText || txtSearch;
        }

        console.log('API_URL _getPeopleList : ',API_URL);

        getApi(API_URL).then((_response) => {
            console.log('All People : ', _response);
            if(_response.status == 'success'){

                // let _allAvailableJob = _response.result;

                // console.log('All Vailable Job : ', _allAvailableJob); 

                let _result = _response.result;

                let _goodData = _.filter(_result,function(v,k){
                    return v.attributes.kind && v.attributes.kind.value!='';
                });

                _goodData = _.chunk(_result, 2);

                // console.log('_.chunk(_result, 2)', _.chunk(_result, 2));

                if(isLoadMore){
                    _SELF.setState({
                        data: [..._SELF.state.data, ..._goodData],
                        extraData: [{_id : _SELF.state.extraData[0]._id++}],
                        page: _SELF.state.page+1,
                    }, () => {

                    })
                }
                else{
                    _SELF.setState({
                        data: _goodData,
                        extraData: [{_id : _SELF.state.extraData[0]._id++}],
                        page: _SELF.state.page+1,
                    }, () => {

                    })
                }
                // console.log('this ', _SELF.state);

            }

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

        });
    }

    test = () => {
        this.props.navigation.setParams({ handleFunc: this.goToSetting });
    }

    // test flatlist
    _keyExtractor = (item, index) => index;

    _onPressItem = (id) => {
        // updater functions are preferred for transactional updates
        console.log('THIS IS MY ID WHEN PRESS ITEM: ', id);
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

    _renderItem = ({item}) => (
        <PeopleItem
            onPressItem={this.goToDetail}
            selected={!!this.state.selected.get(item.id)}
            allData = {item}
        />
    );

    renderHeader = () => {
        return (
            <View style={[ styles.justFlexContainer, styles.marginBotSM ]}>
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
                borderColor: "#CED0CE"
            }}
        >
            <ActivityIndicator animating size="small" />
        </View>
        );

    };



    handleRefresh = () => { 
        this.setState({
            refreshing: true,
        })
        console.log('pull to refresh');
        this._getPeopleList();
    }

    handleLoadMore = () => {

        // console.log('this.state.loading', this.state.loading);

        let that = this;

        if(this.state.loading) return;

        this.setState({
            loading: true,
        },() => {  
            // data testing
            // for increase the list item by 1
            // let _allData = _.cloneDeep(tmpData); // clone obj to use to prevent conflict id. coz flatlist work by id
            // let _tmp = [];
            // let _obj = _.head(_.shuffle(_allData));
            // _obj.id = that.state.data.length+1;
            // _tmp.push(_obj);

            // console.log('TMP : ',_obj);

            // that.setState({
            //     data: [...that.state.data, ..._tmp]
            // }, () => {
            //     setTimeout(function(){
            //         that.setState({
            //             loading: false,
            //         })
            //     },0)
            // })

            // console.log('after push',that.state.data);

            this._getPeopleList(true, '', false);
            

        })

    }

    searchNow = (txtSearch, isEmpty=false) => {
        console.log('Search Text: ', txtSearch);
        if(!isEmpty){
            
            this.setState({
                searchText: txtSearch
            }, function(){

                this._getPeopleList(false, txtSearch, true);
                if(txtSearch == ''){
                    this.setState({
                        page: 1
                    })
                }
                
            })
        }
    }

    // end testing flatlist

    render() {

        return (
            //  <View style={[ styles.justFlexContainer, styles.mainScreenBg]}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.extraData}
                    keyExtractor={this._keyExtractor}

                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    viewabilityConfig={VIEWABILITY_CONFIG}

                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    onEndReachedThreshold={0.7}
                    onEndReached={this.handleLoadMore}
                />
            // </View>
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
    }
});
export default connect(mapStateToProps)(People)