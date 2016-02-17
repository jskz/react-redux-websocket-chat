import actions from '../actions'

const initialState = []

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actions.USER_JOINS_ROOM:
            return [...state, {
                id: action.data.id,
                name: action.data.displayName,
                avatar: action.data.avatar
            }]

        case actions.USER_LEAVES_ROOM:
            return state.filter(user => user.id !== action.data.id)
    }
    return state
}
