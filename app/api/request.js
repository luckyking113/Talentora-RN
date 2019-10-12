import DeviceInfo from 'react-native-device-info';
const FBSDK = require('react-native-fbsdk');
const { LoginButton, AccessToken, LoginManager } = FBSDK;
import RNFetchBlob from 'react-native-fetch-blob';

import { UserHelper, StorageData } from '@helper/helper';


const baseUrl = 'http://188.166.227.245:3022';
// const baseUrl = 'http://localhost:3000';   // Local 

let _deviceId;
if (DeviceInfo.isEmulator())
    _deviceId = '777C42BB-1498-4569-BBF2-58092F2299FC-22';
else
    _deviceId = DeviceInfo.getUniqueID() || _;

const postApi = (url, body) => {
    url = baseUrl + url; 
    let auth = UserHelper._getToken();          // get user access token after login or register.
    console.log('user token (post): ', auth);
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'appKey': 'd3193d1267622be3b180e27743a7adb5',
            'Content-Type': 'application/json',
            'sessionId': _deviceId,
            'auth': auth,
        },
        body: body
        
    }).then((response) => response.json()).then((responseJson) => {
        // console.log('Response: ', responseJson);
        return responseJson;
    }).catch((error) => {
        // console.error(error);
        return error;
    });
}

const getApi = (url) =>{
    url = baseUrl + url;
    let auth = UserHelper._getToken();          // get user access token after login or register.
    console.log('user token (get) : ', auth);

    return fetch(url, {
        method: 'GET',
        headers: {
            'appKey':'d3193d1267622be3b180e27743a7adb5',
            'sessionId' : _deviceId,
            'auth': auth,
        }
    }).then((response) => response.json()).then((responseJson) => {
        // console.log('GET RESULT: ', responseJson);
        return responseJson;
    }).catch(function(err) {
        // Error :(
        return err;
    });
}

const putApi = (url, body) => {
    url = baseUrl + url;
    let auth = UserHelper._getToken();          // get user access token after login or register.
    console.log('user token (put) : ', auth);

    return fetch(url, {
        method: 'PUT',
        headers: {
            'appKey': 'd3193d1267622be3b180e27743a7adb5',
            'Content-Type': 'application/json',
            'sessionId': _deviceId,
            'auth': auth,
        },
        body: body
        
    }).then((response) => response.json()).then((responseJson) => {
        // console.log('Response: ', responseJson);
        return responseJson;
    }).catch((error) => {
        // console.error(error);
        return error;
    });
}

const loginFacebook = () => {
    let fburl = baseUrl + '/api/users/facebook-authenticate';

    return LoginManager.logInWithReadPermissions(['public_profile', 'user_birthday']).then(  
        function(result) {
            if (result.isCancelled) {
                console.log('Log in canceled');
            } else {
                return AccessToken.getCurrentAccessToken().then((data) => {
                    console.log('this data ', data);
                    return fetch(fburl, {
                        method: 'POST',
                        headers: {
                            'appKey': 'd3193d1267622be3b180e27743a7adb5',
                            'Content-Type': 'application/json',
                            'sessionId': _deviceId,
                        },
                        body: JSON.stringify({
                            'access_token': data.accessToken
                        })
                        
                    }).then((response) => response.json()).then((responseJson) => {
                        console.log('Response FB Login: ', responseJson);
                        return responseJson;
                    }).catch((error) => {
                        // console.error(error);
                        return error;
                    });
                })
            }
        },function(error) {
            console.log('Login failed with error: ' , error);
        }
    );
}

const postMedia = (url, data) => {
    url = baseUrl + url;
    let auth = UserHelper._getToken();          // get user access token after login or register.
    console.log('user token (media) : ', auth);

    return RNFetchBlob.fetch('POST', url, {
        'Content-Type' : 'multipart/form-data',
        'appKey': 'd3193d1267622be3b180e27743a7adb5',
        'sessionId': _deviceId,
        'auth': auth,
    
    }, data).uploadProgress((written, total) => {
        console.log('uploaded', written / total)
    }).then((response) => response.json()).then((responseJson) => {
        return responseJson;
    }).catch(function(err) {
        // Error :(
        return err;
    });
}

export {postApi, getApi, putApi, loginFacebook, postMedia};
