/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'

import configureStore from './app/store/configureStore'
const store = configureStore()
import RootContainer from './app/containers/rootContainer'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <RootContainer />
      </Provider>
    );
  }
}
