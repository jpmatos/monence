import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {grey} from "@material-ui/core/colors";
import {withStyles} from "@material-ui/core/styles";
import {CalendarContext} from "../context/default/CalendarContext";
import {InviteContext} from "../context/default/InviteContext";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

const useStyles = (theme) => ({
    pad: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    padTop: {
        marginTop: theme.spacing(3)
    },
    status: {
        background: grey[100],
        padding: '5px',
        fontFamily: 'sans-serif'
    },
    table: {
        marginTop: theme.spacing(3),
        minWidth: 300,
        maxWidth: 800
    },
    pendingInvitesTitle: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1)
    },
    pendingInviteesTitle: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(2)
    }
})

class MyShareParticipant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshInvitesDisabled: false
        }
    }

    handleRefreshParticipants = () => {
        this.setState({isRefreshInvitesDisabled: true})

        this.context.handleRefreshParticipants()

        setTimeout(() => {
            this.setState({isRefreshInvitesDisabled: false})
        }, 5000)
    }

    render() {
        const {classes} = this.props
        return (
            <TableContainer component={Paper} className={classes.table}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    className={classes.pendingInvitesTitle}
                >
                    <Typography variant="h6" id="tableTitle"
                                component="div" className={classes.pendingInviteesTitle}>
                        Participants
                    </Typography>
                    <IconButton aria-label="refresh" component="span"
                                onClick={this.handleRefreshParticipants}
                                disabled={this.state.isRefreshInvitesDisabled}>
                        <RefreshIcon/>
                    </IconButton>
                </Grid>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={this.context.calendar.owner.ownerId}>
                            <TableCell component="th" scope="row">
                                {this.context.calendar.owner.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {this.context.calendar.owner.email}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Owner
                            </TableCell>
                        </TableRow>
                        {this.context.calendar.participants.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell component="th" scope="row">
                                    {participant.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {participant.email}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {participant.role}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

MyShareParticipant.contextType = CalendarContext

export default withStyles(useStyles)(MyShareParticipant)