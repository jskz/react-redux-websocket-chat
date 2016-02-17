import actions from '../actions'

const initialState = []

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actions.CHAT_MESSAGE:
            return [...state, action.data]
    }

    return state
}
