import React, { Component } from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BoxStyles from '@styles/components/box-wrap.style';

export default class InviteFriend extends Component{

    constructor(props){
        super(props)
        SOCIALS=[
            {
                id:1,
                name:'Facebook',
                image:require('@assets/invite_facebook.png'),
                func:() => this.shareFb()
            },{
                id:2,
                name:'Messenger',
                image:require('@assets/invite_messenger.png'),
                func:() => this.shareMessenger()
            },{
                id:3,
                name:'Twitter',
                image:require('@assets/invite_twitter.png'),
                func:() => this.shareTwitter()
            },{
                id:4,
                name:'Instagram',
                image:require('@assets/invite_instagram.png'),
                func:() => this.shareInstagram()
            },{
                id:5,
                name:'WhatsApp',
                image:require('@assets/invite_whatsapp.png'),
                func:() => this.shareWhatsApp()
            },{
                id:6,
                name:'Line',
                image:require('@assets/invite_line.png'),
                func:() => this.shareLine()
            },{
                id:7,
                name:'Email',
                image:require('@assets/invite_email.png'),
                func:() => this.shareEmail()
            },{
                id:8,
                name:'Message',
                image:require('@assets/invite_message.png'),
                func:() => this.shareMessage()
            },{
                id:9,
                name:'Copy link',
                image:require('@assets/invite_link.png'),
                func:() => this.copyLink()
            }
        ];
    }

    shareFb = () => {

    };

    shareMessenger = () => {

    };

    shareTwitter = () => {

    };

    shareInstagram = () => {

    };

    shareWhatsApp = () => {

    };

    shareLine = () => {

    };

    shareEmail = () => {

    };

    shareMessage = () => {

    };

    copyLink = () => {

    };

    render(){
        
        const { navigate, goBack } = this.props.navigation;

        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={{flexDirection:'row', marginTop:30, paddingLeft:20, paddingBottom:20, marginBottom:1, shadowColor:'#000000', shadowOffset:{width:0, height:5}, shadowRadius:3, shadowOpacity:.2}}>
                    <TouchableOpacity
                        onPress={() => goBack()}
                        activeOpacity={.8}>
                        <Icon name={'close'}
                            style={{fontSize:20}} />
                    </TouchableOpacity>
                    <Text style={{flex:1, textAlign:'center', fontSize:16, fontWeight:'bold'}}>
                        Invite your friends
                    </Text>
                </View>
                <View style={{flex:1, backgroundColor:'white', justifyContent:'center'}}>
                    <View style={BoxStyles.boxWrapSpaceAround}>
                        {SOCIALS.map((item,index) => {
                            return(
                                <TouchableOpacity key={index}
                                    onPress={item.func}
                                    activeOpacity={.8}
                                    style={{marginBottom:20}}>
                                    <Image source={item.image}
                                        style={{width:60, height:60, marginRight:20, marginLeft:15, marginBottom:20, resizeMode:'contain'}} />
                                    <Text style={{textAlign:'center'}}>
                                        {item.name}                                    
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        );
    }
}