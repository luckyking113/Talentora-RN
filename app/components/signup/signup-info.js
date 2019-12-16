// import React from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as AuthActions from '@actions/authentication';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Picker,
  Modal
} from 'react-native';

import ButtonBack from '@components/header/button-back';

import {Colors} from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import Utilities from '@styles/extends/ultilities.style';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';

import DeviceInfo from 'react-native-simple-device-info';
import * as RNLocalize from "react-native-localize";

import ALL_COUNTRIES from '@store/data/cca2';
import {postApi} from '@api/request';
import {
  UserHelper,
  StorageData,
  Helper,
  GoogleAnalyticsHelper,
} from '@helper/helper';

import _ from 'lodash';
import { genders } from '@api/response';

const dismissKeyboard = require('react-native-dismiss-keyboard');
var func = require('@helper/validate');
const Item = Picker.Item;
let originalGender=_.cloneDeep(genders);

function mapStateToProps(state) {
  // console.log('wow',state)
  return {
    user: state.user,
    user_info: [],
    // navigation: state.navigation
  };
}
class SignUpInfo extends Component {
  constructor(props) {
    super(props);
    
    let _userInfo = UserHelper.UserInfo;
    let _tmpFbDat = {
      firstname : '',
      lastname : '',
      gender : '',
    }   

    console.log('_userInfo.socialAccounts : ', _userInfo.socialAccounts);
    if(!_.isEmpty(_userInfo.socialAccounts)){
        _tmpFbDat = {
            firstname : _userInfo.profile.first_name,
            lastname : _userInfo.profile.last_name,
            gender : _userInfo.profile.gender,
        }
    }

    let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
    // let userLocaleCountryCode = RNLocalize.getLocales();
    const userCountryData = getAllCountries();
    let callingCode = null;
    let name = null;
    let cca2 = userLocaleCountryCode;
    if (!cca2 || !name || !userCountryData) {
      cca2 = 'US';
      name = 'United States';
      callingCode = '1';
    } else {
      callingCode = userCountryData.callingCode;
    }
    this.state = {
      joining: false,
      firstname: {
        val: _tmpFbDat.firstname || '',
        isErrRequired: false
      },
      lastname: {
          val: _tmpFbDat.lastname || '', 
          isErrRequired: false
      },
      cca2,
      name,
      callingCode,
      country: {
        val: '',
        langCode: '',
        callingCode: '',
        isErrRequired: false,
      },
      city: {
        val: '',
        isErrRequired: false,
      },
      age: {  
        val: '',
        isErrRequired: false
      },
      gendermale:{
        isErrRequired:false
      },
      genderfemale:{
          isErrRequired:false
      },
      gender: {  
        val: _tmpFbDat.gender || '',
        isErrRequired: false
      }, 
      email: {
        val: '',
        isErrRequired: false,
      },
      password: {
        val: '',
        isErrRequired: false,
      },
      phone: {
        val: '',
        isErrRequired: false,
      },
      selectedGender: _tmpFbDat.gender,
      errMessage: null,
      mode: Picker.MODE_DIALOG,
      prevoius_gender:'',
      isActionButton: true,
      modalVisible: false,
      Genders:originalGender
    };
    console.log(this.props);

    // console.log('User Info : ',state.params);

    // console.log(UserHelper);

    // StorageData._saveUserData('test_data', 'panhna seng updated');

    // UserHelper.token = 'panhna seng';

    // console.log(UserHelper._getToken());

    // StorageData._removeStorage('SignUpProcess');
  }

  // verfity which route user has to continue to complete their fill info
  _verifyRouteToGo = _userInfo => {
    const {navigate, goBack, state} = this.props.navigation;

    if (_userInfo.activeUserRoles.length <= 0) {
      // user need to fill Talent Category (employer or user)
      navigate('WhoAreYou');
    } else {
      const userRole = UserHelper._getFirstRole();
      if (_userInfo.profile.attributes) {
        if (_.isEmpty(_userInfo.profile.attributes.kind)) {
          // user need to fill Talent Type (director, dancer, host ...)

          if (userRole.role.name == 'user') navigate('TalentCategory');
          else navigate('TalentSeekerCategory');

          // return true;
        } else if (_.isEmpty(_userInfo.profile.attributes.date_of_birth)) {
          navigate('TalentWelcome', {sign_up_info: _userInfo});
          // return false;
        } else {
          // attri data if user has been input some data of attri
          const _attrData = _userInfo.profile.attributes;
          if (userRole.role.name == 'user') {
            // if user has been input at lease 1 field for Detail
            if (
              !_.isEmpty(_attrData.ethnicity.value) ||
              !_.isEmpty(_attrData.language.value) ||
              !_.isEmpty(_attrData.height.value) ||
              !_.isEmpty(_attrData.weight.value) ||
              !_.isEmpty(_attrData.hair_color.value) ||
              !_.isEmpty(_attrData.eye_color.value)
            ) {
              navigate('UploadPhoto', {sign_up_info: _userInfo});
            } else {
              navigate('TalentDetail', {sign_up_info: _userInfo});
            }
          } else {
            navigate('UploadPhoto', {sign_up_info: _userInfo});
          }
        }
      } else {
        // user need to fill Talent Type (director, dancer, host ...)
        if (userRole.role.name == 'user')
          navigate('TalentCategory', {sign_up_info: _userInfo});
        else navigate('TalentSeekerCategory', {sign_up_info: _userInfo});
      }
    }
  };

  componentDidMount() {
    GoogleAnalyticsHelper._trackScreenView('Sign Up');    
    return;
  }

  static navigationOptions = ({navigation}) => ({
    headerVisible: true,
    headerLeft: <ButtonBack isGoBack={navigation} btnLabel="Welcome" />,
  });

  // continue button
  joinUsNow() {    
    // func('variable that is in the function global');
    console.log('after calling');
    // this.phoneResult=func(this.state.phone,'phone');

    if (!this.state.joining) {
      if (this.state.selectedGender == '') {

        this.setState({
          gender: {
            val: "",
            isErrRequired: true
          }
        });
      } else {

        let _tmp = this.state.gender;

        _tmp.val = this.state.selectedGender;
        _tmp.isErrRequired = false;

        this.setState({
          selectedGender: _tmp.val,
          gender: _tmp,
          prevoius_gender: _tmp.val
        });
        // console.log('Gender State : ',this.state);
      }
      if(func(this.state.firstname,'firstname')){
        this.setState({
            firstname: {
                isErrRequired:true
            }
        })
      }
      if(func(this.state.lastname,'lastname')){
          this.setState({
              lastname:{
                  isErrRequired:true
              }
          })
      }
      if (func(this.state.country, 'country')) {
        this.setState({
          country: {
            isErrRequired: true,
          },
        });
      }
      if (func(this.state.city, 'city')) {
        this.setState({
          city: {
            isErrRequired: true,
            val: this.state.city.val,
          },
        });
      }
      if (func(this.state.age, 'age')) {
        this.setState({
          age: {
            isErrRequired: true,
            val: this.state.age.val,
          },
        });
      }
      if (func(this.state.email, 'email')) {
        this.setState({
          email: {
            isErrRequired: true,
            val: this.state.email.val,
          },
        });
      }
      if (func(this.state.password, 'password')) {
        this.setState({
          password: {
            isErrRequired: true,
          },
        });
      }
      if (func(this.state.phone, 'phone')) {
        this.setState({
          phone: {
            isErrRequired: true,
          },
        });
      }

      let that = this;
      
      setTimeout(function() {
      
        if (
          !that.state.country.isErrRequired &&
          !that.state.email.isErrRequired &&
          !that.state.city.isErrRequired &&
          !that.state.age.isErrRequired &&
          !that.state.password.isErrRequired &&
          !that.state.phone.isErrRequired
        ) {      
         
          // dismissKeyboard();

          // const { navigate, goBack, setParams, state } = that.props.navigation;
          let signUpInfo = {
            first_name: that.state.firstname.val,
            last_name: that.state.lastname.val,
            country: that.state.country.val,
            city: that.state.city.val,
            age: that.state.age.val,
            gender: that.state.selectedGender,
            lang_code: that.state.country.langCode,
            phone_num_code: that.state.country.callingCode,
            phone_number: that.state.phone.val,
            email: that.state.email.val.trim(),
            password: that.state.password.val,
          };

          // console.log('This is sing up info: ', signUpInfo);
          // console.log('This is code: ', that.state.country.callingCode);
          // return;

          that.setState({
            joining: true,
            errMessage: null,
          });

          let API_URL = '/api/users/register';
          // console.log('signUpInfo CCCwekt4tl3434 3gert  :', signUpInfo);
          postApi(
            API_URL,
            JSON.stringify({
              first_name: signUpInfo.first_name,
              last_name: signUpInfo.last_name,
              phone: signUpInfo.phone_number,
              country_code: signUpInfo.phone_num_code,
              country: signUpInfo.country,
              city:signUpInfo.city,
              age:signUpInfo.age,
              gender: signUpInfo.gender,
              email: signUpInfo.email,
              password: signUpInfo.password,
              confirm_password: signUpInfo.password,
              // "date_of_birth": '',
              // "gender": '',
              is_register_completed: false,
            }),
          ).then(response => {
            console.log('Response Object: ', response);
            if (response.status == 'success') {
              // console.log('Response Object: ', response);
              // that._saveUserData(response);

              let _result = response.result;
              let _userData = StorageData._saveUserData(
                'SignUpProcess',
                JSON.stringify(_result),                
              );

              UserHelper.UserInfo = _result; // assign for tmp user obj for helper
              _userData.then(function(result) {
                console.log('complete save sign up process 1');
                // navigate('WhoAreYou',{ sign_up_info: signUpInfo});
                // navigate('WhoAreYou',{ sign_up_info: _result});
                that.replaceScreen(_result);
              });
            } else {
              that.setState({
                errMessage: response.result,
              });

              console.log('last state : ', that.state);
            }

            that.setState({
              joining: false,
            });
          });
        }
      }, 50);
    }
  }

  onValueChange = (key, value) => {
    console.log(key, value);
    const newState = {};
    newState[key] = value;
    if(key == 'selectedGender'){
        if(value != ''){
            this.setState(newState);
        }
    }else{
        this.setState(newState); 
    }
  };

  onAgeChanged(text) {
    let re = /^[0-9]{0,2}$/;

    if (re.test(text)) {
      this.setState({
        age: {
          val: text
        }
      })
    }
  }

  // check for render text color for value of country (error, placehoder and have value)
  checkColorCountryInput = () => {
    // console.log(this.state.country);
    if (this.state.country.val == '') return '#B9B9B9';
    else if (this.state.country.isErrRequired) {
      return 'red';
    } else {
      return 'black';
    }
  };

  focusNextField = nextField => {
    this.refs[nextField].focus();
  };

  replaceScreen = signUpInfo => {
    // const { locations, position } = this.props.navigation.state.params;
    // console.log('Replace the screen');
    this.props.navigation.dispatch({
      key: 'WhoAreYou',
      type: 'ReplaceCurrentScreen',
      routeName: 'WhoAreYou',
      params: {sign_up_info: signUpInfo},
    });
  };

  // start keyboard handle
  UNSAFE_componentWillMount() {
    // console.log(Keyboard);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    // let newSize = Dimensions.get('window').height - e.endCoordinates.height
    if (Helper._isAndroid()) {
      this.setState({
        isActionButton: false,
      });
    }
  }

  keyboardDidHide(e) {
    // console.log('keyboard hide');
    if (Helper._isAndroid()) {
      this.setState({
        isActionButton: true,
      });
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  //   end keyboard handle
  genderSelect=(item,index)=>{
    console.log("my item in gender select",item);
    console.log("state Genders",this.state.Genders);
    let temp=this.state.Genders;
    let selectedvalue;
    _.map(temp,function(v,k){
        if(v.id==item.id){
            selectedvalue=v.display_name;
        }
    });
    let _tmpStateObject=this.state.gender;
    _tmpStateObject.val=selectedvalue;
    _tmpStateObject.isErrRequired=false;
    this.setState({selectedGender:selectedvalue=='Male'? 'M':'F',gender:_tmpStateObject},function(){
        console.log("after setstate",this.state.gender,this.state.selectedGender);
    });
    this.setModalVisible(false);
  }
  onChanged(text) {
    let reSing = /^[0-9]{0,8}$/;
    let re = /^[0-9]{0,20}$/;
    //  console.log("validate phone ",reSing.test(text));
    // console.log("country display",this.state.country.val);
    if (this.state.country.val == 'Singapore') {
      if (reSing.test(text)) {
        this.setState({
          phone: {
            val: text,
          },
        });
      }
    } else {
      if (re.test(text)) {
        this.setState({
          phone: {
            val: text,
          },
        });
      }
    }
  }

  validateGender = (_val) => {
    // console.log(_val);
    let _tmp = '';
    if(_val != 'Male' && _val !='Female')
        _tmp = false
    else
        _tmp = true;
    // console.log('Tmp : ',_tmp);
    return _tmp;
  }

  getValueGender = (_val) => {
    // console.log(_val);

    if(_.isEmpty(_val))
        return 'Please select gender *';

    if(_val == 'M')
        return 'Male';
    else
        return 'Female';
  }

  render() {
    const {navigate, goBack, state} = this.props.navigation;
    return (
      <View style={[styles.viewContainerOfScrollView]}>
        <ScrollView contentContainerStyle={[styles.defaultScrollContainer]}>
          <TouchableWithoutFeedback
            onPress={() => {
              dismissKeyboard();
            }}>
            <View style={[styles.container, styles.mainScreenBg]}>              
              <View style={[styles.mainPadding]}>
                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                  <TextInput 
                    onChangeText={(txtFirstname) => this.setState({firstname:{
                        val:txtFirstname
                    }})}
                    value={this.state.firstname.val}                        
                    placeholder="First Name"
                    placeholderTextColor={ this.state.firstname.isErrRequired ? 'red' :"#B9B9B9"}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onFocus = { ()=> this.keyboardDidShow(null) }
                    onSubmitEditing={() => this.lastname.focus()}
                    style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black', width:'48.5%'}]}
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                  />
                  <TextInput 
                    onChangeText={(txtLastname) => this.setState({lastname:{
                        val:txtLastname
                    }})}
                    value={this.state.lastname.val} 
                    placeholder="Last Name"
                    placeholderTextColor={ this.state.lastname.isErrRequired ? 'red' :"#B9B9B9"}
                    returnKeyType="go"
                    style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black', width:'48.5%'}]}
                    ref={(input) => this.lastname =  input}
                    onFocus = {() => {
                        this.keyboardDidShow(null)  
                    }}
                    onSubmitEditing={() => this.setState({
                            modalVisible: true
                        })}                                    
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                  />
                </View> 
                <CountryPicker
                  countryList={ALL_COUNTRIES}
                  closeable={true}
                  filterable={true}
                  onChange={value => {
                    this.setState({
                      phone: {
                        val: '',
                      },
                    });
                    this.setState({
                      country: {
                        val: value.name,
                        langCode: value.cca2,
                        callingCode: value.callingCode,
                        isErrRequired: false,
                      },
                    });
                  }}
                  cca2={this.state.cca2}
                  translation="eng">
                  <View style={styles.countryPicker}>
                    <Text
                      style={[
                        styles.inputValueFontSize,
                        {color: this.checkColorCountryInput()},
                      ]}>
                      {' '}
                      {this.state.country.val || 'Country'}{' '}
                    </Text>
                  </View>
                </CountryPicker>

                <View style={styles.phoneContainer}>
                  <View style={styles.callingCodeContainer}>
                    <Text style={styles.callingCode}>
                      {' '}
                      + {this.state.country.callingCode}
                    </Text>
                  </View>
                  <TextInput
                    onChangeText={text => this.onChanged(text)}
                    value={this.state.phone.val}
                    placeholder="Phone number"
                    placeholderTextColor={
                      this.state.phone.isErrRequired ? 'red' : '#B9B9B9'
                    }
                    returnKeyType="next"
                    style={[styles.phoneNumber, styles.inputValueFontSize]}
                    onFocus={() => this.keyboardDidShow(null)}
                    onSubmitEditing={() => this.focusNextField('3')}
                    underlineColorAndroid="transparent"
                    textAlignVertical="bottom"
                    keyboardType="phone-pad"
                  />
                </View>
                <TextInput
                  ref="2"
                  onChangeText={txtCity =>
                    this.setState({
                      city: {
                        val: txtCity,
                      },
                    })
                  }
                  value={this.state.city.val}
                  placeholder="City"
                  onFocus={() => this.keyboardDidShow(null)}
                  placeholderTextColor={
                    this.state.city.isErrRequired ? 'red' : '#B9B9B9'
                  }
                  returnKeyType="next"
                  style={[
                    styles.flatInputBox,                    
                    styles.inputValueFontSize,
                    {color: this.state.city.isErrRequired ? 'red' : '#4a4a4a'},
                  ]}
                  onSubmitEditing={() => this.focusNextField('3')}
                  underlineColorAndroid="transparent"
                  textAlignVertical="bottom"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                  <TextInput 
                      onChangeText={(txtAge) => this.onAgeChanged(txtAge)}
                      value={this.state.age.val}                     
                      placeholder="Age"
                      placeholderTextColor={ this.state.age.isErrRequired ? 'red' :"#B9B9B9"}
                      returnKeyType="go"
                      style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black',width:'48.5%'}]}
                      ref={(input) => this.ageInput =  input}
                      onFocus = { ()=> this.keyboardDidShow(null) }
                      onSubmitEditing={()=>this.joinUsNow()}
                      underlineColorAndroid = 'transparent'
                      textAlignVertical = 'bottom'
                      keyboardType="phone-pad" 
                  />

                  { Helper._isAndroid()  && 

                  <View style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black',width:'48.5%', justifyContent:'center'}]}> 
                      <View style = {[ {flex: 1} ]}>
                          <Modal
                              transparent={true}
                              onRequestClose={() => {}}
                              visible = {this.state.modalVisible}>
                              <TouchableOpacity style={[ styles.justFlexContainer, styles.mainVerticalPadding, {flex:1,flexDirection:'column',paddingBottom:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.8)'}]} onPressOut={() => {this.setModalVisible(false)}}>
                                  <View style={{width:300,height:160,backgroundColor:'white'}}>
                                      <View style={[styles.languageNav ]} >
                                          <Text style={[ styles.languageNavTitle,styles.inputLabelFontSize,{textAlign:'left'} ]} >Please select gender</Text>
                                      </View>
                                      <ScrollView contentContainerStyle={[styles.mainVerticalPadding, styles.mainHorizontalPadding ]}>
                                          {this.state.Genders.map((item, idx) => {
                                              return (
                                                  <View key={idx} >
                                                      {/*{console.log('Item ZIN: ', lang, idx)}*/}
                                                      {/* {when search first time click on the row is not work cus not yet lost focus from text input */}
                                                      <TouchableOpacity onPress={() => this.genderSelect(item, idx) } activeOpacity={.8}
                                                          style={[ styles.flexVer, styles.rowNormal, {justifyContent:'space-between'}]}>
                                                          <Text style={[ styles.itemText,styles.inputValueFontSize, {paddingTop: 7, paddingBottom:7, 
                                                              color: item.selected ? 'red' : 'black'} ]}>   
                                                              { item.display_name }
                                                          </Text>
                                                          {item.selected && <Icon name={"done"} style={[ styles.itemIcon, 3, {color:'red' }]} /> }
                                                      </TouchableOpacity>
                                                      <View style={[{borderWidth:1,borderColor:Colors.componentBackgroundColor}]}></View>
                                                  </View>
                                              )
                                          })}
                                      </ScrollView>
                                  </View>
                              </TouchableOpacity>
                          </Modal>
                          {/*Old Picker*/}
                          {/*<Picker
                              ref = 'genderPicker'
                              selectedValue={this.state.selectedGender}
                              onValueChange={this.onValueChange.bind(this, 'selectedGender')}>
                              <Item label="Please select gender" value=""/>  
                              <Item label="Male" value="M" /> 
                              <Item label="Female" value="F" />
                          </Picker>*/}
                      </View>
                      <TouchableOpacity onPress={() => this.setModalVisible(true)} style={{backgroundColor: Colors.componentBackgroundColor, marginBottom: 10,borderRadius: 5}}>
                          <View style = {[styles.itemPicker,{flex:0.7,paddingHorizontal:12}]}>
                              <Text style={[ styles.flatInputBoxFont,styles.inputValueFontSize, {opacity:this.state.selectedGender? 1:(this.state.gender.isErrRequired? 1:0.8),color:this.state.selectedGender? 'black':(this.state.gender.isErrRequired? 'red':'#B9B9B9'),textAlign:'left',paddingVertical:12,backgroundColor: Colors.componentBackgroundColor}]}>{ Helper._getGenderLabel(this.state.selectedGender) || 'Please select gender' }</Text>
                          </View>
                      </TouchableOpacity>
                  </View> 
                  } 

                  { Helper._isIOS()  && 
                  <View style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black',width:'48.5%', justifyContent:'center'}]}> 
                      <Modal
                          animationType={"slide"}
                          transparent={true}
                          onRequestClose={() => {}}
                          visible={this.state.modalVisible}>

                          <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
                              <TouchableOpacity
                                  style={[ {backgroundColor: Colors.componentDarkBackgroundColor, padding: 15} ]}
                                  onPress={() => { 
                                      this.setModalVisible(!this.state.modalVisible);
                                      let _SELF = this;
                                      setTimeout(function(){
                                          _SELF.ageInput.focus();
                                      },200)
                                  }}>
                                  <Text style={[styles.fontBold, styles.inputLabelFontSize,{textAlign: 'right', color: '#3b5998'} ]} >Done</Text>
                              </TouchableOpacity>
                              <View style={[ {backgroundColor: 'white'} ]}>
                                  <Picker
                                      selectedValue={this.state.selectedGender}
                                      onValueChange={this.onValueChange.bind(this, 'selectedGender')}>
                                      <Item label="Please select gender" value=""/>
                                      <Item label="Male" value="M" /> 
                                      <Item label="Female" value="F" />
                                  </Picker>
                              </View>
                          </View>
                      </Modal>

                      <TouchableOpacity
                          onPress={() => {
                              this.setModalVisible(true)
                          }}>
                          <View style = {styles.genderPicker}>
                              <Text style={[ styles.flatInputBoxFont, styles.inputValueFontSize,{color: this.state.gender.isErrRequired ? 'red': '#B9B9B9'} , !_.isEmpty(this.state.selectedGender) && {color: Colors.textBlack}  ]}>{ Helper._getGenderLabel(this.state.selectedGender) || 'Please select gender' }</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                  }
                </View> 

                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                  <TextInput 
                    onChangeText={(txtFirstname) => this.setState({firstname:{
                        val:txtFirstname
                    }})}
                    value={this.state.firstname.val}                        
                    placeholder="First Name"
                    placeholderTextColor={ this.state.firstname.isErrRequired ? 'red' :"#B9B9B9"}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onFocus = { ()=> this.keyboardDidShow(null) }
                    onSubmitEditing={() => this.lastname.focus()}
                    style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black', width:'48.5%'}]}
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                  />
                  <TextInput 
                    onChangeText={(txtLastname) => this.setState({lastname:{
                        val:txtLastname
                    }})}
                    value={this.state.lastname.val} 
                    placeholder="Last Name"
                    placeholderTextColor={ this.state.lastname.isErrRequired ? 'red' :"#B9B9B9"}
                    returnKeyType="go"
                    style={[styles.flatInputBox,styles.inputValueFontSize,{color:'black', width:'48.5%'}]}
                    ref={(input) => this.lastname =  input}
                    onFocus = {() => {
                        this.keyboardDidShow(null)  
                    }}
                    onSubmitEditing={() => this.setState({
                            modalVisible: true
                        })}                                    
                    underlineColorAndroid = 'transparent'
                    textAlignVertical = 'bottom'
                  />
                </View> 
                <TextInput
                  ref="3"
                  onChangeText={txtEmail =>
                    this.setState({
                      email: {
                        val: txtEmail,
                      },
                    })
                  }
                  value={this.state.email.val}
                  placeholder="Email"
                  onFocus={() => this.keyboardDidShow(null)}
                  placeholderTextColor={
                    this.state.email.isErrRequired ? 'red' : '#B9B9B9'
                  }
                  returnKeyType="next"
                  style={[
                    styles.flatInputBox,                    
                    styles.inputValueFontSize,
                    {color: this.state.email.isErrRequired ? 'red' : '#4a4a4a'},
                  ]}
                  onSubmitEditing={() => this.focusNextField('4')}
                  underlineColorAndroid="transparent"
                  textAlignVertical="bottom"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TextInput
                  ref="4"
                  onChangeText={txtPassword =>
                    this.setState({
                      password: {
                        val: txtPassword,
                      },
                    })
                  }
                  value={this.state.password.val}
                  placeholder="Password"
                  placeholderTextColor={
                    this.state.password.isErrRequired ? 'red' : '#B9B9B9'
                  }
                  returnKeyType="done"
                  secureTextEntry
                  style={[styles.flatInputBox, styles.inputValueFontSize]}
                  onFocus={() => this.keyboardDidShow(null)}
                  onSubmitEditing={() => this.joinUsNow()}
                  underlineColorAndroid="transparent"
                  textAlignVertical="bottom"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {this.state.errMessage && (
                  <View>
                    <Text
                      style={[
                        {color: 'red', textAlign: 'center'},
                        styles.marginTopSM,
                      ]}>
                      {this.state.errMessage}
                    </Text>
                    <TouchableOpacity style={[]} onPress={() => goBack()}>
                      {/*<Text style={[ {color: Colors.primaryColDark, textAlign: 'center'}, styles.marginTopSM ]}> Back To Log In </Text>*/}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {this.state.isActionButton && (
          <View style={styles.absoluteBox}>
            <View style={[styles.txtContainer, styles.mainHorizontalPadding]}>
              <TouchableOpacity
                style={[styles.flatButton]}
                onPress={() => this.joinUsNow()}>
                {!this.state.joining ? (
                  <Text style={[styles.btn, styles.btFontSize]}>Join</Text>
                ) : (
                  <ActivityIndicator color="white" animating={true} />
                )}
              </TouchableOpacity>

              <View style={[styles.centerEle, styles.marginTopSM]}>
                <Text style={styles.grayLessText}>
                  By signing up, you agree to our
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate('TermOfUse');
                    }}>
                    <Text style={[styles.darkGrayText, styles.fontBold]}>
                      Terms of Service
                    </Text>
                  </TouchableOpacity>
                  <Text> & </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigate('PrivacyPolicy');
                    }}>
                    <Text style={[styles.darkGrayText, styles.fontBold]}>
                      Privacy Policy.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  ...FlatForm,
  ...Utilities,
  container: {
    flex: 1,
    paddingTop: 50,
    // padding: 20
  },

  countryPicker: {
    height: 45,
    backgroundColor: Colors.componentBackgroundColor,
    marginBottom: 10,
    // color: Colors.textColor,
    // paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    // flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 8,
  },

  phoneContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    height: 45,
    backgroundColor: Colors.componentBackgroundColor,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  callingCodeContainer: {
    backgroundColor: Colors.componentDarkBackgroundColor,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.componentBackgroundColor,
  },

  callingCode: {
    flex: 0,
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 7,
    paddingRight: 12,
    minWidth: 50,
    // textAlign: 'center',
  },

  phoneNumber: {
    flex: 2,
    marginBottom: 0,
    paddingLeft: 10,
  },

  btn: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
  },

  help: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  forget: {
    color: Colors.textColorDark,
  },

  gethelp: {
    fontWeight: 'bold',
    color: Colors.textColorDark,
  },

  icon: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.textColorDark,
  },

  fbContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  fbLogin: {
    fontWeight: 'bold',
    color: Colors.textColor,
    marginLeft: 10,
  },

  txtContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default connect(
  mapStateToProps,
  AuthActions,
)(SignUpInfo);
