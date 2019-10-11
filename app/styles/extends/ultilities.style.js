import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

export default {

    // shadow box
    shadowBox: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 3,
        shadowOpacity: 0.2
    },


    // image
    bgCover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },


    // other
    bgOverlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        width: width,
    },


    // align
    textCenter: {
        textAlign: 'center'
    },

    // flexbox
    flexVerMenu : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        // alignItems: 'stretch',
    }
}