import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    PixelRatio
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@themes/index';

// const ICON_SIZE_ANDROID = __DEV__ ? 24 : PixelRatio.getPixelSizeForLayoutSize(24);
const ICON_SIZE_ANDROID = 24;

class ButtonRight extends Component {

    render() {

        const { icon, onPress, navigate, to, style } = this.props

        return (<TouchableOpacity
            style={[{ marginRight: 15 }, style]}
            onPress={ () => navigate(to) }
        >
            <Icon
                name={icon}
                style={[ styles.icon ]}
            />
        </TouchableOpacity>)
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
