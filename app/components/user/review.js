import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as AuthActions from '@actions/authentication'

const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;

// import * as DetailActions from '@actions/detail'
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
    Switch,
    ActionSheetIOS,
    Linking
} from 'react-native'

import { view_profile_category } from '@api/response'


import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Styles from '@styles/card.style'
import { Colors } from '@themes/index';
// import FlatForm from '@styles/components/flat-form.style';
// import TagsSelect from '@styles/components/tags-select.style';
// import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style'; 
import ListItem from '@styles/components/list-item.style'; 
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';

import ButtonRight from '@components/header/button-right'
import ButtonTextRight from '@components/header/button-text-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'
import _ from 'lodash'

import { UserHelper, StorageData, Helper } from '@helper/helper';


function mapStateToProps(state) {
    // console.log('wow',state)
    return {
        user: state.user,
        user_info: [],
        // navigation: state.navigation
    }
}
const { width, height } = Dimensions.get('window') 

var BUTTONS = [
  'Sign Out',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;


class Review extends Component {
    constructor(props){
        super(props);
        this.state={
            tmp:[{},{},{}],
            header:[{},{},{},{}],
            allIcon:[
                {
                    isSelected:true
                },
                {
                    isSelected:false
                },
                {
                    isSelected:false
                },
                {
                    isSelected:false
                }
            ]
        }
        console.log('UserHelper._getKind: ',UserHelper._getKind('dancer,actor'));
        
    }

    

    static navigationOptions = ({ navigation }) => ({ 
        // title: '', 
        headerVisible: false,
        headerTitle: 'Review',
        headerLeft: (<ButtonBack
            isGoBack={ navigation }
            btnLabel= ""
        />),
    });

    inviteFriend = () => {
        const { navigate, goBack, state } = this.props.navigation;
        navigate('InviteFriend');
    }
    handleScroll=(event) => {
   
        let contentOffset = event.nativeEvent.contentOffset;
        let viewSize = event.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        // return pageNum;
        console.log('scrolled to page ', pageNum);
        let that=this;
        let tmpSelect=[];
        
        _.each(_.cloneDeep(this.state.allIcon),function(v,k){
            if(k==pageNum){
                console.log("K Object",k);
                v.isSelected=true;
            }
            else{
                v.isSelected=false;
            }
            tmpSelect.push(v);
        })
        this.setState({
            allIcon:tmpSelect
        },function(){
            console.log("All Icon after set selected field",this.state.allIcon);
        })
    }
    render() {
         return (
            
            <View style={[ styles.viewContainerOfScrollView ]} >

                {/* form */}  
                <ScrollView contentContainerStyle={[styles.mainScreenBg, {justifyContent: 'flex-start'}]}> 
                    <View style={[{backgroundColor:Colors.componentBackgroundColor,minHeight:75}]}>
                        <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} onScroll={this.handleScroll}>
                            {this.state.header.map((item, index) => {
                                return (
                                <View key={index} style={[styles.boxWrapContainer, styles.boxWrapContainerNoWrap,{width:width,flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                                    <Text><Text style={[{fontWeight:'bold',fontSize:12}]}>Recommended<Text style={[{color:'red'}]}> 22 times</Text> as</Text></Text>
                                    <View style={[{marginLeft:5}]}>
                                        <TouchableOpacity
                                                activeOpacity={0.9}
                                                style={[styles.tagsSelectNormal, styles.withBgGray, styles.tagsSelectAutoWidth, styles.noMargin,{backgroundColor:'#e4e4e4'}]}>
                                                <Text style={[styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM]}>
                                                    {Helper._capitalizeText('Singer')}
                                                </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            })}
                        </ScrollView>
                        <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:10}]}>
                            {this.state.allIcon.map((item, index) => {
                                return(
                                    <Icon key={index} name={"fiber-manual-record"} style={[{fontSize:10, color:item.isSelected ? '#4a4747':'#e4e4e4'}]} />
                                )
                            })}
                         </View>
                        {/*<Text>{this.handleScroll()}</Text>*/}
                    </View>
                    {this.state.tmp.map((item, index) => {
                        return (
                            <View key={index} style={[ styles.justFlexContainer, styles.mainVerticalPadding, styles.mainHorizontalPadding ,{flex:1,flexDirection:'row'}]}> 
                                <View style={[{alignItems:'center',marginRight:20}]}>
                                        <Image
                                        style={{
                                        width:70,
                                        height:70,
                                        borderRadius:10,
                                        resizeMode:'contain'
                                        }}
                                        source={require('@assets/tmp/user-profile.jpg')}/>
                                
                                </View>
                                <View style={[{flex:0.7}]}>
                                    <Text style={[{fontSize:12}]}><Text style={[{fontWeight:'bold'}]}>Sylvia Crawford</Text> would recommend Joan as</Text>
                                    <View style={[styles.tagContainerNormal, styles.paddingBotNavXS,{marginVertical:10}]}>
                                        {UserHelper
                                            ._getKind('dancer,actor')
                                            .map((itemsub, indexsub) => {
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        key={indexsub}
                                                        style={[styles.tagsSelectNormal, styles.withBgGray, styles.tagsSelectAutoWidth, styles.noMargin, styles.marginTopXXS]}>
                                                        <Text style={[styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM]}>
                                                            {Helper._capitalizeText(itemsub.display_name)}
                                                        </Text>

                                                    </TouchableOpacity>
                                                )
                                            })}

                                    </View>
                                    <Text>
                                        Fantastic experience working with Joan. Very professional and 
                                        able to handle ad-hoc situations well. Would highly recommend anyone
                                        needing talents with both singing and dancing skills.
                                    </Text>
                                </View>
                            </View> 
                        )
                    })}                 
                </ScrollView>

            </View>
         );
    }
}


var styles = StyleSheet.create({
    ...Styles,
    ...Utilities,
    ...ListItem,
    ...TagsSelect,
    ...BoxWrap,
    mytagcontainernormal:{
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center', 
    },
    mytagsSelectNormal: {  
        // minWidth: 75,
        // minHeight: 180,
        overflow: 'hidden',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.componentBackgroundColor,
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

});

export default connect(mapStateToProps, AuthActions)(Review)