import * as ActionTypes from '../constants/ActionTypes'
// import { user } from '../api/response'
import { UserHelper, StorageData } from '@helper/helper';

// Fetch and set user
export function setAppOption(objAssign) {
    return (dispatch, getState) => {        
        // setTimeout( () => { 
            dispatch({
                appOption: objAssign,
                type: ActionTypes.APP_OPTION
            })
        // },200)
 
    }
}