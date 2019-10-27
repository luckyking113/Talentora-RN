import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Actions from '../../actions/detail'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Styles from '../../styles/card.style'
import { headerStyle, titleStyle } from '../../styles/header.style'
import ButtonRight from '../header/button-right'
import ButtonBack from '../header/button-back'

function mapStateToProps(state) {
    return {
        detail: state.detail
    }
}

class Detail extends Component {

    static navigationOptions = ({ navigation }) => ({
            headerTitle: navigation.state.params.item.title,
            headerRight: (navigation.state.params && navigation.state.params.right),
        });

    // If no detail items loaded, load now
    UNSAFE_UNSAFE_componentWillMount() {

        const { detail, navigation } = this.props;
        const { index } = navigation.state.params.item;

        if (!detail[index])
            this.props.fetchDetailState({ limit: 10 });
    }

    // Link right header button to component
    // In this case we want the button to bookmark the detail item
    componentDidMount() {

        const { navigation } = this.props;
        const { index } = navigation.state.params.item;

        const params = {
            right: (<TouchableOpacity
                style={{ right: 15 }}
                onPress={ () => this.bookmark({ index }) }
            >
                <Icon
                    name="bookmark-border"
                    style={{ fontSize: 20 }}
                />
            </TouchableOpacity>),
        };

        // Set the navigation params here
        navigation.setParams(params);
    }

    // Trivial to navigate from within component context
    bookmark(opts) {
        
    }

    render() {

        const { detail, navigation } = this.props;
        const { navigate, goBack, state } = navigation;
        const { index, title } = state.params.item;

        if (!detail[index])
            return (<View><Text>Loading...</Text></View>);

        return (
            <ScrollView style={[ styles.wrapper ]}>

                <View
                    className="item-image"
                    style={{ height: 300, backgroundColor: '#efefef' }}
                />

                <Text style={[ styles.h1 ]}>
                    { title }
                </Text>

                <Button
                    onPress={() => navigate('Settings', { username: 'Someone' })}
                    title="Settings"
                />

                { detail[index+1] && <Button
                    onPress={() => navigate('Detail', { item: detail[index+1] })}
                    title={`Next - "${detail[index+1].title}"`}
                /> }

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({ ...Styles })

// Also connect detail screen to store
// Ensures this route can be accesed from anywhere within the app without having to connect
export default connect(mapStateToProps, Actions)(Detail)
