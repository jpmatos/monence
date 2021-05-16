import React from 'react'
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = (theme => ({
    root: {
        height: '50vh',
    }
}));

class MySettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props
        return (
            <h4>TODO</h4>
        )
    }
}

export default withStyles(useStyles)(MySettings)