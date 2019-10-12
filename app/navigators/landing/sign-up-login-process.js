import React from 'react'

import {
    createStackNavigator,
} from 'react-navigation';

// import SignUp from '@components/signup/signup-info'
// import WhoAreYou from '@components/signup/who-are-you'

// // Talent Seeker
// import TalentSeekerCategory from '@components/signup/talent-seeker/talent-seeker-category' 
// // import TalentSeekerWelcome from '@components/signup/talent-seeker/talent-seeker-welcome'
 
// // Talent
// import TalentCategory from '@components/signup/talent/talent-category' 
// // import TalentWelcome from '@components/signup/talent/talent-welcome' 
// import TalentDetail from '@components/signup/talent/talent-detail' 

// import TalentWelcome from '@components/signup/welcome' 

// import UploadPhoto from '@components/signup/upload-photo' 
// import UploadVideo from '@components/signup/upload-video'

import Authenticate from '@components/authentication/authenticate'

import { Colors } from '@themes/index';
import { transparentHeaderStyle, titleStyle } from '@styles/components/transparentHeader.style';

// const options = {
//     headerMode: 'screen',  
//     initialRouteName: 'LogIn',
//     // initialRouteName: 'SignUp',
//     // initialRouteName: 'TalentUploadVideo',
    
// }

const options = {
    headerMode: 'screen',  
    // initialRouteName: 'UploadPhoto', 
    // initialRouteName:'TalentSeekerWelcome',
    // initialRouteName: 'UploadVideo',
    initialRouteName: 'LogIn',  
    // initialRouteName: 'SignUp',   
    // initialRouteName: 'TalentWelcome',   
    // initialRouteName: 'TalentDetail',   
    lazyLoad: true,
}

const navOptions =  ({ navigation }) => ({
    tabBarVisible: false,
    headerVisible: false, 
    headerStyle: transparentHeaderStyle,  
    headerTintColor: Colors.textColorDark, 
});

export default createStackNavigator({

    // sign-up & sign-in main page
    LogIn:   { screen: Authenticate, navigationOptions: {navOptions}},   
    // SignUp: { screen: SignUp, navigationOptions: navOptions },
    // WhoAreYou: { screen: WhoAreYou , navigationOptions: navOptions},

    // // talent seeker (who need actor ...)
    // TalentSeekerCategory: { screen: TalentSeekerCategory, navigationOptions: navOptions },
    // TalentSeekerWelcome: { screen: TalentWelcome, navigationOptions: navOptions },

    // // talent (w ho need job)
    // TalentCategory: { screen: TalentCategory, navigationOptions: navOptions },
    // TalentWelcome: { screen: TalentWelcome, navigationOptions: navOptions },
    // TalentDetail: { screen: TalentDetail, navigationOptions: navOptions },

    // UploadPhoto: { screen: UploadPhoto, navigationOptions: navOptions },
    // UploadVideo: { screen: UploadVideo, navigationOptions: navOptions },

}, options);
