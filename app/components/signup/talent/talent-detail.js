// import React from 'react';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'

import { StyleSheet, Text, View, TextInput, Keyboard, Platform, TouchableOpacity, ScrollView, Alert, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';

import ButtonBack from '@components/header/button-back'

import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import Utilities from '@styles/extends/ultilities.style';
import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style'

import _ from 'lodash'

import { postApi, putApi } from '@api/request';
import { UserHelper, StorageData, Helper } from '@helper/helper';


var func = require('@helper/validate');

const dismissKeyboard = require('dismissKeyboard');

function mapStateToProps(state) {
    // console.log(state)
    return {
        user: state.user,
        // navigation: state.navigation
    }
}

// export default class SignUpInfo extends React.Component {
class TalentDetail extends Component{

    static navigationOptions = ({ navigation }) => ({
            // title: '',
            headerVisible: true,
            headerLeft: navigation.state.params.noBackButton ? null : (<ButtonBack
                isGoBack={ navigation }
                btnLabel= "Welcome to Talentora"
            />),
        });


     constructor(props){
        
        super(props);

        this.state = {
            enthicity: '',   
            languages: '',   

            height: '',   
            weight: '',   

            hair_color: '',   
            eye_color: '',  
            joining: false, 
            isActionButton: true,
            
        };

        const { navigate, goBack, state } = this.props.navigation;
        console.log('User Info : ',state);

     }

    continue(isSkip = false) {
        // Alert.alert('login now');
        let that=this;
        const { navigate, goBack, state } = that.props.navigation;

        if(!this.state.joining && !isSkip){

            setTimeout(function(){

                    var signUpInfo = _.extend({

                        enthicity: that.state.enthicity,   
                        languages: that.state.languages,   

                        height: that.state.height,   
                        weight: that.state.weight,   

                        hair_color: that.state.hair_color,   
                        eye_color: that.state.eye_color,   

                    }, state.params.sign_up_info);


                    that.setState({
                        joining: true
                    });

                    let API_URL = '/api/users/me/customs';

                    let talentCateStringArray = _.map(signUpInfo.talent_category, function(v, k) {
                        return v.category;
                    });

                    console.log('talentCateStringArray : ',talentCateStringArray);

                    let _dataPost = {
                            "ethnicity": {
                                "value": signUpInfo.enthicity,
                                "privacy_type": "only-me"
                            },
                            "language": {
                                "value": signUpInfo.languages,
                                "privacy_type": "only-me"
                            },
                            "height": {
                                "value": signUpInfo.height,
                                "privacy_type": "only-me"
                            },
                            "weight": {
                                "value": signUpInfo.weight,
                                "privacy_type": "only-me"
                            },
                            "hair_color": {
                                "value": signUpInfo.hair_color,
                                "privacy_type": "only-me"
                            },
                            "eye_color": {
                                "value": signUpInfo.eye_color,
                                "privacy_type": "only-me"
                            }
                        }
                    console.log('Data Post : ',JSON.stringify(_dataPost));
                    putApi(API_URL,
                        JSON.stringify(_dataPost)
                    ).then((response) => {

                        console.log('Response Object: ', response);
                        if(response.status=="success"){

                            let _result = response.result;

                            let _userData =  StorageData._saveUserData('SignUpProcess',JSON.stringify(_result)); 
                            UserHelper.UserInfo = _result; // assign for tmp user obj for helper
                            _userData.then(function(result){
                                console.log('complete save sign up process 3'); 
                            });

                            navigate('UploadPhoto', { sign_up_info: _result , from_route_name: 'To the details'});
                        }
                        that.setState({
                            joining: false
                        });
                    })

                    
                
            }, 50);  

        }             
        else{
            navigate('UploadPhoto', { sign_up_info: state.params.sign_up_info , from_route_name: 'To the details'});
        }
    }


    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    };


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
        // console.log('keyboard show');

    }
    
    keyboardDidHide (e) {
        // console.log('keyboard hide');
        if(Helper._isAndroid()){
            this.setState({
            isActionButton: true,
            })
        }
    }  
    //   end keyboard handle

    render() {
        return (    
            
            <View style={[ styles.viewContainerOfScrollView, this.state.isActionButton && {paddingBottom: 110}]} >

                {/* form */}  
                <ScrollView contentContainerStyle={[styles.mainScreenBg, {justifyContent: 'flex-start'}]}>

                    <KeyboardAvoidingView 
                                keyboardVerticalOffset={ 
                                    Platform.select({
                                        ios: () => 50,
                                        android: () => 5
                                    })()
                                }
                                behavior="position" style={[ {flex: 1 } ]}>
                                
                        <TouchableWithoutFeedback onPress={() =>  {dismissKeyboard()}} style={[styles.container]}>
            
                            <View style={[styles.container,styles.mainScreenBg]} >

                                <View style={[styles.mainPadding ]}>

                                    <View style={[styles.marginBotMD]}>
                                        <Text style={[styles.blackText, styles.btFontSize]}>
                                            To the details
                                        </Text>

                                        <Text style={[styles.grayLessText, styles.marginTopXS]}>
                                            These information will help you become more effective on our platform.
                                        </Text>
                                    </View>

                                    <TextInput 
                                        onChangeText={(txtEnthicity) => this.setState({ enthicity: txtEnthicity })}
                                        value={this.state.enthicity}  
                                        placeholder="Enthicity"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="next"
                                        keyboardType="email-address"
                                        autoCorrect={false}
                                        ref="1"
                                        onSubmitEditing={() => this.focusNextField('2')}
                                        style={styles.flatInputBox}
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom'
                                    />

                                    <TextInput 
                                        onChangeText={(txtLanguages) => this.setState({ languages: txtLanguages })}
                                        value={this.state.languages}  
                                        placeholder="Languages"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="next"
                                        style={styles.flatInputBox}
                                        ref="2"
                                        onSubmitEditing={()=> this.focusNextField('3') }
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom'
                                    />

                                    <TextInput 
                                        onChangeText={(txtHeight) => this.setState({ height: txtHeight })} 
                                        value={this.state.height}  
                                        placeholder="Height"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="next"
                                        style={[styles.flatInputBox, styles.marginTopBig]}
                                        ref="3"
                                        onSubmitEditing={()=> this.focusNextField('4') }
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom' 
                                    />

                                    <TextInput 
                                        onChangeText={(txtWeight) => this.setState({ weight: txtWeight })}
                                        value={this.state.weight}  
                                        placeholder="Weight"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="next"
                                        style={[styles.flatInputBox]}
                                        ref="4"
                                        onSubmitEditing={()=> this.focusNextField('5') }
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom'
                                    />

                                    <TextInput 
                                        onChangeText={(txtHairColor) => this.setState({ hair_color: txtHairColor })}
                                        value={this.state.hair_color}  
                                        placeholder="Hair color"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="next"
                                        style={[styles.flatInputBox, styles.marginTopBig]}
                                        ref="5"
                                        onSubmitEditing={()=> this.focusNextField('6') }
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom'
                                    />

                                    <TextInput 
                                        onChangeText={(txtEyeColor) => this.setState({ eye_color: txtEyeColor })}
                                        value={this.state.eye_color}  
                                        placeholder="Eye color"
                                        placeholderTextColor="#B9B9B9"
                                        returnKeyType="go"
                                        style={[styles.flatInputBox]}
                                        ref="6"
                                        onSubmitEditing={()=>this.continue()}
                                        underlineColorAndroid = 'transparent'
                                        textAlignVertical = 'bottom'
                                    />

                                </View>
                                
                                
                            </View>
                                    
                        </TouchableWithoutFeedback>


                    </KeyboardAvoidingView>

                </ScrollView>

                {/* absolute button */}
                { this.state.isActionButton  && 
                        <View style={styles.absoluteBox}>
                            <View style={[styles.txtContainer,styles.mainHorizontalPadding]}> 

                                <TouchableOpacity style={[styles.flatButton,]} onPress={() => this.continue() }>
                                    {   
                                        !this.state.joining ? <Text style={[styles.flatBtnText, styles.btFontSize]}>Continue</Text> : <ActivityIndicator color="white" animating={true} /> 
                                    }
                                </TouchableOpacity>

                                <View style={[styles.centerEle, styles.marginTopSM]}>
                                    <TouchableOpacity onPress={ () => { this.continue(true) } }>
                                        <Text style={styles.darkGrayText}> Skip this step </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                }

            </View>

        );
    }
}


var styles = StyleSheet.create({ ...FlatForm, ...Utilities,
    container: {
        flex: 1,
        // justifyContent: 'center',
        // padding: 20
    },

    btn: {
        textAlign: 'center',
        color: "white",
        fontWeight: "700",
    },

    help: {
        justifyContent:'center',
        flexDirection: 'row',
        marginTop: 10,
    },

    forget:{
        color: Colors.textColorDark,  
    },

    gethelp:{
        fontWeight: 'bold',
        color: Colors.textColorDark,
    },


    icon:{
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.textColorDark,
    },

    fbContainer:{
        // flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },

    fbLogin:{
        fontWeight: 'bold',
        color: Colors.textColor,
        marginLeft: 10,
    },

    txtContainer: {
        flex:1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch'
    },

});

export default connect(mapStateToProps, AuthActions)(TalentDetail)
