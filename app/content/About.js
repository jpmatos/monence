import {withStyles} from "@material-ui/core/styles";
import React from 'react'

const useStyles = (theme => ({
    root: {
        height: '50vh',
    }
}));

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props
        return (
            <h4>Under Construction</h4>
        )
    }
}

export default withStyles(useStyles)(About)