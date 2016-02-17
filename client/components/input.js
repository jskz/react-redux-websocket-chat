import React from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/lib/text-field'
import actions from '../actions'

function mapStateToProps(state) {
    return {
        input: state.input
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onChange: (e) => dispatch({ type: actions.INPUT_CHANGED, data: e.target.value }),
        onKeyDown: function(e) {
            if(13 === e.keyCode) {
                dispatch({ type: actions.INPUT_SUBMITTED, data: e.target.value })
            }
        }
    }
}

class Input extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TextField fullWidth={true}
                hintText="Chat message..."
                value={this.props.input}
                {...this.props} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Input)
