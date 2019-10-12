import { AsyncStorage, Platform } from 'react-native';

import _ from 'lodash'

import moment from 'moment'


const EMPLOYER_TYPE = 'employer';
const USER_TYPE = 'user';


const genderOption = [{
    id: 1,
    value : 'M',
    label : 'Male',

},{
    id: 2,
    value : 'F',
    label : 'Female',
},{
    id: 3,
    value : 'B',
    label : 'Both (Male & Female)',
}];
 
class UserHelperCls{

    constructor(){
        this.token = '';
        this.UserInfo = {}; 
        isLoadingOnHeader=false;
        isEditing=false;
    }

    _setLoading = (_loading) => {
        this.isLoadingOnHeader = _loading;
        console.log('isLoadingOnHeader', this.isLoadingOnHeader);
    }   

    _setEditing = (_editing) => {
        this.isEditing = _editing;
    }   

    _getFirstRole = () => {
        return _.head(this.UserInfo.activeUserRoles)
    }

    _getUserFullName = () => {
        if(this._isLogIn())
             return this.UserInfo.profile.attributes.first_name.value + ' ' + this.UserInfo.profile.attributes.last_name.value;
        else
            return '';
    }

    _getUserInfo = () => {
        return this.UserInfo;
    }

    // get talent or talent-seeker category (Director, singer ...)
    _getKind = (_kindsObj) => {
        console.log('_kindsObj: ', _kindsObj);
        
        let _tmpKinds = [];
        const _kinds = _kindsObj || _.cloneDeep(this.UserInfo.profile.attributes.kind.value);
        
        if(!_kinds)
            return _tmpKinds;

        _.each(_kinds.split(','), function(v,k){
            _tmpKinds.push({
                id: k,
                display_name: v
            })
        });
        console.log()
        return _tmpKinds;
    }
 
    _getCover = () => {
        // console.log('This is user cover: ', this.UserInfo);
        // console.log('and zoom url: ', this.UserInfo.cover.zoom_url_link);
        // return this.UserInfo.cover ? (this.UserInfo.cover.zoom_url_link ? this.UserInfo.cover.zoom_url_link : this.UserInfo.cover.)
        return this.UserInfo.cover ? this.UserInfo.cover.zoom_url_link : '';
    }

    _getToken = ()  => {
        // return 'kQzBzAlIYYVFDzSZaVn/t1/aXEZ0JGUY7/pVwth91kA=';
        // this.token = 'skdfh23jk4hk32h4jk234234kj23h';
        return this.UserInfo ? this.UserInfo.token : '';
    }

    _isLogIn = ()  => {

        if(_.isEmpty(this.UserInfo))
            return false;
        // console.log('user', this.UserInfo);
        return this.UserInfo.token && this.UserInfo.is_register_completed ? true : false;
    }

    _isEmployer = (_withNoLogin) => {
        if(this._isLogIn()){
            // console.log('_getFirstRole : ',this._getFirstRole().role.name,' == ',EMPLOYER_TYPE);
            return this._getFirstRole().role.name == EMPLOYER_TYPE;
        }
        else if(_withNoLogin){
            return this._getFirstRole().role.name == EMPLOYER_TYPE;
        }
        else
            return '';
    }

    _isUser = (_withNoLogin) => {
        if(this._isLogIn())
            return this._getFirstRole().role.name == USER_TYPE;
        else if(_withNoLogin)
            return this._getFirstRole().role.name == USER_TYPE;
        else
            return '';
    }

}

class StorageDataCls{

    _removeStorage = async (_keyVal) => {
        try {
            // console.log('loading ...');
            const value = await AsyncStorage.removeItem('@'+_keyVal+':key');  
            console.log('Success Remove AsyncStorage ('+ _keyVal +')',value);
            if (value !== null){

                return true;

            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }

    _loadInitialState = async (_keyVal) => {
        try {
            // console.log('loading ...');
            const value = await AsyncStorage.getItem('@'+_keyVal+':key');  
            // console.log('Get AsyncStorage : ',value);
            if (value !== null){

                // We have data!!
                // console.log(JSON.parse(value));

                // console.log(this.state.userData);

                return JSON.parse(value)
    
                

            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }


    _saveUserData = async (_keyVal, response) => {
        try {
            await AsyncStorage.setItem('@'+_keyVal+':key', JSON.stringify(response));
            // this._successLogin(this);
            return true;
        } catch (error) {
            // Error saving data        
            console.log(error);
        }
    }

}


// chat class
// chat helper with sendbird
class ChatCls{

    constructor(){

    }

    _getUserPartnerProfile = (userId, channel) => {
        // if(userId)
        let _tmp = _.filter(channel.members, function(v,k){
            return v.userId != userId;
        })
        // console.log('user partner profile: ', _tmp);
        return _.head(_tmp);

    }

    _getLastMessage = (lastMessage) =>{

        if(lastMessage.messageType == 'file')
            return 'has been send a photo to you';
        else
            return lastMessage.message;

    }



}

class HelperCls{

    constructor(){
        this.token = '';
        this.UserInfo = {};

    }

    // get cover profile with obj provide
    _getCover = (_userProfile, _type = 'thumbnail_url_link') => {
        // console.log('User Profile: ', _userProfile.profile.photo);
        // console.log('Thumbnail URL: ', _userProfile.profile.photo.thumbnail_url_link);
        return _userProfile.profile.photo ?  _userProfile.profile.photo[_type] : '';
    }   

    _getUserFullName = (_userProfile) => {
        if(_userProfile.profile)
            return _userProfile.profile.attributes.first_name.value + ' ' + _userProfile.profile.attributes.last_name.value;
        else
            return _userProfile.first_name.value + ' ' + _userProfile.last_name.value;
            
    }

    _getGender = (_val) => {

        if(_.isEmpty(_val)) 
            return ''; 
        // console.log(genderOption);
        // let _tmp = _.find(genderOption, {'label' : _val});
        let _tmp = _.filter(genderOption, function(v,k){
            return v.label == _val;
        });
        // console.log(_.head(_tmp));
        return _.head(_tmp) ? _.head(_tmp).value : '';
    }

    _getGenderLabel = (_val) => {

        if(_.isEmpty(_val)) 
            return '';
        // console.log(genderOption);
        // let _tmp = _.find(genderOption, {'label' : _val});
        let _tmp = _.filter(genderOption, function(v,k){
            return v.value == _val;
        });
        // console.log(_.head(_tmp));
        return _.head(_tmp) ? _.head(_tmp).label : '';
    }

    _getGenderJob = (_val) => {
        if(_val == 'B')
            return 'Both';
        else if(_val == 'M')
            return 'Male';
        else if(_val == 'F')
            return 'Female';
        else
            return 'N/A';
    }

    _getBirthDateByAge = (_age) => {

        today_date=new Date();
        today_year=today_date.getFullYear();
        return today_year-_age;

    }

    _getBirthDateFullByAge = (_age) => {

        today_date = this._getBirthDateByAge(_age);
        return today_date + '-01-01';

    }

    _isAndroid(){
        return Platform.OS == 'android';
    }

    _isIOS(){
        return Platform.OS == 'ios';        
    }


    _getTimeFromNow = (_time) => {
        return moment(_time).fromNow();
    }

    _capitalizeText = (_txt) => {
        return _txt.charAt(0).toUpperCase() + _txt.slice(1);
    }


}



const UserHelper = new UserHelperCls();
const StorageData = new  StorageDataCls();
const Helper = new  HelperCls();
const ChatHelper = new  ChatCls();

export { UserHelper, StorageData, Helper, ChatHelper };
