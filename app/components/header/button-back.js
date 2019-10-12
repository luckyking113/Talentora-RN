import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import { Colors } from '@themes/index';

class ButtonBack extends Component {

    render() { 

        const { icon, isGoBack, btnLabel, colBtn } = this.props
        // console.log(colBtn);
        // if(!colBtn)
        //     colBtn = {};

        return (<TouchableOpacity
            style={[styles.btnContainer]}
            onPress={ () => isGoBack.goBack() }

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
