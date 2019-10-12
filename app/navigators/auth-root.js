// import React, { Component} from 'react'
// import { connect } from 'react-redux'

// import {
//     StackNavigator, DrawerNavigator
// } from 'react-navigation';

// // import TabNavigator from '@navigators/tabs'
// import Authenticate from '@components/authentication/authenticate'
// import * as AuthActions from '@actions/authentication'

// // import Authenticate from '../components/authentication/authenticate'
// // import Settings from '@components/card/settings'
// import Record from '../components/media/media-record'

// class RootLogin extends React.Component {

//   static navigationOptions = {
//     title: 'Login',
//   }

//   render() {
//     return (
//       <Authenticate authenticate={this.props.authenticate} />
//     );
//   }

// }

// function mapStateToProps(state) {
//     return {
//         user: state.user,
//         navigation: state.navigation
//     }
// }

// const RootAutoNav = StackNavigator({
//     Login: { screen: RootLogin, navigationOptions: { header: { visible: false }}},
//     Login1: { screen: RootLogin, navigationOptions: { header: { visible: false }}},
// }, {
//     headerMode: 'screen',
//     nitialRouteName: 'Login',
// });

// // export default StackNavigator({
// //     Login:       { screen: RootLogin, navigationOptions: { header: { visible: false }}},
// // }, {
// //     headerMode: 'screen',
// // });

// // export default connect(mapStateToProps, AuthActions)(RootLogin)


// export default RootAutoNav;


import TabNavigator from '@navigators/landing'

export default TabNavigator;

