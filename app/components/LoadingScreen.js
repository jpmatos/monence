import {createMuiTheme, CssBaseline, MuiThemeProvider, withStyles} from "@material-ui/core"
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

const useStyles = theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1
    }
})

const themeLight = createMuiTheme({
    palette: {
        background: {
            default: "#fff"
        }
    }
});

class LoadingScreen extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const classes = this.props
        return (
            <MuiThemeProvider theme={themeLight}>
                <CssBaseline/>
                <Backdrop open={true} invisible={true}>
                    <CircularProgress color="primary"/>
                </Backdrop>
            </MuiThemeProvider>
        )
    }
}

export default withStyles(useStyles)(LoadingScreen)
