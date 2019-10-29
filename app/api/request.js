import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const FBSDK = require('react-native-fbsdk');
const {LoginButton, AccessToken, LoginManager} = FBSDK;
import RNFetchBlob from 'react-native-fetch-blob';
import {DEVICE_ID, DEVICE_ID_IOS, API_URL, APP_KEY} from '@constants/env';
import {UserHelper, StorageData} from '@helper/helper';

const baseUrl = API_URL;

let _deviceId;
if (DeviceInfo.isEmulator())
  _deviceId = Platform.OS == 'android' ? DEVICE_ID : DEVICE_ID_IOS;
else _deviceId = DeviceInfo.getUniqueID() || _;

const postApi = (url, body) => {
  url = baseUrl + url;
  let auth = UserHelper._getToken(); // get user access token after login or register.

  return fetch(url, {
    method: 'POST',
    headers: {
      appKey: APP_KEY,
      'Content-Type': 'application/json',
      sessionId: _deviceId,
      auth: auth,
    },
    body: body,
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      return error;
    });
};

const getApi = (url, that = null) => {
  url = baseUrl + url;
  let auth = UserHelper._getToken(); // get user access token after login or register.
  return fetch(url, {
    method: 'GET',
    headers: {
      appKey: APP_KEY,
      sessionId: _deviceId,
      auth: auth,
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.code == 401) {
        UserHelper._logOut(that);
      }
      return responseJson;
    })
    .catch(function(err) {
      return err;
    });
};

const deleteApi = url => {
  url = baseUrl + url;
  let auth = UserHelper._getToken(); // get user access token after login or register.
  return fetch(url, {
    method: 'DELETE',
    headers: {
      appKey: APP_KEY,
      sessionId: _deviceId,
      auth: auth,
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(function(err) {
      return err;
    });
};

const putApi = (url, body) => {
  url = baseUrl + url;
  let auth = UserHelper._getToken(); // get user access token after login or register.

  return fetch(url, {
    method: 'PUT',
    headers: {
      appKey: APP_KEY,
      'Content-Type': 'application/json',
      sessionId: _deviceId,
      auth: auth,
    },
    body: body,
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      return error;
    });
};

const loginFacebook = () => {
  let fburl = baseUrl + '/api/users/facebook-authenticate';

  return LoginManager.logInWithPermissions([
    'public_profile',
    'user_birthday',
    'email',
  ]).then(
    function(result) {
      if (result.isCancelled) {
      } else {
        return AccessToken.getCurrentAccessToken().then(data => {
          return fetch(fburl, {
            method: 'POST',
            headers: {
              appKey: APP_KEY,
              'Content-Type': 'application/json',
              sessionId: _deviceId,
            },
            body: JSON.stringify({
              access_token: data.accessToken,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              return responseJson;
            })
            .catch(error => {
              return error;
            });
        });
      }
    },
    function(error) {},
  );
};

const loginInstagram = () => {
  return 'test login Instagram';
};

const postMedia = (url, data, uploadProgress) => {
  url = baseUrl + url;
  let auth = UserHelper._getToken(); // get user access token after login or register.

  return RNFetchBlob.fetch(
    'POST',
    url,
    {
      'Content-Type': 'multipart/form-data',
      appKey: APP_KEY,
      sessionId: _deviceId,
      auth: auth,
    },
    data,
  )
    .uploadProgress((written, total) => {
      if (uploadProgress) uploadProgress(written / total);
      return written / total;
    })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(function(err) {
      return err;
    });
};

export {
  postApi,
  getApi,
  putApi,
  deleteApi,
  loginFacebook,
  loginInstagram,
  postMedia,
};
