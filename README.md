## :speech_balloon: react-redux-websocket-chat

![Screenshot](http://i.imgur.com/TOxmb3W.png)

A WebSocket-based application that authenticates Google profiles and allows them
to participate in a realtime chat.  Client uses React, Redux, and material-ui
components with react-bootstrap for layout.  Server uses Express, passport, and WebSockets.

Copy config.js.sample to config.js and fill with Google+ credentials.

The middleware for logging out and sockets is quick and hackish to make this a day project.

If you haven't, then `npm install -g babel-cli` and then:

```
npm install
webpack
npm start
```
