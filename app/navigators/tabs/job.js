import {
    createStackNavigator,
} from 'react-navigation';

// talent seeker (employer)
import Job from '@components/job/job'
// import PostJobList from '@components/job/talent-seeker/post-job-list'
// import CreatePostJob from '@components/job/talent-seeker/create-post-job'
// import ViewPostJob from '@components/job/talent-seeker/view-post-job'     
// import JobDetail from '@components/job/talent-seeker/job-detail'

// import AvailableJob from '@components/job/talent/available-job'
// import AppliedJob from '@components/job/talent/applied-job'

// import ProfileUser from '@components/user/profile'
// import MessageDetail from '@components/message/message'

// import { Colors } from '@themes/index';
import { headerStyle, titleStyle } from '@styles/header.style'

// import { UserHelper, StorageData, Helper } from '@helper/helper';

import { transparentHeaderStyle, defaultHeaderStyle } from '@styles/components/transparentHeader.style';


// console.log('sowowo : ', props);
const TabBarComponent = (props) => {
    console.log('TabBarComponent Props: ', props);
}
const options = {
    // initialRouteName: 'CreatePostJob',
    // initialRouteName: 'JobDetail',
    initialRouteName: 'JobList',
    navigationOptions:{
        headerStyle: headerStyle,  
        headerTitleStyle: titleStyle,
        // headerTintColor: Colors.textColorDark,
    }
}

const navOptions =  {   
    headerStyle: defaultHeaderStyle,   
    // headerTintColor: Colors.textColorDark, 
}


export default createStackNavigator({

    // JobList:   { screen: UserHelper._isEmployer() ? PostJobList : JobTab },
    // JobList:   { screen: PostJobList },
    JobList:   { 
        screen: Job,
        navigationOptions: ({ navigation }) => ({ 
            ...navOptions,
        })
    },
    // CreatePostJob:   { 
    //     screen: CreatePostJob,
    //     navigationOptions: ({ navigation }) => ({ 
    //         // ...navOptions,
    //     }) 
    // },
    // ViewPostJob:   { 
    //     screen: ViewPostJob,
    //     navigationOptions: ({ navigation }) => ({ 
    //         // ...navOptions,
    //     })
    // },
    // JobDetail: { 
    //     screen: JobDetail,
    //     navigationOptions: ({ navigation }) => ({ 
    //         // ...navOptions,
    //     })
    // },

    // AvailableJob: { 
    //     screen: AvailableJob,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    // },
    // AppliedJob: { 
    //     screen: AppliedJob,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    // },

    // Profile:   { 
    //     screen: ProfileUser,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    //  },
    //  Message:   { 
    //     screen: MessageDetail,
    //     navigationOptions: ({ navigation }) => ({ 
    //         ...navOptions,
    //     })
    //  },
    // AvailableAppliedJob: { screen: JobTab},

}, options);
