import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    Keyboard,
    Platform
} from 'react-native';

import { connect } from 'react-redux';
import * as AuthActions from '@actions/authentication';

import { UserHelper, StorageData, Helper } from '@helper/helper';


import { Colors } from '../../themes/index';
import LogInForm from '../login/login-form'; 

import _ from 'lodash'

const dismissKeyboard = require('react-native-dismiss-keyboard')

const transparentHeaderStyle = Helper._isIOS() ? {
    
    backgroundColor: Colors.screenBg,   
    // backgroundColor: Colors.secondaryCol,   
    borderBottomColor: 'transparent',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    shadowColor: 'transparent',
    elevation: 0,
    // height: 0,
} : {
    
    backgroundColor: Colors.screenBg,   
    // backgroundColor: Colors.secondaryCol,   
    borderBottomColor: 'transparent',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    shadowColor: 'transparent',
    elevation: 0,
    height: 0,
};
function mapStateToProps(state) {

    return {
        user: state.user,
        // navigation: state.navigation
    }
}

class Authenticate extends Component {


    static navigationOptions = ({ navigation }) => ({
        tabBarVisible :false,
        headerVisible :false,
        headerStyle: transparentHeaderStyle, 
        headerLeft: null,      
        header:null,
    });

    static tabBarOptions = {
        visible: false,
        inactiveTintColor: '#aaa',
        activeTintColor: '#fff',
        showIcon: true,
        showLabel: false,
        style: {
            backgroundColor: '#272822',
        },    
    };

    constructor(props) {
        super(props)

        this.state = {

            btnLoginText: 'Log in',
            isActionButton: true,
        }
        
    }

    authenticate() {
        this.setState({ btnLoginText: 'Loading ...' })
        this.props.authenticate()
    }

    // verfity which route user has to continue to complete their fill info
    _verifyRouteToGo = (_userInfo) => {

        const { navigate, goBack, state } = this.props.navigation;
        if(_userInfo.activeUserRoles.length<=0){
            // user need to fill Talent Category (employer or user)
            navigate('WhoAreYou', { noBackButton : true  });
        }
        else{
            const userRole = UserHelper._getFirstRole();
            if(_userInfo.profile.attributes){
                
                if(_.isEmpty(_userInfo.profile.attributes.kind)){
                    // user need to fill Talent Type (director, dancer, host ...)

                    if(userRole.role.name == 'user')
                        navigate('TalentCategory' , { noBackButton : true  });
                    else
                        navigate('TalentSeekerCategory', { noBackButton : true } );

                    // return true;
                }
                else if(_.isEmpty(_userInfo.profile.attributes.date_of_birth)){
                    navigate('TalentWelcome',{ sign_up_info: _userInfo, noBackButton : true  });
                    // return false;
                }
                else{
                    // attri data if user has been input some data of attri
                    const _attrData = _userInfo.profile.attributes;
                    if(userRole.role.name == 'user'){

                        // if user has been input at lease 1 field for Detail 
                        if(!_.isEmpty(_attrData.ethnicity.value) || !_.isEmpty(_attrData.language.value) || !_.isEmpty(_attrData.height.value) ||
                        !_.isEmpty(_attrData.weight.value) || !_.isEmpty(_attrData.hair_color.value) || !_.isEmpty(_attrData.eye_color.value)){
                            
                            
                            if(!_userInfo.photos || _userInfo.photos.length<=0)
                                navigate('UploadPhoto',{ sign_up_info: _userInfo, noBackButton : true  });
                            else
                                navigate('UploadVideo',{ sign_up_info: _userInfo, noBackButton : true  });
                        }
                        else{
                            if(_userInfo.photos && _userInfo.photos.length > 0)
                                navigate('UploadVideo',{ sign_up_info: _userInfo, noBackButton : true  });
                            else
                                navigate('TalentDetail',{ sign_up_info: _userInfo, noBackButton : true });
                        }
                    }
                    else{
                        
                        if(!_userInfo.photos || _userInfo.photos.length<=0)
                            navigate('UploadPhoto',{ sign_up_info: _userInfo, noBackButton : true }); 
                        else
                            navigate('UploadVideo',{ sign_up_info: _userInfo, noBackButton : true  });
                    }
                }
            }
            else{
                // user need to fill Talent Type (director, dancer, host ...)
                if(userRole.role.name == 'user')
                    navigate('TalentCategory',{ sign_up_info: _userInfo, noBackButton : true });
                else
                    navigate('TalentSeekerCategory',{ sign_up_info: _userInfo, noBackButton : true });
            }
        }
    }


    signUpPress() { 
        
        let that = this;
        
        // load sign up process (if user sign up success on first step & they missed next 'internet problem or ...') 
        // we will continue to force them to fill more info
        let _userData =  StorageData._loadInitialState('SignUpProcess'); 
        _userData.then(function(result){   
            

            if(result){
                let _userInfo = JSON.parse(result);
                UserHelper.UserInfo = _userInfo;
                

                that._verifyRouteToGo(_userInfo);            
    

                
            }else{
                const { navigate, goBack } = that.props.navigation;
                navigate('SignUp');
            }
        });
    }

    componentDidMount(){
        let _userData =  StorageData._loadInitialState('SignUpProcess'); 
        _userData.then(function(result){

        });



    }

    // start keyboard handle
    componentWillMount () {
        
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    keyboardDidShow (e) {
        // let newSize = Dimensions.get('window').height - e.endCoordinates.height
        if(Helper._isAndroid()){
            this.setState({
                isActionButton: false,
            })
        }
        

    }
    
    keyboardDidHide (e) {
        
        if(Helper._isAndroid()){
            this.setState({
                isActionButton: true,
            })
        }
    }  
    //   end keyboard handle

    render() {
        
        // const { icon, onPress, navigate, to } = this.props

        return (
            <KeyboardAvoidingView 
            
                keyboardVerticalOffset={ 
                    Platform.select({
                        ios: () => -50,
                        android: () => -150 
                    })()
                }
                behavior="padding" style= {styles.container} onPress={ () => { dismissKeyboard() } }>

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('@assets/talentora.png')} />
                    </View>
                </TouchableWithoutFeedback> 

                <TouchableWithoutFeedback onPress={ () => { dismissKeyboard() } }>
                    <View style={styles.formContainer}>
                        <LogInForm loginFrm = {this} />
                    </View>
                </TouchableWithoutFeedback>

                { this.state.isActionButton  && 

                    <View style={styles.signup}>
                        <View style={styles.txtContainer}>

                            <Text style={styles.noAccount}>Don't have an account? </Text>
                            <TouchableOpacity activeOpacity={.8} onPress={ () => { this.signUpPress() } }>
                                <Text style={styles.txtsignup}> Sign up.</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                }
                
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  formContainer: {
    // paddingBottom: 10
    // flex:1,
    // backgroundColor:'red',
  },

  itemsContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    // flexGrow: 1,
    justifyContent: 'center',
  },

  logo: {
    resizeMode: "contain",
    width: 180,
    backgroundColor:Colors.white
  },

  signup: {
    flexDirection: 'row',
    backgroundColor: Colors.componentBackgroundColor,
    paddingTop: 15,
    paddingBottom: 15,
    position: 'absolute',
    bottom:0,
  },

  txtContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center'
  },

  noAccount:{
    color: Colors.textColorDark  
  },

  txtsignup: {
    fontWeight: 'bold',
    color:Colors.textColorDark,
  },

})

export default connect(mapStateToProps, AuthActions)(Authenticate)


// export default Authenticate
