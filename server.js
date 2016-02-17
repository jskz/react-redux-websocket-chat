import express from 'express'
import expressWs from 'express-ws'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import uuid from 'node-uuid'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'

import clientActions from './client/actions'
import config from './config'

const { BASE_URL,
    GOOGLE_RETURN_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SESSION_SECRET,
    STATIC_FILES,
    DESIRED_OAUTH_SCOPE } = config

const webSocketApp  = expressWs(express())
const app           = webSocketApp.app

const HTML = () =>
`<!DOCTYPE html>
<html>
    <head>
        <title>react-redux-chat</title>
    </head>

    <body>
        <div id="origin"></div>
        <script src="/bundle.js" type="text/javascript"></script>
    </body>
</html>`

/*
 * naively define an in-memory token "space", maybe switch this for Redis
 * and set TTL on keys
 */
let tokenSpace      = {},
    currentUsers    = []

passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser(function(obj, done) {
    done(null, obj)
})

app.use(session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(STATIC_FILES))

app.ws('/', function(ws, req) {
    let key, profileId, displayName, avatar = null

    try {
        key         = req.user.key
        profileId   = tokenSpace[key].profile.id
        displayName = tokenSpace[key].profile.displayName

        if(currentUsers.filter(u => u.id === profileId).length > 0) {
            ws.close()
            return
        }

        if(undefined !== typeof tokenSpace[key].profile.photos)
            avatar = tokenSpace[key].profile.photos[0].value

        currentUsers.push({
            joinedAt:   Date.now(),
            key:        key,
            avatar:     avatar,
            id:         profileId,
            name:       displayName,
            socket:     ws
        })

        currentUsers
            .filter(u => u.id !== profileId)
            .forEach(u => u.socket.send(JSON.stringify({
                type: clientActions.USER_JOINS_ROOM,
                data: {
                    id:             profileId,
                    displayName:    displayName,
                    avatar:         avatar
                }
        })))

        currentUsers.forEach(u => ws.send(JSON.stringify({
            type: clientActions.USER_JOINS_ROOM,
            data: {
                id:             u.id,
                displayName:    u.name,
                avatar:         u.avatar
            }
        })))
    } catch(e) {
        console.error(e)
        throw(e)
    }

    ws.on('close', function() {
        currentUsers = currentUsers.filter(u => u.key !== key)
        currentUsers.forEach(u => u.socket.send(JSON.stringify({
                type: clientActions.USER_LEAVES_ROOM,
                data: {
                    id:     profileId
                }
            })))
    })

    ws.on('message', function(msg) {
        let name = tokenSpace[req.user.key].profile.displayName
        let packet = JSON.parse(msg)

        switch(packet.type) {
            case 'CHAT_MESSAGE':
                let message = packet.data

                currentUsers.forEach(u => u.socket.send(JSON.stringify({
                    type: clientActions.CHAT_MESSAGE,
                    data: {
                        id: uuid.v4(),
                        from: name,
                        body: message
                    }
                })))
                break
        }
    })
})

app.get('/', function(req, res) {
    if(typeof req.user !== 'undefined') {
        res.send(HTML())
    } else {
        res.redirect('/login')
    }
})

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/login')
})

app.get('/login', function(req, res) {
    res.send(
        `<a href="/auth/google">Click here to login with Google+</a>`
    )
})

passport.use(new GoogleStrategy({
    clientID:           GOOGLE_CLIENT_ID,
    clientSecret:       GOOGLE_CLIENT_SECRET,
    callbackURL:        GOOGLE_RETURN_URL,
    scope:              DESIRED_OAUTH_SCOPE,
    passReqToCallback:  true
}, function(req, token, refreshToken, profile, done) {
    let uuidToken = uuid.v4()

    tokenSpace[uuidToken] = {
        key:        uuidToken,
        profile:    profile,
        createdAt:  Date.now()
    }

    done(null, {
        key: uuidToken
    })
}))

app.get('/auth/google', passport.authenticate('google'))
app.get('/auth/google/return',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login' }))

app.listen(8080, () => console.log('Listening on port 8080.'))
