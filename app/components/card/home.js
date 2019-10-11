import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../styles/card.style'
import { headerStyle, titleStyle } from '../../styles/header.style'
import ButtonRight from '../header/button-right'
import ButtonLeft from '../header/button-left'
import * as DetailActions from '../../actions/detail'

function mapStateToProps(state) {
    return {
        detail: state.detail
    }
}

class Home extends Component {

    static navigationOptions = {
        title: 'Talentora',
        headerStyle:headerStyle,
        headerTitleStyle:titleStyle,        
        headerRight: ({ state, setParams, navigate }) => (
            <ButtonRight
                icon="add"
                navigate={navigate}
                to="Settings"
            />
            /*left: (<ButtonLeft
                icon="menu"
                navigate={navigate}
                to="DrawerOpen"
            />)*/
        )
    }

    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        
        this.props.fetchDetailState({ limit: 10 })
    }

    render() {
        // StatusBar.setBarStyle('default',true);
        const { detail } = this.props
        const { navigate, goBack } = this.props.navigation

        if (!detail.length)
            return (<View><Text>Loading...</Text></View>)

        return (
            
            <ScrollView style={[ styles.wrapper ]}>

                { detail.map( (item, i) => {
                    return <View key={i}>
                        <TouchableWithoutFeedback onPress={() => navigate('Detail', { item })}>
                            <View style={[ styles.item ]}>
                                <Image
                                    style={styles.imgThumnail}
                                    source={{uri: item.url}}
                                />
                                <View style={[styles.overlay, { height: 200, opacity: 0.2}]} />
                                {/*<Button
                                    title={ item.title }
                                    onPress={() => navigate('Detail', { item })}
                                />*/}
                                <View style={[styles.cardInfo]}>
                                    <View style={[styles.userInfo]}>
                                        <View style={[styles.avatarContainer]}>
                                            <Image
                                                style={styles.userAvatar}
                                                source={{uri: item.url}}
                                            />
                                        </View>
                                        <Text style={[styles.userName]}>{ item.title }</Text>
                                    </View>
                                    <View style={[styles.userAction]}>
                                        <Icon
                                            name={"favorite-border"}
                                            style={[ styles.icon, styles.favIcon]} />
                                        <Icon
                                            name={"more-horiz"}
                                            style={[ styles.icon, styles.favIcon]} />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({ ...Styles,

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps, DetailActions)(Home)
