import { combineReducers } from 'redux'
import chatReducer from './chat'
import inputReducer from './input'
import usersReducer from './users'

export default combineReducers({
    chat:   chatReducer,
    input:  inputReducer,
    users:  usersReducer
})
