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

import ButtonRight from '@components/header/button-right'
import ButtonTextRight from '@components/header/button-text-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'


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


class Setting extends Component {
    constructor(props){
        super(props);
        this.state={
            trueSwitchIsOn: false,
            falseSwitchIsOn: true,
            items:[
                {
                    icon : 'person-add',
                    icon_type : 'M',
                    text : 'Invite friends',
                    func : this.inviteFriend,
                },
                {
                    icon : 'exit-to-app',
                    icon_type : 'M',
                    text : 'Log Out',
                    func : this.showActionSheetLogOut,
                },
                {
                    icon : 'facebook-square',
                    icon_type : 'F',
                    text : 'Like us on Facebook',
                    isMargTop: true,
                    func : this.linkToFacebook,
                },
                {
                    icon : 'twitter',
                    icon_type : 'F',
                    text : 'Follow us on Twitter',
                    func : this.linkToTwitter,
                },
                {
                    icon : 'instagram',
                    icon_type : 'F',
                    text : 'Follow us on Instagram',
                    func : this.linkToInstagram,
                },
                {
                    icon : 'thumbs-up-down',
                    icon_type : 'M',
                    text : 'Tell us how to improve',
                    isMargTop: true,
                    func : this.howToImprove,
                },
                {
                    icon : 'library-books',
                    icon_type : 'M',
                    text : 'Terms of use',
                    func : this.termOfUse,
                },
                {
                    icon : 'vpn-lock',
                    icon_type : 'M',
                    text : 'Privacy policy',
                    func : this.privacyPolicy,
                    isNoBorderBot : true,
                },
            ]

        }
        console.log(this.props);
    }

    

    static navigationOptions = ({ navigation }) => ({ 
        // title: '', 
        headerVisible: false,
        headerTitle: 'Setting',
        headerLeft: (<ButtonBack
            isGoBack={ navigation }
            btnLabel= ""
        />),
    });

    inviteFriend = () => {
        const { navigate, goBack, state } = this.props.navigation;
        navigate('InviteFriend');
    }

    linkToFacebook=()=>{
        // Linking.openURL('https://www.facebook.com/Talentorapp/');
        Linking.openURL('fb://profile/529934683759474').catch(err => 
            {
                Linking.openURL('https://www.facebook.com/Talentorapp/')
            }
        );
        
    }

    linkToTwitter=()=>{
        // Linking.openURL('https://twitter.com/talentora?lang=en');
        Linking.openURL('twitter://user?screen_name=talentora').catch(err => 
            {
                Linking.openURL('https://twitter.com/talentora')
            }
        );
        
    }

    linkToInstagram=()=>{
        // Linking.openURL('https://www.instagram.com/talentora/');
        Linking.openURL('instagram://user?username=talentora').catch(err => 
            {
                Linking.openURL('http://instagram.com/_u/talentora')
            }
        );
    }

    handleClick = () => {
        // Alert.alert('hello handle click');
        Linking.openURL('fb://SY-Clction-681969555298264/?ref=bookmarks');
        // .then(supported => {
        // if (supported) {
        //     Linking.openURL(this.props.url);
        // } else {
        //     console.log('Don\'t know how to open URI: ' + this.props.url);
        // }
        // });
    };

    howToImprove=()=>{
        Linking.openURL('mailto:hello@talentora.co?subject=Hello%20Talentora%20Team&body=').catch(err => 
            {
                alert('No email app on this device. Please try to install the email app.')
            }
        );
    }
    //
    termOfUse=()=>{
        const { navigate, goBack, state } = this.props.navigation;
        navigate('TermOfUse'); 
    }

    privacyPolicy=()=>{
        const { navigate, goBack, state } = this.props.navigation;
        navigate('PrivacyPolicy');        
    }

    // show action sheet log out for IOS ONLY
    showActionSheetLogOut = () => {
        let _SELF = this;

        if(Helper._isIOS){
            // popup message from bottom with ios native component
            ActionSheetIOS.showActionSheetWithOptions({

                message: 'Are you sure you want to sign out?',
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

            },
            (buttonIndex) => {

                console.log(buttonIndex);
                //   this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex==0){
                    _SELF.logOutNow()
                }

            });
        }
        else{

            // for android ask with alert message with button

            // Works on both iOS and Android
            Alert.alert(
            'Are you sure you want to sign out?',
            // 'My Alert Msg', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Sign Out', onPress: () =>  _SELF.logOutNow() },
            ],
            { cancelable: false }
            )
        }

    };


    // log out of app
    logOutNow = () => { 

        // check if user has login ask facebook acc log out
        if(UserHelper._chkFacebookAcc()){
            console.log('logout from facebook');
            LoginManager.logOut();
        }

        // remove storage data
        StorageData._removeStorage('TolenUserData'); 
        UserHelper.UserInfo = null; // assign null to user info obj. so it auto set autheticate data = null too
        this.props.authenticate();

    }


    render() {
         return (
            
            <View style={[ styles.viewContainerOfScrollView ]} >

                {/* form */}  
                <ScrollView contentContainerStyle={[styles.mainScreenBg, {justifyContent: 'flex-start'}]}> 
 
                    <View style={[ styles.justFlexContainer, styles.mainVerticalPadding, styles.mainHorizontalPadding ]}> 

                        {/*<TouchableOpacity activeOpacity={.8} style={[ styles.flexVer, styles.spaceBetween, styles.rowNormal, styles.rowBorderBot, styles.noIcon ]}>

                            <Text style={[ styles.itemText, {paddingBottom: 10} ]}>   
                                Talents seeker mode
                            </Text>

                            <Switch
                            style={{marginBottom: 10, paddingVertical: 5,}}
                            disabled={false}
                            onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                            value={this.state.trueSwitchIsOn} />

                        </TouchableOpacity>*/}

                        {this.state.items.map((item, index) => {
                            
                            {/*console.log(item);*/}
                            return (
                                
                                <TouchableOpacity onPress={()=> item.func() } key={ index } activeOpacity={.8} style={[ styles.flexVer, styles.rowNormal, !item.isNoBorderBot && styles.rowBorderBot,
                                    item.isMargTop && styles.marginTopMDD
                                 ]}>
                                    {item.icon_type=="M" &&  <Icon name={item.icon} style={[ styles.itemIcon, 3 ]} /> }
                                    {item.icon_type=="F" && <IconFontAwesome name={item.icon} style={[ styles.itemIcon, 3 ]} />}
                                    <Text style={[ styles.itemText ]}>   
                                        { item.text }
                                    </Text>
                                </TouchableOpacity>

                            )

                        })}

                    </View>                  
                </ScrollView>

            </View>
         );
    }
}


var styles = StyleSheet.create({

    ...Utilities,
    ...ListItem,

});

export default connect(mapStateToProps, AuthActions)(Setting)