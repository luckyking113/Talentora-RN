// import React from 'react';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '@actions/authentication'

import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert, StatusBar, ActivityIndicator } from 'react-native';
import ButtonBack from '@components/header/button-back';

import { user_type,talent_seeker_category,talent_category } from '@api/response';

import { Colors } from '@themes/index';
// import FlatForm from '@styles/components/flat-form.style';
import FlatForm from '../../styles/components/flat-form.style'
import TagsSelect from '../../styles/components/tags-select.style';
import Utilities from '../../styles/extends/ultilities.style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BoxWrap from '../../styles/components/box-wrap.style';

import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style'

import _ from 'lodash'

import { postApi,putApi } from '@api/request';
import { UserHelper, StorageData, GoogleAnalyticsHelper } from '@helper/helper';


const dismissKeyboard = require('react-native-dismiss-keyboard');

function mapStateToProps(state) {
  // console.log(state)
  return {
    user: state.user,
    // navigation: state.navigation
  }
}

class WhatAreYou extends Component {

  constructor(props) {
    super(props);
    //your codes ....

    // this.selectedTag = this.selectedTag.bind(this);
    this.state = {
      user_type_select: '',
      joining: false,
      talent_cate : _.cloneDeep(talent_category),
      talent_seeker_cate : _.cloneDeep(talent_seeker_category),
      user_type_itemSelect: '',
      talent_flag:false,
      talent_seeker_flag: false,
    }    

    const { navigate, goBack, state } = this.props.navigation;
    //console.log('Who Are You (DATA) : ', state.params);
  }

  static navigationOptions = ({ navigation }) => ({
    headerVisible: true,
    headerLeft: <ButtonBack isGoBack={navigation} btnLabel="What best describes you?" />,
  });

  checkActiveTag = (item) => {
    // console.log(item);    
    return this.state.user_type_select.type == item.type;
  }

  selectedTag = (item) => {
    // console.log(item);
    this.setState({
      user_type_select: item
    })
  }

  checkActiveTalentoraTag = (item) => {
    return item.selected;
  }

  selectedTalentoraTag = (item, index) => {
      
      let _tmp = this.state.talent_cate;
      _tmp[index].selected=!_tmp[index].selected;
      this.setState({
          talent_cate: _tmp
      });
  }

  getTalentSelected = () => {
      // let _talentCate = this.state.talent_cate
      return _.filter(this.state.talent_cate, function(_item) { return _item.selected; });
  }

  checkActiveSeekerTag = (item) => {
    return item.selected;
  }

  selectedSeekerTag = (item, index) => {
      
      let _tmp = this.state.talent_seeker_cate;
      _tmp[index].selected=!_tmp[index].selected;
      this.setState({
          talent_seeker_cate: _tmp
      });

  }

  getTalentSeekerSelected = () => {
      // let _talentCate = this.state.talent_cate
      return _.filter(this.state.talent_seeker_cate, function(_item) { return _item.selected; });
  }

  continue() {
    // Alert.alert('login now');
    // dismissKeyboard();

    let talent_selected_category = this.getTalentSelected();
    let talent_selected_seeker_category = this.getTalentSeekerSelected();

    if (!this.state.user_type_select.role) {
      Alert.alert('Please select one type');
      return;
    };

    if (talent_selected_category.concat(talent_selected_seeker_category).length <= 0) {
      Alert.alert('Please choose at least one type');
      return;
    }

    if (!this.state.joining) {

      const { navigate, goBack, state } = this.props.navigation;    

      // merge info from who-are-you signup info
      var signUpInfo = _.extend({
        talent_type: this.state.user_type_select,
        talent_category: talent_selected_category.concat(talent_selected_seeker_category),        
      }, state.params ? state.params.sign_up_info : {});
      
      this.setState({
        joining: true
      });

      // **** pls dont fucking delete my beauty code. !! get out of my code ****

      console.log('Role : ', this.state.user_type_select.role);

      let that = this;

      let API_URL = '/api/users/me/roles/change';      

      postApi(API_URL,
        JSON.stringify({
          "role": that.state.user_type_select.role
        })
      ).then((response) => {
        console.log('Response Object: ', response);
        if (response.status == "success") {
          // console.log('Response Object: ', response);
          // that._saveUserData(response);

          let _result = response.result;

          let _userData = StorageData._saveUserData('SignUpProcess', JSON.stringify(_result));
          UserHelper.UserInfo = _result; // assign for tmp user obj for helper
          _userData.then(function (result) {
            console.log('complete save sign up process 2');
          });

          let API_URL1 = '/api/users/me/customs';

          let talentCateStringArray = _.map(signUpInfo.talent_category, function (v, k) {
            return v.category;
          });

          // console.log('talentCateStringArray : ',talentCateStringArray);

          putApi(API_URL1,
            JSON.stringify({
              "kind": {
                "value": talentCateStringArray,
                "type": "register-category",
                "privacy_type": "only-me"
              },
            })
          ).then((response) => {
            console.log('Response Object: ', response);
            if (response.status == "success") {
              let _result = response.result;
              let _userData = StorageData._saveUserData('SignUpProcess', JSON.stringify(_result));
              UserHelper.UserInfo = _result; // assign for tmp user obj for helper
              _userData.then(function (result) {
                // console.log('complete save sign up process 3'); 
              });
            }            
          })
          
          navigate('UploadPhoto', { sign_up_info: signUpInfo });
          // if (that.state.user_type_select) {
          //   if (that.state.user_type_select.type == 'talent-seeker')
          //     navigate('TalentSeekerCategory', { sign_up_info: signUpInfo });
          //   else
          //     navigate('TalentCategory', { sign_up_info: signUpInfo });
          // }

        }
        that.setState({
          joining: false
        });
      });
    }
  }

  componentDidMount() {
    GoogleAnalyticsHelper._trackScreenView('Sign Up - Who Are You');
  }
  
  render() {
    const selectedTagTitle = '';
    return (

      <View style={[styles.container, styles.mainScreenBg, styles.paddingTopNav]}>
        {/*<StatusBar barStyle="light-content" />*/}

        <View style={[styles.mainPadding]}>

          {/* <Text style={[styles.blackText, styles.btFontSize]}>
                        Who are you?
                    </Text> */}

          {/*<Text style={[styles.grayLessText, styles.marginTopXS]}>
                        You may only select one. This can be easily changed later in your account settings.
                    </Text>*/}
          {/* <Text style={[styles.grayLessText, styles.marginTopXS]}>
                        You may only select one. 
                    </Text> */}

          <View style={[styles.detailTagContainer, styles.marginTopSM]}>
            {user_type.map((item, index) => {
              {/*console.log(item);*/ }
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  style={[styles.boxWrapItem, styles.myWrapWhoAreYou, this.checkActiveTag(item) && styles.tagsSelected]}
                  onPress={() => this.selectedTag(item)}
                >
                  <Text style={[styles.tagTitle, styles.btFontSize, this.checkActiveTag(item) && styles.tagTitleSelected]}>
                    {item.display_name}
                  </Text>
                  <View style={[styles.absoluteBox1, { backgroundColor: 'transparent' }, this.checkActiveTag(item) && styles.tagDetailSelected]}>
                    <View style={[styles.tagStatusContainer, styles.mainHorizontalPadding,{alignItems:'center'}]}>                 
                      <Text style={[styles.grayLessText, styles.marginTopXS]}>
                        {item.display_name === 'Talent'?'Can apply jobs':'Can post jobs'}                        
                      </Text>
                    </View>
                  </View>

                  {this.checkActiveTag(item) && (

                    <View style={[styles.absoluteBox, { backgroundColor: 'transparent' }]}>
                      <View style={[styles.tagStatusContainer, styles.mainHorizontalPadding]}>
                        <Icon
                          name="check"
                          style={[styles.iconCheck]}
                        />
                        <Text style={[styles.tagSelectStatus]}>
                          Selected
                        </Text>
                      </View>
                    </View>
                  )
                }
                </TouchableOpacity>
              )
            })}

          </View>

          <View style={[styles.itemTagContainer, {marginTop:250}]}>
            <Text style={[styles.blackText, styles.btFontSize]}>
              What are your Profession?
            </Text>
            <Text style={[styles.grayLessText, styles.marginTopXS]}>
              You may select more than one option.
            </Text>

            <View style={[styles.tagContainerNormal,styles.marginTopMD]}> 
              {this.state.talent_cate.map((item, index) => {
                  return (
                    <TouchableOpacity
                        activeOpacity = {0.9}
                        key={ index } 
                        style={[styles.tagsSelectNormal, this.checkActiveTalentoraTag(item) && styles.tagsSelected]} 
                        onPress={ () => this.selectedTalentoraTag(item, index) }
                    >
                        <Text style={[styles.tagTitle, styles.btFontSize, this.checkActiveTalentoraTag(item) && styles.tagTitleSelected]}>
                            {item.display_name}
                            {item.selected}
                        </Text>                        
                    </TouchableOpacity>
                  )
              })}

                {this.state.talent_seeker_cate.map((item, index) => {
                  return (
                      <TouchableOpacity
                          activeOpacity = {0.9}
                          key={ index } 
                          style={[styles.tagsSelectNormal, this.checkActiveSeekerTag(item) && styles.tagsSelected]} 
                          onPress={ () => this.selectedSeekerTag(item, index) }
                      >
                          <Text style={[styles.tagTitle, styles.btFontSize, this.checkActiveSeekerTag(item) && styles.tagTitleSelected]}>
                              {item.display_name}

                              {item.selected}
                          </Text>
                          
                      </TouchableOpacity>     
                  )
                })}
            </View>
          </View>

        </View>        

        <View style={styles.absoluteBox}>
          <View style={[styles.txtContainer, styles.mainHorizontalPadding]}>

            <TouchableOpacity style={[styles.flatButton]} onPress={() => this.continue()}>
              {
                !this.state.joining ? <Text style={[styles.btn, styles.btFontSize]}>Continue</Text> : <ActivityIndicator color="white" animating={true} />
              }
            </TouchableOpacity>

          </View>
        </View>

      </View>
    );
  }
}


var styles = StyleSheet.create({
  ...FlatForm, ...Utilities, ...TagsSelect, ...BoxWrap,
  container: {
    flex: 1,
    // padding: 20
  },

  btn: {
    textAlign: 'center',
    color: "white",
    fontWeight: "700",
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
    alignItems: 'stretch'
  },

});

export default connect(mapStateToProps, AuthActions)(WhatAreYou)
