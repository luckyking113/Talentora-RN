import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import { Colors } from '@themes/index';

import { NavigationActions } from 'react-navigation';
import _ from 'lodash'

class ButtonBack extends Component {


    _handleClick = () => {

        const { icon, isGoBack, btnLabel, colBtn } = this.props;

        console.log('state : ', isGoBack.state);

        const {state} = isGoBack;
        // state.params._callBack();

        if(state.params){
            if(state.params.updateUserVideoList){
                DeviceEventEmitter.emit('updateProfileInfo',  {update_video: true})
            }
        }

        if(state.params){
            if(state.params.backToJobList){

                const resetAction = NavigationActions.reset({ index: 0, actions: [{type: NavigationActions.NAVIGATE, routeName: 'RootScreen'}], key: null })
                isGoBack.dispatch(resetAction);

                // isGoBack.dispatch({
                //         type: 'Navigation/RESET',
                //         index: 0,
                //         actions: [
                //         // { type: 'Navigate', routeName: 'Waiting', params: { payload } },
                //         { type:  NavigationActions.NAVIGATE, routeName: 'JobList' }
                //         ]
                //     })
                // isGoBack.goBack('RootScreen');

            }
            else if(state.params.resetScreen){
                const resetAction = NavigationActions.reset({ index: state.params.routeIndex, actions: [{type: NavigationActions.NAVIGATE, routeName: state.params.resetScreen}], key: state.params.routeKey })
                isGoBack.dispatch(resetAction);
            }
            else{
                isGoBack.goBack();
            }
        }
        else{
            isGoBack.goBack();
        }



        

    }

    render() { 

        const { icon, isGoBack, btnLabel, colBtn } = this.props
        // console.log(colBtn);
        // if(!colBtn)
        //     colBtn = {};

        return (<TouchableOpacity
            style={[styles.btnContainer, _.isEmpty(btnLabel) && styles.noTextLabel]}
            onPress={ () => this._handleClick() }

        >
            <Icon
                name1="ios-arrow-back"
                name="chevron-small-left"
                style={[ styles.icon, colBtn ]}
            />
            <Text style={[styles.btnLabel, colBtn]}>{btnLabel}</Text> 

        </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    btnContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    noTextLabel: {
        paddingRight: 20,
    },
    btnLabel:{
        fontSize: 17,
        // fontWeight: 'bold',
        color: Colors.textColorDark,
    },
    icon: { 
        fontSize: 30,
        color: Colors.textColorDark, 
    }
})

export default ButtonBack
