import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import ListItem from '@styles/components/list-item.style';
import Ultilities from '@styles/extends/ultilities.style';
import TagsSelect from '@styles/components/tags-select.style';
import FlatForm from '@styles/components/flat-form.style';

import { ChatHelper, Helper } from '@helper/helper';

import _ from 'lodash'


const styles = StyleSheet.create({
    ...Ultilities,
    ...FlatForm,
    ...TagsSelect,
    ...ListItem,
});

// console.log(this);

export default class Row extends React.Component {


    _getCover = (item) => {
        // let item = this.state.jobInfo;
        const _objDetail = _.head(item.job_detail);
        return _.head(_objDetail.reference_detail) ? {uri: _.head(_objDetail.reference_detail).thumbnail_url_link} : require('@assets/img-default.jpg');
    }

    render() {
        //   const movie = this.props.data;
        // console.log('Props : ',this.props);
      return (

        <View style={[styles.itemContainer, styles.mainHorizontalPadding]}>

            <TouchableOpacity onPress= {() => this.props.rowPress(this.props)} activeOpacity = {0.8} style={[styles.itemSubContainerSM, styles.rowBorderBot, {backgroundColor: 'white', marginBottom: 0,paddingHorizontal: 0,}]}>   

                {/* avatar */}

                <Image source={ this._getCover(this.props) } style={styles.itemPhoto} /> 
                
                <View style={[ styles.infoContainer ]}>

                    <View>
                        {/* name */} 
                        <Text style={[ styles.itemTitle, { } ]}>
                            { _.head(this.props.job_detail).sub_reference_detail.title }
                        </Text>
                    </View>

                    <View style={[ styles.marginTopXXS ]}>
                        <Text style={[ styles.postDate, styles.btFontSizeSM, {textAlign: 'left'} ]}>
                            Applied { Helper._getTimeFromNow(this.props._created_at) }
                        </Text>
                    </View>


                </View>

            </TouchableOpacity>

            

        </View>

      )
    }
}
