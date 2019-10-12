import React, { Component} from 'react'
import { connect } from 'react-redux'

// import {
//     addNavigationHelpers
// } from 'react-navigation';

import * as AuthActions from '@actions/authentication'

import AllJobPosted from '@components/job/talent-seeker/post-job-list' // for talent seeker (employer)
import AvailableJobApplied from '@navigators/tabs/job-tabs' // for talent (user)

import { StyleSheet, Text, View, AsyncStorage, Alert, TouchableOpacity,ScrollView, TextInput, Modal,Picker } from 'react-native';
import { transparentHeaderStyle, defaultHeaderStyle } from '@styles/components/transparentHeader.style';

import Authenticate from '@components/authentication/authenticate';
import LoadingScreen from '@components/other/loading-screen'; 
import OneSignal from 'react-native-onesignal'; 

import { UserHelper, StorageData, Helper } from '@helper/helper';

import _ from 'lodash'
import { Colors } from '@themes/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import BoxStyles from '@styles/components/box-wrap.style';
import BoxWrap from '@styles/components/box-wrap.style';
import TagsSelect from '@styles/components/tags-select.style';
import FlatForm from '@styles/components/flat-form.style';

import Tabs from '@styles/tab.style';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '@components/header/button-right'
import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'

import { talent_category } from '@api/response';
import { talent_seeker_category} from '@api/response';
import { ethnicities, hair_colors, eye_colors, languages, ages,heights,weights } from '@api/response'

import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import MinMaxPicker from '@components/ui/minMaxPicker';
import ALL_COUNTRIES from '@store/data/cca2';

// import AvailableJob from '@components/job/talent/available-job'
// import AppliedJob from '@components/job/talent/applied-job'

// var ScrollableTabView = require('react-native-scrollable-tab-view'); 

// import ScrollableTabView, {DefaultTabBar } from 'react-native-scrollable-tab-view';

let _SELF = null;
let originalLanguage = _.cloneDeep(languages);
const Item = Picker.Item;
class filters extends Component {

    constructor(props){
        super(props);
        //your codes ....
        let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
        const userCountryData = getAllCountries();
        let callingCode = null;
        let name = null;
        let cca2 = userLocaleCountryCode;
        if (!cca2 || !name || !userCountryData) {
            // cca2 = 'US';
            // name = 'United States';
            // callingCode = '1';
        } else {
            callingCode = userCountryData.callingCode;
        }
        this.state = {  
            selectedTab: 0,
            talent_cate : _.cloneDeep(talent_category),
            age:{
                val:''
            },
            gender:{
                val:''
            },
            myheight:{
                val:''
            },
            myweight:{
                val:''
            },
            hair_color:UserHelper.UserInfo.profile.attributes.hair_color.value,
            myhaircolor:{
                val:UserHelper.UserInfo.profile.attributes.hair_color.value || ''
            },
            eye_color:UserHelper.UserInfo.profile.attributes.eye_color.value,
            myeyecolor:{
                val:UserHelper.UserInfo.profile.attributes.eye_color.value || ''
            },
            cca2,
            name,
            callingCode,
            country: {
                val: '',
                langCode: UserHelper.UserInfo.profile.country_code,
                callingCode: '',
                isErrRequired: false
            },
            languages: originalLanguage,       
            selectedLanguages:UserHelper.UserInfo.profile.attributes.language.value,
            displayLanguages: UserHelper.UserInfo.profile.attributes.language.value,
            selectedLanguagesCount: 0,
            ethnicityModalVisible: false,
            languageModalVisible: false,
            ageModalVisible:false,
            hairModalVisible: false,
            eyeModalVisible: false,
            genderModalVisible: false, 
            selectedGender: 'B'||'',
            mode: Picker.MODE_DIALOG,  
            prevoius_gender:'', 
            selectedEthnicity  : '', 

        }
    }

    static navigationOptions = ({ navigation }) => {
        // console.log('navigation : ', navigation);
        _SELF = navigation;
        // console.log('_SELF NAV: ',_SELF);
        return ({
            headerStyle: defaultHeaderStyle,  
            // headerTitleStyle :{textAlign: 'center',alignSelf:'center'}, 
            // headerVisible: true,
            // headerTitle: UserHelper._isEmployer() ? 'Posted Jobs' : 'Jobs',
            headerTitle: 'Filters',
            headerLeft: (<ButtonBack
            isGoBack={ navigation }
            btnLabel= ""
        />),
            headerRight: UserHelper._isEmployer() ? (
                
                <View style={[styles.flexVerMenu, styles.flexCenter]}>

                    <ButtonRight
                        text={"Clear Filters"}
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        // to="CreatePostJob"
                    />

                </View>
            ) : null,
        })};

    componentDidMount() {
        let res=UserHelper.UserInfo.profile.attributes.kind.value;
        let talentType=res.split(",");
        let tmp = [];
        _.each(_.cloneDeep(this.state.talent_cate), function(v,k){
            // if(v.category == talentType)
            _.each(talentType, function(v_sub, k_sub){
                if(v.category == v_sub){
                    v.selected = true;
                }
            })
            tmp.push(v);
        })
        this.setState({
            talent_cate:tmp
        },function(){
            // console.log("ORIGIAL LANGUAGE",originalLanguage);
            // console.log("Language",this.state.languages)
            console.log("ComponetDidMount Selected Gender",this.state.selectedGender);
        })

    }

    onTabPress = (_tabIndex) => {
        this.setState({
            selectedTab: _tabIndex,
        })
    }
    selectedTalentTag = (item, index) => {
        
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
    checkTalentActiveTag = (item) => {
        return item.selected;
    }
    checkColorCountryInput = () => {
        // console.log(this.state.country);
        if(this.state.country.val == '')
            return 'black';
        else if(this.state.country.isErrRequired){
            return 'red';
        }
        else{
            return Colors.textBlack;
        }
    }   
    languageSelect = (item, index) => {
        console.log("LANGUAGE FIELD CONSOLE",this.state.languages);
        let temp = this.state.languages;
        temp[index].selected = !temp[index].selected;
        // console.log('This is data: ', this.state.languages);
        
        let selectedCount = [];
        _.map(originalLanguage, function(val){
            if(val.selected)
                selectedCount.push(val);
        });
        console.log("selected count",selectedCount);
        if(selectedCount.length <= 3){
            // console.log('Filter for true object: ', selectedCount.length);
            let displayLanguages;
            _.map(selectedCount, function(val, key){
                displayLanguages = key == 0 ? val.display_name : displayLanguages + ',' + val.display_name;
            });
            
            this.setState({
                languages : temp,
                selectedLanguagesCount : selectedCount.length,
                selectedLanguages: displayLanguages,
                displayLanguages: displayLanguages.replace(/,/g, ', ')
            });
            
        }else{
            temp[index].selected = !temp[index].selected;
            this.setState({languages : temp});
            Alert.alert('You can select three languages only')
        }
    }

    onLanguageSearch(text){
        let _dataFilter = _.filter(originalLanguage, function(v,k){
            return _.includes(v.display_name.toLowerCase(), text.toLowerCase());
        })
        this.setState({languages:_dataFilter})

        // console.log('Languages: ', languages)
        // console.log('Original Lang: ', originalLanguage);
        // console.log('Filter Lang: ', _dataFilter);
    }  
    
    generateLanguageList(){
        return(
            <Modal
                visible = {this.state.languageModalVisible}>
                <View style={[ styles.justFlexContainer, styles.mainVerticalPadding, {paddingBottom:0}]}>

                    <View style={[styles.languageNav ]} >
                        <TouchableOpacity style={[{ flex:1 }]} 
                        onPress = {() => {
                            this.setModalVisible(false, 'language')
                            this.setState({languages:originalLanguage});
                        }}>
                            <Icon name={"close"} style={[ styles.languageNavIcon ]} />
                        </TouchableOpacity>
                        
                        <Text style={[ styles.languageNavTitle ]} >Language</Text>
                        <Text style={[ styles.languageNavStatus ]} >{this.state.selectedLanguagesCount} /3 selected</Text>
                    </View>

                    <View style={[styles.mainHorizontalPadding, {marginTop: 20}]}>
                        <TextInput
                            style={{marginBottom:7, height: 30, borderColor:Colors.componentBackgroundColor, borderRadius:5,textAlign:'center', backgroundColor:Colors.componentBackgroundColor,borderWidth: 1}}
                            onChangeText={(text) => this.onLanguageSearch(text)}
                            value={this.state.text}
                            placeholder="Search"
                        />
                    </View>
                    <ScrollView contentContainerStyle={[styles.mainVerticalPadding, styles.mainHorizontalPadding ]}>
                        {this.state.languages.map((lang, idx) => {
                            return (
                                <View key={idx} >
                                    {/*{console.log('Item ZIN: ', lang, idx)}*/}
                                    {/* {when search first time click on the row is not work cus not yet lost focus from text input */}
                                    <TouchableOpacity onPress={() => this.languageSelect(lang, idx) } activeOpacity={.8}
                                        style={[ styles.flexVer, styles.rowNormal, {justifyContent:'space-between'}]}>
                                        <Text style={[ styles.itemText, {paddingTop: 7, paddingBottom:7, 
                                            color: lang.selected ? 'red' : 'black'} ]}>   
                                            { lang.display_name }
                                        </Text>
                                        {lang.selected && <Icon name={"done"} style={[ styles.itemIcon, 3, {color:'red' }]} /> }
                                    </TouchableOpacity>
                                    <View style={[{borderWidth:1,borderColor:Colors.componentBackgroundColor}]}></View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
            </Modal>  
        )
    }
    generatePicker(itemObject, type){
        return(
            <View style={[styles.justFlexContainer]}>
                { Helper._isAndroid()  && 
                    <View style = {styles.itemPicker}>
                        <Picker
                            selectedValue={this.state.selectedEthnicity}
                            onValueChange={(item) => this.onEthnicityChange(item)}>
                            <Item label="Male" value="Male" color={ this.state.selectedEthnicity == 'Male' ? '#4a4a4a':'#9B9B9B'} />
                            <Item label="Female" value="Female" color={ this.state.selectedEthnicity == 'Female' ? '#4a4a4a':'#9B9B9B'} />
                        </Picker>
                    </View>
                } 

                { Helper._isIOS()  && 
                    <View> 
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={ type == 'ethnicity' ? this.state.ethnicityModalVisible : 
                            (type == 'hair' ? this.state.hairModalVisible : this.state.eyeModalVisible)}
                            onRequestClose={() => {alert("Modal has been closed.")}} >

                            <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
                                <View style = {styles.pickerTitleContainer}>
                                    <Text style={[styles.fontBold, {textAlign: 'left', color: '#4a4a4a', padding:10, left: 10} ]}>Select {type == 'ethnicity' ? type : type + ' color'} </Text>
                                <TouchableOpacity activeOpacity = {0.8}
                                    style={[ {backgroundColor: Colors.componentDarkBackgroundColor, position:'absolute', padding:10, right:10} ]}
                                    onPress={() => {
                                        this.setModalVisible(false, type)
                                    }}>
                                    <Text style={[styles.fontBold, {textAlign: 'right', color: '#3b5998'} ]}>Done</Text>
                                </TouchableOpacity>
                                </View>
                                <View style={[ {backgroundColor: 'white'} ]}>
                                    <Picker
                                        selectedValue={ type == 'ethnicity' ? this.state.selectedEthnicity :
                                            (type == 'hair' ? this.state.myhaircolor.val : this.state.myeyecolor.val)}
                                        onValueChange={(item) => this.onPickerChange(item, type)}>
                                        {
                                            itemObject.map((item, index) => {
                                                return(
                                                    <Item key={index} label={item.display_name} value={item.display_name} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(true, type)
                                let val = type == 'ethnicity' ? this.state.selectedEthnicity : 
                                (type == 'hair' ? this.state.myhaircolor.val : this.state.myeyecolor.val);
                                if(val == '')
                                    this.onPickerChange(itemObject[0].display_name, type);
                            }}>
                            <View style = {styles.itemPicker}>
                                {
                                    type == 'ethnicity' && 
                                    <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color:'black'}]}>{ this.state.selectedEthnicity || 'Select ethnicity' }</Text>
                                }

                                {
                                    type == 'hair' && 
                                    <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color: 'black'}]}>{ this.state.myhaircolor.val || 'Select hair color' }</Text>
                                }

                                {
                                    type == 'eye' && 
                                    <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color:'black'}]}>{ this.state.myeyecolor.val || 'Select eye color' }</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }    

    setModalVisible(visible, type) {
        if(type == 'ethnicity'){
            this.setState({ethnicityModalVisible: visible})
        }else if(type == 'hair'){
            this.setState({hairModalVisible: visible})
        }else if(type == 'eye'){
            this.setState({eyeModalVisible: visible})
        }else if(type == 'language'){
            this.setState({languageModalVisible: visible})
        }else if(type == 'gender'){
            this.setState({genderModalVisible: visible})
        }
    }
    onValueChange = (key, value) => {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    };
    onPickerChange(text, type){
        if(type == 'ethnicity'){
            this.setState({selectedEthnicity: text})
        }else if(type == 'hair'){
            this.setState({myhaircolor:{
                val:text
            }})
        }else if(type == 'eye'){
            this.setState({myeyecolor:{
                val:text
            }})
        }
    }  

    onEthnicityChange(text){
        // console.log('Ethnicity: ', text);
        this.setState({selectedEthnicity: text})
    }  
    onHeightChanged(text){
        let reSing=/^[0-9]{0,3}$/;
        if(reSing.test(text)){
            this.setState({ height:text })
        }
    }

    onWeightChanged(text){
        let reSing=/^[0-9]{0,3}$/;
        if(reSing.test(text)){
            this.setState({ myweight: {val:text} })
        }
    }
    applyFilter =()=>{
        console.log("Apply Filter selectedGender",this.state);
    }   
    onPickerChangeValue =(value,type) =>{
        if(type=="age"){
            this.setState({
                age:{
                    val:value
                }
            },function(){
                console.log("Object AGE State",this.state.age);
            })
        }
        if(type=="height"){
            this.setState({
                myheight:{
                    val:value
                }
            },function(){
                console.log("Object HEIGHT State",this.state.myheight)
            })
        }
        if(type=="weight"){
            this.setState({
                myweight:{
                    val:value
                }
            },function(){
                console.log("Object WEIGHT State",this.state.myweight)
            })
        }
    }

    render() {
        // console.log(this.props.user, this.state.userData);
         const { navigate, goBack } = this.props.navigation;

            return (
                <View style={{flex:1, backgroundColor:'white'}}>
                    <View style={{flexDirection:'row', marginTop:30, paddingLeft:20, paddingBottom:20, marginBottom:1,borderBottomWidth:1,borderBottomColor:'grey'}}>
                        <TouchableOpacity
                            onPress={() => goBack()}
                            activeOpacity={.8}>
                            <Icon name={'close'}
                                style={{fontSize:20}} />
                        </TouchableOpacity>
                        <Text style={{flex:1, textAlign:'center', fontSize:16, fontWeight:'bold'}}>
                            Filters
                        </Text>
                        <TouchableOpacity>
                            <Text>Clear Filters</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={[styles.mainPadding,{marginVertical:10}]}>
                            <Text style={[{fontSize:15,fontWeight:'bold'}]}>Select talent types</Text>
                            <View style={[styles.tagContainerNormal, styles.marginTopSM]}> 
                                {this.state.talent_cate.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[{backgroundColor:Colors.componentBackgroundColor},styles.tagsSelectNormal, this.checkTalentActiveTag(item) && styles.tagsSelected]} 
                                            onPress={ () => this.selectedTalentTag(item, index) }
                                        >
                                            <Text style={[styles.tagTitle, styles.btFontSize, this.checkTalentActiveTag(item) && styles.tagTitleSelected]}>
                                                {item.display_name}

                                                {item.selected}
                                            </Text>
                                            
                                        </TouchableOpacity>     
                                    )
                                })}   
                            </View>    
                            <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={(event) => { this.refs.ThirdInput.focus();}}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Age</Text>
                                    <MinMaxPicker onPickerChangeValue={this.onPickerChangeValue} myData={ages} type="age"/>
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={(event) => { this.refs.FourthInput.focus();}}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Gender</Text>
                                    <View> 
                                        <Modal
                                            animationType={"slide"}
                                            transparent={true}
                                            visible={this.state.genderModalVisible}
                                            onRequestClose={() => {alert("Modal has been closed.")}} >

                                            <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
                                                <TouchableOpacity
                                                    style={[ {backgroundColor: Colors.componentDarkBackgroundColor, padding: 15} ]}
                                                    onPress={() => {
                                                        this.setModalVisible(!this.state.genderModalVisible, 'gender')
                                                    }}>
                                                    <Text style={[styles.fontBold, {textAlign: 'right', color: '#3b5998'} ]} >Done</Text>
                                                </TouchableOpacity>
                                                <View style={[ {backgroundColor: 'white'} ]}>
                                                    <Picker
                                                        selectedValue={this.state.selectedGender}
                                                        onValueChange={this.onValueChange.bind(this, 'selectedGender')}>
                                                        <Item label="Both" value="B"/>
                                                        <Item label="Male" value="M" /> 
                                                        <Item label="Female" value="F" />
                                                    </Picker>
                                                </View>
                                            </View>
                                        </Modal>

                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setModalVisible(true, 'gender')
                                            }}>
                                            <View style = {styles.genderPicker}>
                                                <Text style={[ styles.flatInputBoxFont, {color: this.state.gender.isErrRequired ? 'red': '#B9B9B9'} , !_.isEmpty(this.state.selectedGender) && {color: 'black'}  ]}>{ Helper._getGenderLabel(this.state.selectedGender)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={(event) => { this.refs.FifthInput.focus();}}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Country</Text>
                                    <CountryPicker
                                        countryList={ALL_COUNTRIES}
                                        closeable = {true}
                                        filterable = {true}
                                        onChange={(value)=> {
                                            this.setState({
                                                phone: {
                                                    val: ''
                                                }
                                            });
                                            {/*this.setState({cca2: value.cca2, name: value.name, callingCode: value.callingCode});*/}
                                            this.setState({
                                                country: {
                                                    val: value.name,
                                                    langCode: value.cca2,
                                                    callingCode: value.callingCode,
                                                    isErrRequired: false
                                                }
                                            });
                                            // console.log('onChange', value);
                                        }}
                                        cca2={this.state.cca2}
                                        translation='eng' >

                                        <View style = {styles.countryPicker} >     
                                            <Text style={[ {fontSize: 17, color:  this.checkColorCountryInput() } ]}> { this.state.country.val || 'Country' } </Text>
                                        </View>
                                    </CountryPicker>
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View> 
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Ethnicity</Text>
                                    {this.generatePicker(ethnicities, 'ethnicity')}
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View> 
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={() => this.setModalVisible(true, 'language')}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Language</Text>
                                    <View style = {styles.itemPicker}>
                                        <Text style={[ styles.flatInputBoxFont, {color:'black'}]}>{ this.state.displayLanguages || 'Select languages' }</Text>
                                    </View>
                                </TouchableOpacity>
                                {this.generateLanguageList()}
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>  
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={(event) => { this.refs.FourthInput.focus();}}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Height</Text>
                                    <MinMaxPicker onPickerChangeValue={this.onPickerChangeValue} myData={heights} type="height"/>
                                    <Text style={{fontSize:16}}> cm</Text>
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9} onPress={(event) => { this.refs.NinethInput.focus();}}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Weight</Text>
                                    <MinMaxPicker onPickerChangeValue={this.onPickerChangeValue} myData={weights} type="weight"/>
                                    <Text style={{fontSize:16}}> kg</Text>
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>       
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Hair color</Text>
                                    {this.generatePicker(hair_colors, 'hair')}
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>    
                            <View style={[{flex:1}]}>
                                <TouchableOpacity style={[{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}]} activeOpacity = {0.9}>
                                    <Text style={[styles.titleBold,{flex:0.3}]}>Eyes color</Text>
                                    {this.generatePicker(eye_colors, 'eye')}
                                </TouchableOpacity>
                                <View style={[{marginVertical:15,borderColor: Colors.componentBackgroundColor, borderWidth: 1}]} />
                            </View>   
                        </View>
                        <View style={[styles.absoluteBox,{marginBottom:20, position: 'relative', backgroundColor: 'transparent',paddingVertical:0}]}>
                            <View style={[styles.txtContainer,styles.mainHorizontalPadding]}>

                            <TouchableOpacity style={[styles.btnContainer]} onPress={() => this.applyFilter()}>
                                
                                    {   
                                        !this.state.isLoading ? <Text style={styles.btn}>Apply Filters</Text> : <ActivityIndicator color="white" animating={true} /> 
                                    }
                                
                            </TouchableOpacity>

                            </View>
                        </View> 
                    </ScrollView>
                    
                </View>
            
            );

        
    }
}

function mapStateToProps(state) {
    // console.log('main state',state);
    return {
        // user: state.user,
        // navigation: state.navigation,
        // nav: state.navigation
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...Tabs, ...FlatForm, ...TagsSelect, ...BoxWrap,
    txtContainer: {
        flex:1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch'
    },
    btn: {
        textAlign: 'center',
        color: "white",
        fontWeight: "700",
    },
    btnContainer: {
        backgroundColor: Colors.buttonColor,
        paddingVertical: 15,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.buttonColor
    },
    titleBold:{
        fontWeight:'bold'
    },
    inputBox:{
        flex:0.6,
        textAlign:'right',
        paddingVertical: 0
    },
    itemPicker:{
        backgroundColor: 'transparent',
        borderRadius: 5,  
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch',
        paddingLeft: 10,
        minHeight:20
    },
    pickerTitleContainer:{
        flexDirection: 'row',
        backgroundColor: Colors.componentDarkBackgroundColor,
        height: 35,
    },
    languageNav:{
        flexDirection : 'row', 
        height : 50, 
        paddingBottom: 15, 
        paddingTop: 15, 
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 3,
        shadowOpacity: 0.2
    },
    languageNavIcon:{
         color:'black',
         fontSize: 20,
         backgroundColor: 'transparent',
         left: 17
    },
    languageNavTitle:{
        flex: 1,
        // backgroundColor: 'yellow',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    languageNavStatus:{
        flex: 1,
        // backgroundColor: 'red',
        textAlign: 'right',
        right: 17,
        fontSize: 15,
        color: 'red'
    }
})

export default connect(mapStateToProps, AuthActions)(filters)
