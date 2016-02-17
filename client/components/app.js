import 'babel-polyfill'

import React from 'react'
import { connect } from 'react-redux'

import AppBar from 'material-ui/lib/app-bar'
import FlatButton from 'material-ui/lib/flat-button'
import Paper from 'material-ui/lib/paper'
import FlexboxGrid from 'react-flexbox-grid'

import Chat from './chat'
import Input from './input'
import Users from './users'

import { Grid, Row, Col } from 'react-bootstrap'
import actions from '../actions'

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appBar: {
            logout: {
                onClick: () => dispatch({ type: actions.LOGOUT })
            }
        }
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Paper zDepth={1}>
                <AppBar
                    title="Chat App"
                    iconElementRight={<FlatButton {...this.props.appBar.logout} label="Logout" />}
                />

                <Grid fluid>
                    <Row>
                        <Col xs={8} sm={8} md={8} lg={8}>
                            <Chat />
                        </Col>

                        <Col xs={4} sm={4} md={4} lg={4}>
                            <Users />
                        </Col>
                    </Row>

                    <Row>
                        <Input />
                    </Row>
                </Grid>
            </Paper>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
