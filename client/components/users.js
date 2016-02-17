import React from 'react'
import { connect } from 'react-redux'

import Avatar from 'material-ui/lib/avatar'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'

function mapStateToProps(state) {
    return {
        users: state.users
    }
}

class Users extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <List subheader="Users">
                    {this.props.users.map(user =>
                        <ListItem
                            key={user.id}
                            primaryText={user.name}
                            leftAvatar={<Avatar src={user.avatar} />}
                        />
                    )}
                </List>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Users)
