import * as ActionTypes from '../constants/ActionTypes'
// import { user } from '../api/response'
import { UserHelper, StorageData } from '@helper/helper';

// Fetch and set user
export function setNotification(objAssign) {
    return (dispatch, getState) => {
        dispatch({
            notification: objAssign,
            type: ActionTypes.NOTIFICATION
        })
    }
}