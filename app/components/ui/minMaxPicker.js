import React from 'react'
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Text,
    Picker
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';

import Utilities from '@styles/extends/ultilities.style';
import { Colors } from '@themes/index'

import { ages } from '@api/response'
import { Helper } from '@helper/helper';
const Item = Picker.Item;
class minMaxPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            myheight:{
                val:''
            },
            myweight:{
                val: ''
            },
            age:{
                val:''
            },
            ageModalVisible:false,
            weightModalVisible:false,
            heightModalVisible:false
        }
        console.log("Props Object",this.props);
    }
    // generatePicker(itemObject, type){
    //     return(
    //         <View style={[styles.justFlexContainer]}>
    //             { Helper._isAndroid()  && 
    //                 <View style = {styles.itemPicker}>
    //                     <Picker
    //                         selectedValue={this.state.selectedEthnicity}
    //                         onValueChange={(item) => this.onAgeChange(item)}>
    //                         <Item label="Male" value="Male" color={ this.state.selectedEthnicity == 'Male' ? '#4a4a4a':'#9B9B9B'} />
    //                         <Item label="Female" value="Female" color={ this.state.selectedEthnicity == 'Female' ? '#4a4a4a':'#9B9B9B'} />
    //                     </Picker>
    //                 </View>
    //             } 

    //             { Helper._isIOS()  && 
    //                 <View> 
    //                     <Modal
    //                         animationType={"slide"}
    //                         transparent={true}
    //                         visible={ type == 'age' ? this.state.ageModalVisible : 
    //                         (type == 'height' ? this.state.heightModalVisible : this.state.weightModalVisible)}
    //                         onRequestClose={() => {alert("Modal has been closed.")}} >

    //                         <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
    //                             <View style = {styles.pickerTitleContainer}>
    //                                 <Text style={[styles.fontBold, {textAlign: 'left', color: '#4a4a4a', padding:10, left: 10} ]}>Select {type == 'age' ? type : type + ' color'} </Text>
    //                             <TouchableOpacity activeOpacity = {0.8}
    //                                 style={[ {backgroundColor: Colors.componentDarkBackgroundColor, position:'absolute', padding:10, right:10} ]}
    //                                 onPress={() => {
    //                                     this.setModalVisible(false, type)
    //                                 }}>
    //                                 <Text style={[styles.fontBold, {textAlign: 'right', color: '#3b5998'} ]}>Done</Text>
    //                             </TouchableOpacity>
    //                             </View>
    //                             <View style={[ {backgroundColor: 'white'} ]}>
    //                                 <Picker
    //                                     selectedValue={ type == 'age' ? this.state.age.val :
    //                                         (type == 'height' ? this.state.myheight.val : this.state.myweight.val)}
    //                                     onValueChange={(item) => this.onPickerChange(item, type)}>
    //                                     {
    //                                         itemObject.map((item, index) => {
    //                                             return(
    //                                                 <Item key={index} label={item.min && 'to' && item.max} value={item.minmax} />
    //                                             )
    //                                         })
    //                                     }
    //                                 </Picker>
    //                             </View>
    //                         </View>
    //                     </Modal>

    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             this.setModalVisible(true, type)
    //                             let val = type == 'age' ? this.state.age.val : 
    //                             (type == 'height' ? this.state.height.val : this.state.weight.val);
    //                             if(val == '')
    //                                 this.onPickerChange(itemObject[0].min, type);
    //                         }}>
    //                         <View style = {styles.itemPicker}>
    //                             {
    //                                 type == 'age' && 
    //                                 <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color: this.state.age.val ? 'black':'#9B9B9B'}]}>{ this.state.age.val || 'Select ethnicity' }</Text>
    //                             }

    //                             {
    //                                 type == 'height' && 
    //                                 <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color: this.state.height.val ? 'black':'#9B9B9B'}]}>{ this.state.height.val || 'Select hair color' }</Text>
    //                             }

    //                             {
    //                                 type == 'weight' && 
    //                                 <Text style={[ styles.flatInputBoxFont, {textAlign:'right',color: this.state.weight.val ? 'black':'#9B9B9B'}]}>{ this.state.weight.val || 'Select eye color' }</Text>
    //                             }
    //                         </View>
    //                     </TouchableOpacity>
    //                 </View>
    //             }
    //         </View>
    //     )
    // }    

    setModalVisible(visible, type) {
        if(type == 'age'){
            this.setState({ageModalVisible: visible})
        }else if(type == 'height'){
            this.setState({heightModalVisible: visible})
        }else if(type == 'weight'){
            this.setState({weightModalVisible: visible})
        }
    }

    onPickerChange(text, type){
        if(type == 'age'){
            this.setState({age: {
                val:text
            }})
        }else if(type == 'height'){
            this.setState({myheight:{
                val:text
            }})
        }else if(type == 'weight'){
            this.setState({myweight:{
                val:text
            }})
        }
        this.props.onPickerChangeValue(text,type);
    }  

    onHeightChanged(text){
        let reSing=/^[0-9]{0,3}$/;
        if(reSing.test(text)){
            this.setState({ height:{
                val:text
            } })
        }
        // this.props.onPickerChangeValue(text,"height");
    }

    onWeightChanged(text){
        let reSing=/^[0-9]{0,3}$/;
        if(reSing.test(text)){
            this.setState({ weight: {val:text} })
        }
        // this.props.onPickerChangeValue(text,"weight");
    }

    onAgeChange(text){
        // console.log('Ethnicity: ', text);
        this.setState({age: {
            age:text
        }})
        // this.props.onPickerChangeValue(text,"age");
    }  
    render() {

        const { tintColor, icon, iconType } = this.props
        let that=this;
        const itemObject=this.props.myData;
        const type=this.props.type
        return (

            <View style={[styles.justFlexContainer]}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={ type == 'age' ? this.state.ageModalVisible : 
                    (type == 'height' ? this.state.heightModalVisible : this.state.weightModalVisible)}
                    onRequestClose={() => {alert("Modal has been closed.")}} >

                    <View onPress = {()=>{ }} style={{flex: 1, justifyContent: 'flex-end',marginTop: 22}}>
                        <View style = {styles.pickerTitleContainer}>
                            <Text style={[styles.fontBold, {textAlign: 'left', color: '#4a4a4a', padding:10, left: 10} ]}>Select {type == 'age' ? type : type + ' color'} </Text>
                        <TouchableOpacity activeOpacity = {0.8}
                            style={[ {backgroundColor: Colors.componentDarkBackgroundColor, position:'absolute', padding:10, right:10} ]}
                            onPress={() => {
                                this.setModalVisible(false, type)
                            }}>
                            <Text style={[styles.fontBold, {textAlign: 'right', color: '#3b5998'} ]}>Done</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={[ {backgroundColor: 'white'} ]}>
                            <Picker
                                selectedValue={ type == 'age' ? this.state.age.val :
                                    (type == 'height' ? this.state.myheight.val : this.state.myweight.val)}
                                onValueChange={(item) => this.onPickerChange(item, type)}>
                                {
                                    itemObject.map((item, index) => {
                                        return(
                                            <Item key={index} label={item.minMax} value={item.minMax} />
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity
                    onPress={() => {
                        this.setModalVisible(true, type)
                        let val = type == 'age' ? this.state.age.val : 
                        (type == 'height' ? this.state.myheight.val : this.state.myheight.val);
                        if(val == '')
                            this.onPickerChange(itemObject[0].min, type);
                    }}>
                    <View style = {styles.itemPicker}>
                        {
                            type == 'age' && 
                            <Text style={[ styles.flatInputBoxFont, {fontSize:16,textAlign:'right',color:'black'}]}>{ this.state.age.val || 'Select Range Of Age' }</Text>
                        }

                        {
                            type == 'height' && 
                            <Text style={[ styles.flatInputBoxFont, {fontSize:16,textAlign:'right',color:'black'}]}>{ this.state.myheight.val || 'Select Range Of Height' }</Text>
                        }

                        {
                            type == 'weight' && 
                            <Text style={[ styles.flatInputBoxFont, {fontSize:16,textAlign:'right',color:'black'}]}>{ this.state.myweight.val || 'Select Range Of Weight' }</Text>
                        }
                    </View>
                </TouchableOpacity>
            </View>

        )

    }
}

const styles = StyleSheet.create({
    ...Utilities,
        itemPicker:{
        backgroundColor: 'transparent',
        borderRadius: 5,  
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'stretch',
        paddingLeft: 10,
        minHeight:20
    },
    pickerTitleContainer:{
        flexDirection: 'row',
        backgroundColor: Colors.componentDarkBackgroundColor,
        height: 35,
    },
})



export default minMaxPicker;