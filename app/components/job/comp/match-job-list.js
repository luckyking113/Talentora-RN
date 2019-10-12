import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import ListItem from '@styles/components/list-item.style';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '@styles/card.style'
import Utilities from '@styles/extends/ultilities.style';
import FlatForm from '@styles/components/flat-form.style';
import TagsSelect from '@styles/components/tags-select.style';

import BoxWrap from '@styles/components/box-wrap.style';

import { ChatHelper, Helper } from '@helper/helper';

import _ from 'lodash'

import CacheableImage from 'react-native-cacheable-image';

// console.log(this);  

export default class MatchJobRow extends React.PureComponent {

    goToJobDetail = (_jobId) => { 
        // console.log(_jobId, '==', this.props.navigation);
        const { navigate, goBack } = this.props.navigation;
        navigate('JobDetail', {job: _jobId});

    }

    _getCover = (item) => {
        const _objDetail = _.head(item.job_detail);
        return _.head(_objDetail.reference_detail) ? {uri: _.head(_objDetail.reference_detail).thumbnail_url_link} : require('@assets/job-banner.jpg');
    }

    _getKinds = (item) => {
        if(item.criteria)
            return item.criteria.type;
        else
            return [];
    }

    _checkKindsMoreThenFour = (item) => {
        if(item.criteria)
            return item.criteria.type>4;
        else
            return false;
    }


    render() {
        //   const movie = this.props.data;
        // console.log('Match Job List : ',this.props.allJobList);
      return (

            <View style={[ styles.justFlexContainer]}>


                <View style={[ styles.boxWrapContainerNew, styles.mainHorizontalPaddingMD ]}>
                    
                    { this.props.allJobList.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity = {0.9} 
                                key={ index }
                                onPress={() => this.goToJobDetail(item)}
                                style={[ styles.boxWrapItem, styles.boxWrapItemTwoCol, index==0 && {  marginRight: 10 }]}   
                            >

                                <View style={[ {flex:1 , height: 200} ]}>
                                    {/*<Image 
                                        style={[styles.bgCover, styles.resizeMode]}  
                                        source={ this._getCover(item) }
                                    />*/}
                                    <CacheableImage 
                                        resizeMode="cover"
                                        style={[styles.bgCover, styles.resizeMode]}
                                        source={ this._getCover(item) } />
                                </View>

                                <View style={[ styles.fullWidthHeightAbsolute, styles.defaultContainer, styles.infoBottom, styles.mainVerticalPaddingSM, styles.mainHorizontalPaddingMD ]}>

                                    <Text style={[ {color: 'white', textAlign: 'left'}, styles.fontBold, styles.marginBotXXS ]}>{ item.title }</Text> 

                                    <View style={[styles.tagContainerNormal,styles.paddingBotNavXS]}> 

                                        { this._getKinds(item).map((item_sub, index_sub) => {
                                            if(index_sub<4){
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity = {1}
                                                        key={ index_sub } 
                                                        style={[styles.tagsSelectNormal, styles.tagsSelected, styles.noBorder, styles.noMargin, styles.marginTopXXS, {paddingHorizontal: 5,}]} 
                                                    >
                                                        <Text style={[styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM, styles.tagTitleSelected]}>
                                                            { Helper._capitalizeText(item_sub) }
                                                        </Text>
                                                        
                                                    </TouchableOpacity>     
                                                )
                                            }
                                        })}

                                        {
                                            this._checkKindsMoreThenFour(item) && 
                                            <TouchableOpacity
                                                activeOpacity = {1}
                                                style={[styles.tagsSelectNormal, styles.tagsSelected, styles.noBorder, styles.noMargin, styles.marginTopXXS, {paddingHorizontal: 5,}]} 
                                            >
                                                <Text style={[styles.tagTitle, styles.btFontSize, styles.tagTitleSizeSM, styles.tagTitleSelected]}>
                                                    { this._getKinds(item).length - 4}+
                                                </Text>
                                                
                                            </TouchableOpacity>   
                                        }

                                    </View>

                                </View>

                            </TouchableOpacity>     
                        )
                    })}

                    { this.props.allJobList.length==1 && <View style={[ styles.boxWrapItem, styles.boxWrapItemTwoCol, {opacity:0} ]}></View> }

                </View>


            </View>

      )
    }
}

const styles = StyleSheet.create({ ...Styles, ...Utilities, ...FlatForm, ...BoxWrap, ...TagsSelect,

})
