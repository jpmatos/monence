import React from 'react'

import {withStyles} from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const useStyles = (theme) => ({
    root: {
        height: 380,
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    fab: {
        position: 'fixed',
        right: '5%',
        bottom: '5%',
        zIndex: 1050
    }
})

class FloatingActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            hidden: false
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Fab color='primary' aria-label='add' className={classes.fab} onClick={this.props.handleOnClickFAB}>
                <AddIcon/>
            </Fab>
        )
    }
}

export default withStyles(useStyles)(FloatingActionButton)
