import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import ButtonBack from '@components/header/button-back';
import ButtonTextRight from '@components/header/button-text-right';
import { talent_category } from '@api/response';
import TagsSelect from '@styles/components/tags-select.style';

export default class LeaveReview extends Component{
    
    static navigationOptions = ({ navigation }) => ({ 
        headerTitle: 'Leave Review',
        headerLeft: (
            <ButtonBack
                isGoBack={ navigation }
                btnLabel= ""
            />),
 
        headerRight: (
            <TouchableOpacity style={{paddingRight:10}}>
                <Text>Submit</Text>
            </TouchableOpacity>)
    });

    constructor(props){
        super(props);
        this.state={
            textExperience:'',
            goodAt:talent_category,
            isEndorse:true
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.textCenter}>You are leaving a review for</Text>
                    <View style={styles.centerInRow}>
                        <Image style={styles.roundImage}
                            source={require('@assets/icon_profile.png')}/>
                        <Text>Applicant Name</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <Text>Applicant Name is good as...</Text>
                    <View style={styles.wrapRow}>
                        {this.state.goodAt.map((item,index) => {return(
                            <TouchableOpacity key={index}
                                activeOpacity={.9}
                                style={[styles.tagsSelectNormal, this.checkActiveTag(item) && styles.tagsSelected]} 
                                onPress={ () => this.selectedTag(item, index)} >
                                <Text style={[styles.tagTitle, styles.btFontSize, this.checkActiveTag(item) && styles.tagTitleSelected]}>
                                    {item.display_name}
                                </Text>
                            </TouchableOpacity>
                        );})}
                    </View>
                    <TouchableOpacity activeOpacity={.9}
                        style={[styles.tagsSelectNormal, {width:200}, !this.state.isEndorse && styles.tagsSelected]}
                        onPress={ 
                            () => this.setState((previousState) => {
                                return {isEndorse:!previousState.isEndorse};
                            })
                        }>
                        <Text style={[styles.tagTitle, styles.btFontSize, !this.state.isEndorse && styles.tagTitleSelected]}>
                            Choose not to endorse
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <Text style={{color:'rgb(193,193,193)'}}>How was your experience?</Text>
                    <TextInput placeholder='Great talent to work with, was professional and able to perform as needed!'
                        onChangeText={(textExperience) => {this.setState({textExperience})}}
                        value={this.state.textExperience}
                        multiline={true}
                        style={styles.inputContainer}/>
                </View>
            </View>
        );
    }

    checkActiveTag = (item) => {
        return item.selected;
    }

    selectedTag = (item, index) => {
        let _tmp = this.state.goodAt;
        _tmp[index].selected = !_tmp[index].selected;
        this.setState({
            goodAt: _tmp
        });
    }
}



const styles = StyleSheet.create({
    ...TagsSelect,
    container:{
        flex:1
    },
    subContainer:{
        flex:1, 
        padding:20,
        backgroundColor:'rgb(255,255,255)'
    },
    topSection:{
        backgroundColor:'rgb(249, 249, 249)', 
        padding:10, 
        alignItems:'center' 
    },
    roundImage:{
        width:30, 
        height:30, 
        borderRadius:15, 
        marginRight:10
    },
    textCenter:{
        textAlign:'center', 
        marginBottom:10
    },
    centerInRow:{
        flexDirection:'row', 
        alignItems:'center'
    },
    wrapRow:{
        flexDirection:'row', 
        flexWrap:'wrap',
        marginBottom:20,
        marginTop:20
    },
    line:{
        backgroundColor:'#000000', 
        height:1, 
        opacity:.05,
        marginBottom:20,
        marginTop:20
    },
    inputContainer:{
        borderRadius:5,
        padding:10,
        marginTop:10,
        color:'rgb(193,193,193)',
        height:100,
        backgroundColor:'rgb(246,246,2467)'
    },
});