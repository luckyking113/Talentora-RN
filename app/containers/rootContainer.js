import React, { Component} from 'react'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/authentication'
import RootNavigator from '@navigators/root'
import RootAuthNavigator from '@navigators/auth-root'

import Authenticate from '@components/authentication/authenticate'

class Root extends Component {

    render() {
        // show login form on first load
        // console.log(this.props);
        if (!this.props.user)
            // return (<RootAuthNavigator authenticate={this.props.authenticate} />)            
            return (<RootAuthNavigator />)            
            // return <Authenticate authenticate={this.props.authenticate} />

        return (
            <RootNavigator />
        );
        
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        navigation: state.navigation
    }
}

export default connect(mapStateToProps, AuthActions)(Root)
