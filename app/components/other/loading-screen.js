import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Utilities from '@styles/extends/ultilities.style';

 
export default class LoadingScreen extends Component {


    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        
        // this.props.fetchDetailState({ limit: 10 })
    }

    render() {

        // const { navigate, goBack } = this.props.navigation;

        return (
           
            <View style={[styles.defaultContainer, styles.shadowBox, {backgroundColor: 'red', alignItems: 'stretch'} ]}>
                <Image
                    style={[ styles.bgCover]}  
                    source={require('@assets/loading-bg.jpg')}  
                />
                <View style={[ styles.fullWidthHeightAbsolute, styles.defaultContainer, {backgroundColor: 'transparent'} ]}>
                    <Image
                        style={[ styles.bgContain, {width: 200}  ]} 
                        source={require('@assets/talentora.png')}  
                    />
                    <ActivityIndicator
                        animating={true}
                        style={[ {marginTop: 20} ]}
                        size="small"
                        color="white"
                    />
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    ...Utilities,
})
