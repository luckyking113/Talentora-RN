import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    PixelRatio,
    Text
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@themes/index';
import { Helper, ChatHelper } from '@helper/helper';
import SendBird from 'sendbird';
import _ from 'lodash';
const sb = null;

// const ICON_SIZE_ANDROID = __DEV__ ? 24 : PixelRatio.getPixelSizeForLayoutSize(24);
const ICON_SIZE_ANDROID = 24;

class ButtonRight extends Component {

    render() {
        const { icon, onPress, navigate, to, style , btnLabel, nav, chat_info, navigation} = this.props
        // console.log("navigation.state.params: ", nav)
        let JobInfo;
        if(nav)
            JobInfo = nav.state.params.job;

        let isChat = false;
        if(chat_info){
            // For Direct Message
            sb = SendBird.getInstance();
            isChat = true;
        }

        // For Edit Job Posted
        return (<TouchableOpacity
            style={[{ marginRight: 15 , flex: 1, flexDirection: 'row', alignItems: 'center'}, style]}
            onPress={ () => isChat ? this.directToMessage() : navigate(to, {'Job_Info': JobInfo} )}
        >
            { icon ? <Icon
                name={icon}
                style={[ styles.icon ]}
            /> : null }
            
            <Text style={[styles.btnLabel]}>{btnLabel}</Text> 
        </TouchableOpacity>)
    }

    directToMessage = () => {
        // Alert.alert('Bring me to message page'); 
        // console.log('USER INFORMATION FOR CHAT : ', this.props); 
        // return;

        let userObj = {
            id : this.props.chat_info.user._id,
            cover : Helper._getCover(this.props.chat_info), 
            full_name :  Helper._getUserFullName(this.props.chat_info.attributes), 
        }
        let _SELF = this;
        ChatHelper._sendBirdLogin(function(sb){ 
            ChatHelper._createChannel(sb, userObj, null, function(_channel){
                // console.log('This is props: ', _SELF.props);
                const { navigate, goBack, state } = _SELF.props.navigation;

                let _tmpChatData = {
                    name: userObj.full_name,
                    channelUrl: _channel.url,
                    chat_id: userObj.id,
                }

                let  _chkExistInChannel = _.head(ChatHelper._checkExistUserInChennel(userObj.id));

                // console.log('_chkExistInChannel: ', _chkExistInChannel);
                
                let _paramObj = {
                    message_data: _tmpChatData
                };

                // if(_.isEmpty(_chkExistInChannel)){
                //     // navigate('Message',{message_data: _tmpChatData, resetScreen : 'RootScreen'}); 
                //     _paramObj = _.extend({
                //         routeIndex : 0,
                //         resetScreen : 'MessageList',
                //         routeKey : 'MessageList'
                //     },_paramObj);
                // }
                navigate('Message',_paramObj); 
            })
        })
    }
}

const styles = StyleSheet.create({
    icon: { 
        // width: 30,
        fontSize: ICON_SIZE_ANDROID,
        color: Colors.tabBarActiveTintColor 
    }

})

export default ButtonRight
