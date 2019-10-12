import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, ActivityIndicator,
    TouchableWithoutFeedback, Image, StatusBar, Alert, Picker, Platform, Modal, ActionSheetIOS } from 'react-native';

import { talent_category } from '@api/response';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@themes/index';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';
import BoxWrap from '@styles/components/box-wrap.style';
import Utilities from '@styles/extends/ultilities.style'; 

// import ButtonRight from '@components/header/button-right'
import ButtonTextRight from '@components/header/button-text-right'
// import ButtonLeft from '@components/header/button-left'
import ButtonBack from '@components/header/button-back'

import ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { postApi, postMedia, putApi } from '@api/request';
import * as DetailActions from '@actions/detail'
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
// import DeviceInfo from 'react-native-device-info';
import ALL_COUNTRIES from '@store/data/cca2';
import _ from 'lodash' 
import { UserHelper, StorageData, Helper } from '@helper/helper';
let func = require('@helper/validate');

let options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


var BUTTONS = [
  'Delete',
  'Cancel',
];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

let that;

const Item = Picker.Item;

function mapStateToProps(state) {
    return {
        // detail: state.detail
        user: state.user,
    }
}

let _SELF = null;
const ICON_SIZE_ANDROID = 24;
const JOB_INFO = null;
const IMAGE_REF = null;



class CreatePostJob extends Component {

    constructor(props){
        super(props);

        // console.log('talent_category: ', talent_category);  
        console.log('This is props: ', this.props);
        if(this.props.navigation.state.params.Job_Info){
            JOB_INFO=this.props.navigation.state.params.Job_Info.sub_reference_detail;
            if(this.props.navigation.state.params.Job_Info.reference_detail.length > 0)
                IMAGE_REF=this.props.navigation.state.params.Job_Info.reference_detail[0];
        }
        let job_info = {
            'title': JOB_INFO?JOB_INFO.title:'',
            'country': '',
            'gender': JOB_INFO?JOB_INFO.criteria.gender:'',
            'fromAge': JOB_INFO?JOB_INFO.criteria.min_age:'',
            'toAge': JOB_INFO?JOB_INFO.criteria.max_age:'',
            'description': JOB_INFO?JOB_INFO.description:'',
            'talent_cate': talent_category,
            'img': IMAGE_REF?[{id:this.props.navigation.state.params.Job_Info._id,uri:IMAGE_REF.preview_url_link}]:[]
        }

        if(this.props.navigation.state.params){
            // if(this.props.navigation.state.params.Job_Info){
            //     //console.log("There is job info, is editing true");
            //     job_info.title = this.props.navigation.state.params.Job_Info.sub_reference_detail.title;
            //     // job_info.country = this.props.navigation.state.params.Job_Info.sub_reference_detail
            //     job_info.gender = this.props.navigation.state.params.Job_Info.sub_reference_detail.criteria.gender;
            //     job_info.fromAge = this.props.navigation.state.params.Job_Info.sub_reference_detail.min_age;
            //     job_info.toAge = this.props.navigation.state.params.Job_Info.sub_reference_detail.max_age;
            //     job_info.description = this.props.navigation.state.params.Job_Info.sub_reference_detail.description;
            //     job_info.talent_cate = this.props.navigation.state.params.Job_Info.sub_reference_detail.type;
            // }
            // else{
            //     console.log("There isn't job info. Create New Job");
            // }
        }

        // _.each(talent_category, function(v,k){
        //     v.selected = false;
        // })

        if(JOB_INFO){
            for(let i = 0; i < job_info.talent_cate.length; i++){
                for(let j = 0; j < JOB_INFO.criteria.type.length; j++){
                    if(job_info.talent_cate[i].category === JOB_INFO.criteria.type[j]){
                        job_info.talent_cate[i].selected = true;
                        break;
                    }
                }
            }
        }

        that = this;
        this.state = {

            isLoading: false,
            isEditing: false,

            talent_cate : job_info.talent_cate,
            cca2: '',
            country: {
                val: job_info.country,
                isErrRequired: false
            },
            img: job_info.img,
            idx: IMAGE_REF?1:0, 
            age:{
                val: job_info.fromAge,
                isErrRequired:false
            },
            toAge: job_info.toAge,
            title:{
                val: job_info.title,
                isErrRequired:false
            },
            gender: {
                val: job_info.gender,
                isErrRequired: false
            }, 
            description: job_info.description,
            selectedGender: JOB_INFO?JOB_INFO.criteria.gender:'',
            mode: Picker.MODE_DIALOG,
            modalVisible: false,
            prevoius_gender:'' ,
            is_api_requesting: false 
        }
    }
    
    static navigationOptions = ({ navigation }) => {
        // console.log('my self: ', screenProps);
        // _SELF = this;
        return ({
        headerTitle: 'Job Posting',
        headerLeft: (<ButtonBack
                isGoBack={ navigation }
                btnLabel= ""
            />),
            /*headerRight: (<ButtonTextRight  
                    callBack={ navigation.state.params }
                    btnLabel= "Save"
                />),*/
        // });
        headerRight1: (<ButtonTextRight  
            callBack={ _SELF }
            btnLabel= "Save"
        />),

        headerRight_org: (
            <View style={[styles.flexVerMenu, styles.flexCenter]}>
                {/*<Text style={[styles.txt]}>Save</Text>*/}
                 {/*{ console.log('_SELF dddd :', UserHelper.UserInfo) }*/}
                
                <TouchableOpacity 
                    style={[{ marginRight: 15 }]}
                    onPress={ () => {
                        // console.log('_SELF', navigation);
                        _SELF.saveJob();
                    }}
                >
                
                    { navigation.state.params && navigation.state.params.isLoadingOnHeader ?
                        <ActivityIndicator
                            animating={true}
                            style={[  ]}
                            size="small"
                            color="gray"
                        />
                        :
                        <Text style={[styles.txt]}>{ navigation.state.params && navigation.state.params.isEditing ? 'Edit' : 'Save' }</Text>
                    }
                </TouchableOpacity>
            </View>
        ),
    })};

  
    componentDidMount() {
        _SELF = this;
    }

    checkColorCountryInput = () => {
        // console.log("CheckColorCountryInput", this.state.country);
        // console.log(this.state.country.isErrRequired);
        this.mycolor='';
        if(this.state.country.val == '')
            this.mycolor='#B9B9B9';
        else if(this.state.country.isErrRequired){ 
            this.mycolor='red';
        } 
        else{
            this.mycolor= Colors.textBlack;    
        }
        return this.mycolor;
    }    

    savePostJob = (job_info) => {  
        // Alert.alert('wow !!! save it now');
        const { navigate, goBack, state } = this.props.navigation;
        // console.log('This is my navigation vol vol: ', this.props.navigation);
        navigate('ViewPostJob', {job: job_info, backToJobList: true});
        // navigate('JobList');
    }

    checkActiveTag = (item) => {
        return item.selected;
    }

    selectedTag = (item, index) => {
        let _tmp = this.state.talent_cate;
        _tmp[index].selected = !_tmp[index].selected;
        this.setState({
            talent_cate: _tmp
        });
    }

    _postJob = () => {

        // that.savePostJob({'job':'job'});
        // return;

        if(that.state.is_api_requesting) return;

        let requiredField = false;
        // console.log('required Field: ', requiredField);
        
        // if(!func(this.state.title))
        //     requiredField = false;
        // else requiredField = true;
        // console.log('required Field: ', requiredField, this.state.title);

        if(func(this.state.title, 'title')){
            let _tmp = this.state.title;
            _tmp.isErrRequired = true;
            this.setState({
                title:_tmp
            })
            requiredField = true;
        }
        // console.log('required title: ', requiredField, this.state.title.val);

        if(func(this.state.country, 'country')){
            let _tmp = this.state.country;
            _tmp.isErrRequired= true;
            this.setState({
                country: _tmp
            });
            requiredField = true;
        }
        // console.log('required country: ', requiredField, this.state.country.val);

        if(this.state.selectedGender == 'Please select gender *' || 
            this.state.selectedGender == ''){ 
            this.setState({
                gender: {
                    val: "",
                    isErrRequired : true
                }    
            });
            requiredField = true;

        }else{
            let _tmp = this.state.gender;
        
            _tmp.val= this.state.selectedGender;
            _tmp.isErrRequired= false;

            this.setState({
                selectedGender: _tmp.val,
                gender: _tmp,
                prevoius_gender: _tmp.val  
            }); 
            // console.log('Gender State : ',this.state);
        }
        // console.log('required gender: ', requiredField, this.state.gender.val);

        if(func(this.state.age, 'age')){
            let _tmp = this.state.age;
            _tmp.isErrRequired = true;
            this.setState({
                age:_tmp
            })
            requiredField = true;
        }
        // console.log('required age: ', requiredField, this.state.age.val);
        // console.log('required Field: ', requiredField);
        if(requiredField) return;


        // if(this.state.toAge == '')
        //     this.setState({ toAge: this.state.age.val });
        // else 
        if(this.state.toAge != ''){
            if (this.state.toAge < this.state.age.val){
                Alert.alert('To age should be greater than from age!');
                requiredField = true;
            }
        }
            
        // console.log('To age: ', this.state.toAge);
        if(requiredField) return;

        
        let selectedCategory = [];
        for(let i = 0; i < talent_category.length; i++){
            if(this.state.talent_cate[i].selected == true){
               selectedCategory.push(this.state.talent_cate[i].category);
            }
        }
        if(_.isEmpty(selectedCategory)){
             Alert.alert('You must select at least a talent type');
             requiredField = true;
        }
        if(requiredField) return;

        // console.log('requiredField', requiredField);

        that.setState({
            is_api_requesting: true
        })

        // return;
        setTimeout(function(){
            console.log('Job info: ' , that.state);
            // console.log('selected type: ', selectedCategory);

            let req_object = {
                "owner_type": "person",
                "owner": UserHelper.UserInfo._id,
                "post_type": "job",
                "references": [],
                "content": that.state.title.val, 
                "description": that.state.description,
                "criteria":{
                    "type": selectedCategory,
                    "company":that.state.company.val,
                    "gender": that.state.gender.val,
                    "min_age": that.state.age.val,
                    "max_age": that.state.toAge
                },
                "is_allow_forward": true,
                "privacy_type": "public",
                "status": "published",
                // "latitude": 14.28323,
                // "longitude": 104.29382
            }

            let post_job_url = '/api/posts';

            // console.log('Image : ', that.state.img);

            if(that.state.img.length > 0){
                let photo_url = '/api/media/photos/'+ that.state.img[0].img_uuid +'/save';
                let photo_obj = {name: 'image' , filename: that.state.img[0].filename, data: that.state.img[0].data, type:'image/foo'};
                // console.log('Photo Obj: ', that.state.img , 
                // "\n", "Filename: ", that.state.img[0].filename, 
                // "\n", "Data: ", that.state.img[0].data);

                postMedia(photo_url, [
                    photo_obj
                ]).then((response) => {
                    // console.log('Success upload image: ', response);
                    if(response.code == 200){

                        let imgReference = [];
                        imgReference.push(response.result._id);

                        req_object.references = imgReference;

                        postApi(post_job_url,
                            JSON.stringify(req_object)
                        ).then((response) => {
                            console.log('Response Posted Job: ', response);
                            if(response.code == 200){
                                // that.state.is_api_requesting = false;
                                that.setState({
                                    is_api_requesting: false
                                });

                                that.savePostJob(response.result);
                            }
                        });
                    }
                    // else{
                    //     that.setState({
                    //         is_api_requesting: false
                    //     })
                    // }
                });

            }else{
                postApi(post_job_url,
                    JSON.stringify(req_object)
                ).then((response) => {
                    console.log('Response Save Job: ', response);
                    if(response.status=="success"){
                        
                    }
                    that.state.is_api_requesting = false;
                });
            }

        }, 50);
    }

    _updateJob = () => {

        if(that.state.is_api_requesting) return;
        let requiredField = false;
        if(func(this.state.title, 'title')){
            let _tmp = this.state.title;
            _tmp.isErrRequired = true;
            this.setState({
                title:_tmp
            })
            requiredField = true;
        }
        if(func(this.state.country, 'country')){
            let _tmp = this.state.country;
            _tmp.isErrRequired= true;
            this.setState({
                country: _tmp
            });
            requiredField = true;
        }
        if(this.state.selectedGender == 'Please select gender *' || 
            this.state.selectedGender == ''){ 
            this.setState({
                gender: {
                    val: "",
                    isErrRequired : true
                }    
            });
            requiredField = true;
        }else{
            let _tmp = this.state.gender;
            _tmp.val= this.state.selectedGender;
            _tmp.isErrRequired= false;
            this.setState({
                selectedGender: _tmp.val,
                gender: _tmp,
                prevoius_gender: _tmp.val  
            }); 
        }
        if(func(this.state.age, 'age')){
            let _tmp = this.state.age;
            _tmp.isErrRequired = true;
            this.setState({
                age:_tmp
            })
            requiredField = true;
        }
        if(requiredField) return;
        if(this.state.toAge != ''){
            if (this.state.toAge < this.state.age.val){
                Alert.alert('To age should be greater than from age!');
                requiredField = true;
            }
        }
        if(requiredField) return;
        let selectedCategory = [];
        for(let i = 0; i < talent_category.length; i++){
            if(this.state.talent_cate[i].selected == true){
               selectedCategory.push(this.state.talent_cate[i].category);
            }
        }
        if(_.isEmpty(selectedCategory)){
             Alert.alert('You must select at least a talent type');
             requiredField = true;
        }
        if(requiredField) return;
        that.setState({
            is_api_requesting: true
        })
        setTimeout(function(){
            console.log('Job info: ' , that.state);
            let req_object = {
                "owner_type": "person",
                "owner": UserHelper.UserInfo._id,
                "post_type": "job",
                "references": [],
                "content": that.state.title.val, 
                title: that.state.title.val,
                "description": that.state.description,
                "criteria":{
                    "type": selectedCategory,
                    // "company":"xxx",
                    "gender": that.state.gender.val,
                    "min_age": that.state.age.val,
                    "max_age": that.state.toAge
                },
                "is_allow_forward": true,
                "privacy_type": "public",
                "status": "published",
                // "latitude": 14.28323,
                // "longitude": 104.29382
            }

            // let post_job_url = '/api/posts/' + JOB_INFO._id;
            let post_job_url = '/api/posts/' + _SELF.props.navigation.state.params.Job_Info._id; 
            // let post_job_url = '/api/posts/' + _SELF.props.navigation.state.params.Job_Info.sub_reference_detail._id; 
            console.log('req_object: ', req_object);
            console.log('API URL: ', post_job_url);
            // if(that.state.img.length > 0){
            //     let photo_url = '/api/media/photos/'+ that.state.img[0].img_uuid +'/save';
            //     let photo_obj = {name: 'image' , filename: that.state.img[0].filename, data: that.state.img[0].data, type:'image/foo'};
            //     postMedia(photo_url, [
            //         photo_obj
            //     ]).then((response) => {
            //         if(response.code == 200){
            //             let imgReference = [];
            //             imgReference.push(response.result._id);
            //             req_object.references = imgReference;
            //             putApi(post_job_url,
            //                 JSON.stringify(req_object)
            //             ).then((response) => {
            //                 console.log('Response Posted Job: ', response);
            //                 if(response.code == 200){
            //                     that.setState({
            //                         is_api_requesting: false
            //                     });
            //                     that.savePostJob(response.result);
            //                 }
            //             });
            //         }
            //     });

            // }else{
                putApi(post_job_url,
                    JSON.stringify(req_object)
                ).then((response) => {
                    console.log('Response Save Job: ', response);
                    if(response.status=="success"){
                        
                    }
                    that.state.is_api_requesting = false;
                });
            // }

        }, 50);
    }

    // when click button save on header
    saveJob = () => {
        // console.log('CLICK SAVE: ', this);
        // this._postJob();
        const { navigate, goBack, state, setParams } = this.props.navigation;
        setParams({ isLoadingOnHeader: true });
    }

    onPostCancel = () => {
        // Clear selected job types.
        _.each(this.state.talent_cate, function(v){
            // console.log('category: ', v);
            v.selected = false;
        })

        const { navigate, goBack, state, setParams } = this.props.navigation;
        // console.log('navigation component: ', this.props.navigation);
        goBack();
    }

    chooseImage() {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let id = uuid.v4();
                let source = { uri: response.uri };
                // console.log('The state: ', this.state);
                let arrImg = this.state.img.slice();
                let _id = 0;
                if(arrImg.length > 0)
                    _id = arrImg.length;

                arrImg.push({
                    'id': _id, 
                    'uri':source.uri, 
                    'img_uuid': id, 
                    'data': response.data,
                    'filename': response.fileName ? response.fileName : id
                });
                this.setState({
                    img: arrImg,
                    idx: arrImg.length
                })
                
                // let data = response.data;
                // let url = '/api/media/photos/'+ id +'/save';

                // // console.log('Response: ', response);
                // postMedia(url, [
                //     // {name: response.fileName , filename: response.fileName, data: data, type: 'image/jpg'},
                //     {name: 'image' , filename: response.fileName, data: data, type:'image/foo'}
                // ]).then((response) => {
                //     console.log('success response: ', response);
                // });

                // let obj_photo = {name: 'image' , filename: response.fileName, data: response.data, type:'image/foo'};
                // console.log("Pick obj_photo: ", obj_photo);
            }
        });
    }


    _removePhoto = (_media, _mediaIndex) => {

        this.setState({
            img: [],
            idx: 0
        })

    }

    _mediaOption = (_media, _mediaIndex) => {
        let _SELF = this;


        if(Helper._isIOS){
            // popup message from bottom with ios native component
            ActionSheetIOS.showActionSheetWithOptions({

                message: 'Are you sure you want to delete this photo?',
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

            },
            (buttonIndex) => {

                // console.log(buttonIndex);
                //   this.setState({ clicked: BUTTONS[buttonIndex] });
                if(buttonIndex==0){
                    _SELF._removePhoto(_media, _mediaIndex)
                }

            });
        }
        else{

            // for android ask with alert message with button

            // Works on both iOS and Android
            Alert.alert(
            'Are you sure you want to delete this photo?',
            // 'My Alert Msg', 
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Delete', onPress: () =>  _SELF._removePhoto(_mediaId, _mediaIndex) },
            ],
            { cancelable: false }
            )
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

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onAgeChanged(text, type){
        let re=/^[0-9]{0,2}$/;

        if(re.test(text)){

            if(type === 'from'){
                this.setState({ 
                    age: {
                        val:text   
                    }
                })

            }else{
                this.setState({ toAge: text });
            }
        }
    }

    render() {
        return (
            <View style={[styles.justFlexContainer,styles.mainScreenBg]} onPress={() =>  dismissKeyboard()}>
                <ScrollView contentContainerStyle={[styles.paddingTopNavMD]}>
                    <View style={[styles.mainHorizontalPadding]}>

                        <View>
                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Title of job
                            </Text>
                            <TextInput 
                                onChangeText={(txtTitle) => this.setState({title:{
                                    val:txtTitle   
                                }})}
                                value = { this.state.title.val }
                                placeholder="Looking for stunt team, urgent! *"
                                placeholderTextColor = { this.state.title.isErrRequired ? 'red':'#B9B9B9' }
                                returnKeyType="next"
                                autoCorrect = {false}
                                style={[styles.flatInputBox, styles.flatInputBoxSM]}
                                underlineColorAndroid = 'transparent'
                                textAlignVertical = 'bottom'
                            />
                        </View>

                        {/* country */}
                        <View style={[styles.marginTopXXS]}>
                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Country
                            </Text>
                            <CountryPicker
                                countryList={ALL_COUNTRIES} 
                                filterable = {true}
                                closeable = {true}
                                onChange={(value) => {
                                    {/*console.log('Value: ', value);*/}
                                    value.isErrRequired = false;

                                 this.props.navigation.setParams({payload:{country:value}}); 
                                    this.setState({ 
                                        country: {
                                            val: value.name,
                                            isErrRequired: false
                                        }
                                    });
                                }}
                                cca2={this.state.cca2}
                                translation='eng' >

                                <View style = {styles.countryPicker} > 
                                    <Text style={[ {fontSize: 14, color:  this.checkColorCountryInput() },this.state.country.isErrRequired && {color: 'red'} ]}> { this.state.country.val || 'Country *' } </Text>
                                </View>
                             </CountryPicker>
                        </View>

                        {/* gender */}
                        <View style={styles.marginTopBig}>
                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Gender
                            </Text>
                            { Helper._isAndroid()  && 
                                <View style = {styles.genderPicker}>
                                    <Picker
                                        selectedValue={this.state.selectedGender}
                                        onValueChange={this.onValueChange.bind(this, 'selectedGender')}>
                                        <Item label="Please Select Gender" value="" color={ this.state.gender.isErrRequired ? 'red' :"#9B9B9B" } />
                                        <Item label="Male" value="M" color={ this.state.selectedGender == 'M' ? '#4a4a4a':'#9B9B9B'} />
                                        <Item label="Female" value="F" color={ this.state.selectedGender == 'F' ? '#4a4a4a':'#9B9B9B'} />
                                        <Item label="Both" value="B" color={ this.state.selectedGender == 'B' ? '#4a4a4a':'#9B9B9B'} />
                                    </Picker>
                                </View>
                            } 

                            { Helper._isIOS()  && 
                                <View> 
                                    <Modal
                                        animationType={"slide"}
                                        transparent={true}
                                        visible={this.state.modalVisible}
                                        onRequestClose={() => {alert("Modal has been closed.")}} >

                                        <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
                                            <TouchableOpacity
                                                style={[ {backgroundColor: Colors.componentDarkBackgroundColor, padding: 15} ]}
                                                onPress={() => {
                                                    this.setModalVisible(!this.state.modalVisible)
                                                }}>
                                                <Text style={[styles.fontBold, {textAlign: 'right', color: '#3b5998'} ]} >Done</Text>
                                            </TouchableOpacity>
                                            <View style={[ {backgroundColor: 'white'} ]}>
                                                <Picker
                                                    selectedValue={this.state.selectedGender}
                                                    onValueChange={this.onValueChange.bind(this, 'selectedGender')}>
                                                    <Item label="Please select gender" value=""/>
                                                    <Item label="Male" value="M" /> 
                                                    <Item label="Female" value="F" />
                                                    <Item label="Both" value="B" />
                                                </Picker>
                                            </View>
                                        </View>
                                    </Modal>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setModalVisible(true)
                                        }}>
                                        <View style = {styles.genderPicker}>
                                            <Text style={[ styles.flatInputBoxFont, {fontSize: 14, color: this.state.gender.isErrRequired ? 'red': '#B9B9B9'} , !_.isEmpty(this.state.selectedGender) && {color: Colors.textBlack} ]}>{ Helper._getGenderLabel(this.state.selectedGender) || 'Please select gender *' }</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                        {/* age */}
                        <View style={[styles.marginTopXXS]}>
                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Age
                            </Text>
                            <View style={[styles.tagContainerNormal]}>
                                <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                    From: 
                                </Text>
                                <TextInput
                                    onChangeText = {(age) => this.onAgeChanged(age, 'from')}
                                    value = { this.state.age.val }
                                    placeholder="From Age *"
                                    placeholderTextColor={this.state.age.isErrRequired? 'red':'#B9B9B9'}
                                    returnKeyType="next"
                                    autoCorrect={false}
                                    // onSubmitEditing={() => this.passwordInput.focus()}
                                    style={[styles.flatInputBox, styles.flatInputBoxSM]}
                                    underlineColorAndroid = 'transparent'
                                    textAlignVertical = 'bottom'
                                    keyboardType="phone-pad" 
                                    maxLength = {2}
                                    width = {120}
                                    marginLeft = {5}
                                    marginRight = {15}
                                />

                                <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                    To: 
                                </Text>
                                <TextInput 
                                    onChangeText={(age) => this.onAgeChanged(age, 'to')}
                                    value = { this.state.toAge }
                                    placeholder="To Age"
                                    placeholderTextColor={'#B9B9B9'}
                                    returnKeyType="next"
                                    autoCorrect={false}
                                    style={[styles.flatInputBox, styles.flatInputBoxSM]}
                                    underlineColorAndroid = 'transparent'
                                    textAlignVertical = 'bottom'
                                    keyboardType="phone-pad"
                                    maxLength = {2} 
                                    width = {120}
                                    marginLeft = {5}
                                />
                            </View>
                            
                        </View>

                        {/* talent type */}
                        <View style={[styles.marginTopXXS]}>

                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Talent type *
                            </Text>
                            
                            <View style={[styles.tagContainerNormal]}> 

                                {this.state.talent_cate.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[styles.tagsSelectNormal, this.checkActiveTag(item) && styles.tagsSelected]} 
                                            onPress={ () => this.selectedTag(item, index)} >
                                            <Text style={[styles.tagTitle, styles.btFontSize, this.checkActiveTag(item) && styles.tagTitleSelected]}>
                                                {item.display_name}
                                                {item.selected}
                                            </Text>
                                        </TouchableOpacity>     
                                    )
                                })}
                            </View>
                        </View>

                        {/* additional */}
                        <View style={[styles.marginTopMDD]}>
                            <TextInput 
                                onChangeText={(desc) => this.setState({description:desc})}
                                value = { this.state.description }
                                placeholder="Additional info (optional)"
                                placeholderTextColor={Colors.textBlack}
                                returnKeyType="next"
                                keyboardType="email-address"
                                autoCorrect={false}
                                /*onSubmitEditing={() => this.passwordInput.focus()}*/
                                style={[styles.flatInputBox, styles.flatInputBoxSM]}
                                underlineColorAndroid = 'transparent'
                                textAlignVertical = 'bottom'
                            />
                        </View>


                        {/* upload images */}
                        <View style={[styles.marginTopXS]}> 
                            <Text style={[styles.grayLessText, styles.marginBotXXS]}>
                                Cover image (optional)
                            </Text>

                            <View style={[styles.boxWrapContainer, styles.marginTopXS]}> 
                                {this.state.img.map((item, index) => {
                                    return (

                                        <View key={ index } style={[styles.boxWrapItem, styles.boxWrapItemSizeMD, {flex:1, width: null}]}>

                                            <TouchableOpacity
                                                activeOpacity = {0.9}
                                                key={ index } 
                                                style={[styles.boxWrapItem, styles.boxWrapItemSizeMD, {flex:1, width: null}]}>
                                                
                                                <Image
                                                    style={styles.userAvatarFull}
                                                    source={{ uri:  this.state.img[index].uri }}
                                                />

                                            </TouchableOpacity>     

                                            <TouchableOpacity style={[ styles.iconPlayTopRightSM ]} onPress={() => this._mediaOption(item, index) }>
                                                <Icon 
                                                    name={ 'more-horiz' }
                                                    style={[ {color: 'white', fontSize: 30}, styles.shadowBox ]} 
                                                />
                                            </TouchableOpacity>
                                    
                                        </View>
                                    )
                                })}



                                { this.state.idx == 1 ? null : 
                                    <TouchableOpacity
                                        activeOpacity = {0.9}
                                        style={[ styles.boxWrapItem, styles.boxWrapItemSizeMD, styles.flexCenter, {flex:1, width: null} ]} 
                                        onPress={ this.chooseImage.bind(this)} >

                                        <Icon
                                            name="add"
                                            style={[ styles.iconPlus ]} 
                                        />
                                    </TouchableOpacity> 
                                }
                            </View>
                        </View>
                    </View>
                    
                    <View style={[styles.mainVerticalPaddingMD, styles.flexStretch, styles.mainHorizontalPadding, {flex: 1, flexDirection: 'row', justifyContent: 'space-between',}]}>

                        {!JOB_INFO?<TouchableOpacity style={[styles.flatButton, styles.flatButtonSizeSM, styles.grayBg, styles.noBorder, {width: 160,}]} onPress={() => this._postJob() }>
                            {/*<Text style={[styles.flatBtnText, styles.btFontSize]}>Close Listing</Text>*/}
                            { !this.state.is_api_requesting ? <Text style={[styles.flatBtnText, styles.btFontSize]}>Post</Text> : <ActivityIndicator color="white" animating={true} /> }
                                
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.flatButton, styles.flatButtonSizeSM, styles.grayBg, styles.noBorder, {width: 160,}]} onPress={() => this._updateJob()}>
                            { !this.state.is_api_requesting ? <Text style={[styles.flatBtnText, styles.btFontSize]}>Update</Text> : <ActivityIndicator color="white" animating={true} /> }
                        </TouchableOpacity>
                        }

                        {/*<TouchableOpacity style={[styles.flatButton, styles.flatButtonSizeSM, styles.darkishRedBg,{width: 160}]} onPress={() => { this.setLoding() } }>
                            <Text style={[styles.flatBtnText, styles.btFontSize]}>Cancel</Text>
                        </TouchableOpacity>*/}

                        <TouchableOpacity style={[styles.flatButtonCancel, styles.flatButtonSizeSM]} onPress={() => { this.onPostCancel() } }>
                            <Text style={[styles.flatBtnText, styles.btFontSize, styles.txtCancel]}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({ ...Utilities, ...FlatForm, ...TagsSelect, ...BoxWrap,
    genderPicker:{
        height: 45,
        backgroundColor: Colors.componentBackgroundColor,
        marginBottom: 10,
        borderRadius: 5,  
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch',
        paddingLeft:(Platform.OS === 'ios') ? 12: 3,
    },
    countryPicker:{
        height: 45,
        backgroundColor: Colors.componentBackgroundColor,
        borderRadius: 5,  
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch',
        paddingLeft: 8,
    },


    icon: { 

        // width: 35,
        fontSize: ICON_SIZE_ANDROID,
        fontWeight: 'bold',
        color: Colors.tabBarActiveTintColor 
    },
 
    txt: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    txtCancel:{
        color: '#B9B9B9',
        fontSize: 14,
        textDecorationLine: 'underline'
    },

    flatButtonCancel: {
        paddingVertical: 15,
        marginTop: 5,
    },

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps, DetailActions)(CreatePostJob)