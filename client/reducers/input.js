import actions from '../actions'

export default function reducer(state = ``, action) {
    switch(action.type) {
        case actions.INPUT_SUBMITTED:
            state = ``
            return state

        case actions.INPUT_CHANGED:
            state = action.data
            return state
    }

    return state
}
