const React = require('react');
const ReactNative = require('react-native');
import PropTypes from 'prop-types';
import CreateReactClass from 'create-react-class';

const {StyleSheet, Text, View, Animated} = ReactNative;
const Button = require('./Button');

// const DefaultTabBar = CreateReactClass.createClass({

// }),

// const DefaultTabBar = React.createClass({
const DefaultTabBar = CreateReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    // tabStyle: View.propTypes.style,
    renderTab: PropTypes.func,
    // underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {},

  renderTab(name, page, isTabActive, onPressHandler) {
    const {activeTextColor, inactiveTextColor, textStyle} = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (
      <Button
        style={styles.flexOne}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}>
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{color: textColor, fontWeight}, textStyle]}>
            {name}
          </Text>
        </View>
      </Button>
    );
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;

    // customize
    const _fullWidth = containerWidth / numberOfTabs;
    const margLeft = (_fullWidth - 70) / numberOfTabs;
    // console.log('_margLeft: ', _margLeft);

    const tabUnderlineStyle = {
      position: 'absolute',
      // width: containerWidth / numberOfTabs,
      width: 70, // for customize
      height: 4,
      marginLeft: margLeft, // for customize
      backgroundColor: 'navy',
      bottom: -1,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View
        style={[
          styles.tabs,
          {backgroundColor: this.props.backgroundColor},
          this.props.style,
        ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, this.props.underlineStyle]} />
        {/* <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} /> */}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },
  flexOne: {
    flex: 1,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'transparent',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.05,
    elevation: 3,
  },
});

module.exports = DefaultTabBar;

// import React, { Component } from 'react'
// import {
// 	StyleSheet,
// 	Text,
// 	View,
// 	Animated,
// 	TouchableOpacity
// } from 'react-native'

// import PropTypes from 'prop-types';

// class DefaultTabBar extends Component {

// 	renderTab(name, page, isTabActive, onPressHandler) {
// 	  const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
// 	  const textColor = isTabActive ? activeTextColor : inactiveTextColor;
// 	  const fontWeight = isTabActive ? 'bold' : 'normal';

// 	  return <TouchableOpacity
// 				style={styles.flexOne}
// 				key={name}
// 				// accessible={true}
// 				// accessibilityLabel={name}
// 				// accessibilityTraits='button'
// 				onPress={() => onPressHandler(page)}
// 	  >
// 		<View style={[styles.tab, this.props.tabStyle, ]}>
// 		  <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
// 			{name}
// 		  </Text>
// 		</View>
// 	  </TouchableOpacity>;
// 	}
// 	render() {
// 		const containerWidth = this.props.containerWidth;
// 		const numberOfTabs = this.props.tabs.length;

// 		// customize
// 		const _fullWidth = containerWidth / numberOfTabs
// 		const _margLeft = (_fullWidth-70) / numberOfTabs
// 		// console.log('_margLeft: ', _margLeft);

// 		const tabUnderlineStyle = {
// 		  position: 'absolute',
// 		  // width: containerWidth / numberOfTabs,
// 		  width: 70, // for customize
// 		  height: 4,
// 		  marginLeft: _margLeft, // for customize
// 		  backgroundColor: 'navy',
// 		  bottom: -1,
// 		};

// 		const left = this.props.scrollValue.interpolate({
// 		  inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
// 		});
// 		return (
// 		  <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
// 			{this.props.tabs.map((name, page) => {
// 			  const isTabActive = this.props.activeTab === page;
// 			  const renderTab = this.props.renderTab || this.renderTab;
// 			  return renderTab(name, page, isTabActive, this.props.goToPage);
// 			})}
// 			<Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
// 		  </View>
// 		);
// 	}

// }
// const styles = StyleSheet.create({
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 0,
//   },
//   flexOne: {
//     flex: 1,
//   },
//   tabs: {
//     height: 50,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     borderWidth: 1,
//     borderTopWidth: 0,
//     borderLeftWidth: 0,
//     borderRightWidth: 0,
//     borderColor: 'transparent',

//     shadowColor: '#000000',
//     shadowOffset: {
//         width: 0,
//         height: 4
//     },
//     shadowRadius: 3,
//     shadowOpacity: .05,
//     elevation: 3,
//   },
// });

// DefaultTabBar.propTypes = {
//     goToPage: PropTypes.func,
// 	activeTab: PropTypes.number,
// 	tabs: PropTypes.array,
// 	//backgroundColor: PropTypes.string,
// 	//activeTextColor: PropTypes.string,
// 	//inactiveTextColor: PropTypes.string,
// 	//textStyle: PropTypes.style,
// 	// tabStyle: View.propTypes.style,
// 	renderTab: PropTypes.func,
// 	// underlineStyle: View.propTypes.style,
// };

// DefaultTabBar.defaultProps = {
//      /*  activeTextColor: 'navy',
//       inactiveTextColor: 'black',
//       backgroundColor: 'white', */
// };

// // module.exports = DefaultTabBar;
// export default DefaultTabBar
