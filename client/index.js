import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { compose, applyMiddleware, createStore } from 'redux'
import ready from 'domready'
import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './components/app'
import actions from './actions'
import reducer from './reducers'

import { DEFAULT_PORT } from '../config'

let socket = null

const logoutRedirectMiddleware = store => next => action => {
    if(actions.LOGOUT === action.type) {
        console.log('Logout triggered.')
        if(null !== socket) {
            socket.close()
        }

        const logoutUrl = `//${window.location.host}${window.location.pathname}logout`
        window.location.assign(logoutUrl)
    } else {
        next(action)
    }
}

const webSocketMiddleware = store => next => action => {
    if(actions.INPUT_SUBMITTED === action.type) {
        if(null !== socket) {
            socket.send(JSON.stringify({
                type: actions.CHAT_MESSAGE,
                data: action.data
            }))
        }
    }

    next(action)
}

const finalCreateStore = compose(
    applyMiddleware(
        logoutRedirectMiddleware,
        webSocketMiddleware
    )
)(createStore)

const store = finalCreateStore(reducer)

ready(() => {
    injectTapEventPlugin()

    socket = new WebSocket(`ws://${window.location.hostname}:${DEFAULT_PORT}/`)
    socket.onmessage = (m) => {
        try {
            let message = JSON.parse(m.data)
            store.dispatch(message)
        } catch(e) {
            console.error(e)
            throw(e)
        }
    }

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('origin'))
})
