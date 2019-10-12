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
    StatusBar,
    ListView,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import FlatForm from '@styles/components/flat-form.style';
import BoxWrap from '@styles/components/box-wrap.style';
import BoxAvatarCover from '@styles/components/box-avatar-cover.style';

import JobApplyRow from '@components/lists/job/job-apply-row';

import { headerStyle, titleStyle } from '@styles/header.style'
import ButtonRight from '../header/button-right'
import ButtonLeft from '../header/button-left'
import * as DetailActions from '@actions/detail'

import _ from 'lodash'

function mapStateToProps(state) {
    return {
        // detail: state.detail
    }
}

class ViewJobList extends Component { 

    constructor(props){
        super(props);
        //your codes ....

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            options: {
                isLoadingTail: false,
                isShowReviewApp : false,
                applicationCount : 0,
                dataSource: ds.cloneWithRows([
                    {
                        id: 1,
                        name: 'Hin Chaniroth',
                        photo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/13690662_777391902401412_7742506644238257845_n.jpg?oh=0a5c9f2ec8ab04ffa1533f67b65ca26a&oe=59977320',
                        type: [
                            {
                                name: 'Singer',
                                value: 'singer',
                            },
                            {
                                name: 'Dancer',
                                value: 'cancer',
                            },
                        ]
                    },
                    { 
                        id: 2,
                        name: 'Oun Ya Angel',
                        photo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/17799245_820895741395836_893744169114306193_n.jpg?oh=9f5dbd67b6df76217571ec7b8804e6f1&oe=59993FD3',
                        type: [
                            {
                                name: 'Singer',
                                value: 'singer',
                            },
                            {
                                name: 'Dancer',
                                value: 'cancer',
                            },
                        ]
                    },
                    { 
                        id: 2,
                        name: 'Mean Sonita',
                        photo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16508988_1075299335933144_3547182206399928845_n.jpg?oh=c1e90ca0968e7175be239e9131799261&oe=594CE7FD',
                        type: [
                            {
                                name: 'Singer',
                                value: 'singer',
                            },
                            {
                                name: 'Dancer',
                                value: 'cancer',
                            },
                        ]
                    },
                ])
            }
        }

    }

    static navigationOptions = ({ navigation }) => ({
            // title: '', 
            // headerVisible: true, 
            headerTitle: navigation.state.params.job.title,
            headerLeft: (<ButtonLeft
                icon="person-add" 
                navigate={navigation.navigate}
                to=""
            />),
            headerRight: (
                
                <View style={[styles.flexVerMenu, styles.flexCenter]}>

                    <ButtonRight
                        icon="add"
                        style={{marginRight: 10}}   
                        navigate={navigation.navigate}
                        to="CreatePostJob"
                    />

                    {/*<ButtonRight
                        icon="menu"
                        navigate={navigation.navigate}
                        to="Settings"
                    />*/}

                </View>
            ),
        });

    // Fetch detail items
    // Example only options defined
    componentWillMount() {
        

    }


    openReviewApp = () => {
        var _options = _.extend({}, this.state.options);
        _options.isShowReviewApp = true;
        _options.applicationCount = 6;
        this.setState({options: _options});
    }

    PostAJob = () => {
        const { navigate, goBack } = this.props.navigation;
        navigate('CreatePostJob');
    }

    markAsShortList = () => {
        Alert.alert('Shortlist');
    }
    markAsUnsuitable = () => {
        Alert.alert('Unsuitable');
    }
    closeListing = () => {
        Alert.alert('Clost Listing Job');
    }

    onEndReached = () => {

        console.log(this.state.options);

        // We're already fetching
        if (this.state.options.isLoadingTail) {
            return;
        }
        var _options = _.extend({}, this.state.options);
        _options.isLoadingTail = true;
        this.setState({
            options: _options,
        });

        setTimeout(function(){

            _options.isLoadingTail = false;
            this.setState({
                options: _options,
            });

        }, 3000)

        // this.fetchPets();
    }

    renderFooter = () => {
        // if (!this.state.options.isLoadingTail) {
        //     return <View style={styles.scrollSpinner} />;
        // }
        if (this.state.options.isLoadingTail) {
            return <ActivityIndicator style={styles.scrollSpinner} />;
        }
    }

    render() {

        const pic = [
            {
                id: 1,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/13690662_777391902401412_7742506644238257845_n.jpg?oh=0a5c9f2ec8ab04ffa1533f67b65ca26a&oe=59977320',
            },
            {
                id: 2,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/17799245_820895741395836_893744169114306193_n.jpg?oh=9f5dbd67b6df76217571ec7b8804e6f1&oe=59993FD3',
            },
            {
                id: 3,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16508988_1075299335933144_3547182206399928845_n.jpg?oh=c1e90ca0968e7175be239e9131799261&oe=594CE7FD',
            },
            
            {
                id: 4,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/13690662_777391902401412_7742506644238257845_n.jpg?oh=0a5c9f2ec8ab04ffa1533f67b65ca26a&oe=59977320',
            },
            {
                id: 5,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/17799245_820895741395836_893744169114306193_n.jpg?oh=9f5dbd67b6df76217571ec7b8804e6f1&oe=59993FD3',
            },
            {
                id: 6,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16508988_1075299335933144_3547182206399928845_n.jpg?oh=c1e90ca0968e7175be239e9131799261&oe=594CE7FD',
            },
            
            {
                id: 7,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/13690662_777391902401412_7742506644238257845_n.jpg?oh=0a5c9f2ec8ab04ffa1533f67b65ca26a&oe=59977320',
            },
            {
                id: 8, 
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p160x160/17799245_820895741395836_893744169114306193_n.jpg?oh=9f5dbd67b6df76217571ec7b8804e6f1&oe=59993FD3',
            },
            {
                id: 9,
                uri: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/16508988_1075299335933144_3547182206399928845_n.jpg?oh=c1e90ca0968e7175be239e9131799261&oe=594CE7FD',
            },
            
        ];
        // console.log(this.state);
        return (
                
            <View style={[ styles.justFlexContainer, styles.mainScreenBg ,  {paddingBottom: 50}]} onPress={() =>  dismissKeyboard()}>


                    {false && (<View style={[styles.boxAvatarCoverContainer]}> 
                        <Image style={[styles.boxCover]} source={{uri: 'https://s3.amazonaws.com/cgimg/t/g60/374360/1286498_large.jpg'} }/>
                        <View style={[ styles.fullWidthHeightAbsolute ]}>

                            <View>
                                <Image
                                    style={[ styles.boxAvatar ]} 
                                    source={require('@assets/tmp/user-profile.jpg')}  
                                />
                                <Text style={{color: 'white', marginTop: 8}}>Title of job</Text>
                            </View>
                            <Text style={{color: 'white', marginTop: 2}}>{this.state.options.applicationCount} Application</Text>

                        </View>
                    </View>)}

                    {/* recomment talent */}
                    { !this.state.options.isShowReviewApp && (

                        <View style={[ styles.marginTopMD, styles.mainHorizontalPadding ]}>

                            <Text style={[ styles.grayLessText ]} onPress={ () => this.openReviewApp() }>Recommended talents</Text>

                            <View style={[ styles.boxWrapContainer, styles.marginTopXS ]}> 
                                
                                {pic.map((item, index) => {
                                    {/*console.log(item);*/}
                                    return (
                                        <TouchableOpacity
                                            activeOpacity = {0.9}
                                            key={ index } 
                                            style={[ styles.boxWrapItem, styles.boxWrapItemSizeSM, styles.marginBotXXS ]} 
                                        >

                                            <Image
                                                style={styles.userAvatarFull}
                                                source={{ uri: item.uri }}
                                            />

                                        </TouchableOpacity>     
                                    )
                                })}

                            </View>

                        </View>

                    )}

                    {/* if have someone apply to this job  */}
                    { this.state.options.isShowReviewApp && ( 

                        <View style={[ styles.marginTopMD ]}>

                            <Text style={[ styles.grayLessText, styles.mainHorizontalPadding ]} onPress={ () => {} }>Review applicants ({this.state.options.applicationCount})</Text>

                            <View style={[ styles.listContainer, styles.marginTopSM ]}>
                                <ListView
                                    dataSource={this.state.options.dataSource} 
                                    renderFooter={this.renderFooter}
                                    onEndReachedThreshold={10}
                                    onEndReached={() => {
                                        console.log("fired"); // keeps firing
                                    }}
                                    renderRow={(rowData) => <JobApplyRow {...rowData} func_1={this.markAsShortList} func_2={this.markAsUnsuitable} /> }
                                    
                                    automaticallyAdjustContentInsets={false}
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="always"
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>

                        </View>

                    )}
                
                <View style={styles.absoluteBoxBottom}>
                    <View style={[styles.txtContainer, {flex: 1}]}> 
 
                        <TouchableOpacity activeOpacity = {0.8} style={[styles.flatButton, styles.noRadius, styles.grayBg, styles.noBorder]} onPress={() => this.closeListing() }>
                            <Text style={[styles.flatBtnText, styles.btFontSize]}>CLOSE LISTING</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxAvatarCover, ...BoxWrap,

  scrollSpinner: {
    marginVertical: 20,
  },

})

// Smart Component
// Fetches detail items and maps to component props
export default connect(mapStateToProps, DetailActions)(ViewJobList)
