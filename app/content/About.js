import {Link} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from 'react'
import Logo from "../img/monence.svg";
import ReactLogo from "../img/react.svg"
import WebpackLogo from "../img/webpack.svg"
import SocketIoLogo from "../img/socketio.svg"
import MongoDBLogo from "../img/mongodb.svg"
import NodeJsLogo from "../img/nodejs.svg"
import OAuth2Logo from "../img/oauth.svg"
import ExpressLogo from "../img/express.svg"

const useStyles = (theme => ({
    root: {
        height: '50vh',
    }
}));

function ListIcon(props) {
    return (
        <Box m={2}>
            <Link href={props.href} target="_blank"><img src={props.src} alt={props.alt} width="100px"/></Link>
        </Box>
    )
}

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props
        return (
            <Grid container
                  direction="column"
                  justify="center"
                  alignItems="center">
                <Box mb={5} mr={5} mt={3}>
                    <img src={Logo} alt="Logo" width="400px"/>
                </Box>
                <Typography>
                    Monence is a Web Application developed as a senior year academic project.
                </Typography>
                <Typography>
                Project repository available at <Link href="https://github.com/jpmatos/monence" target="_blank">GitHub</Link>. Licensed under GPLv3.
                </Typography>
                <Box mt={5}>
                <Typography>
                    Powered by:
                </Typography>
                </Box>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <ListIcon href="https://reactjs.org/" src={ReactLogo} alt="React Logo"/>
                    <ListIcon href="https://nodejs.org/" src={NodeJsLogo} alt="NodeJs Logo"/>
                    <ListIcon href="https://webpack.js.org/" src={WebpackLogo} alt="Webpack Logo"/>
                    <ListIcon href="https://expressjs.com/" src={ExpressLogo} alt="Express Logo"/>
                    <ListIcon href="https://socket.io/" src={SocketIoLogo} alt="WebSocket Logo"/>
                    <ListIcon href="https://www.mongodb.com/" src={MongoDBLogo} alt="MongoDB Logo"/>
                    <ListIcon href="https://oauth.net/2/" src={OAuth2Logo} alt="OAuth2 Logo"/>
                </Grid>
                <Typography>
                    And many more JavaScript libraries...
                </Typography>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(About)