import { combineReducers } from 'redux'
import navigation from './navigation'
import detail from './detail'
import user from './user'
import message from './message'

const rootReducer = combineReducers({
    navigation,
    detail,
    message,
    user,
})

export default rootReducer
