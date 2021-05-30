import React from "react";
import Typography from "@material-ui/core/Typography";
import {withStyles} from '@material-ui/core/styles'
import {grey} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import Prompt from "../components/Prompt";
import {CalendarContext} from "../context/default/CalendarContext";
import axios from "axios";
import {InviteContext} from "../context/default/InviteContext";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from '@material-ui/icons/Refresh';

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

class MyShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSharePromptOpen: false,
            userInviteEmail: '',
            validUserEmail: false,
            isRefreshInvitesDisabled: false
        }
    }

    setSharePrompt = (value) => {
        this.setState({isSharePromptOpen: value})
    }

    handleConfirmPrompt = () => {
        axios.put(`/calendar/${this.context.calendarId}/share`)
            .then(res => {
                this.context.setCalendarShare()
            })
            .catch(err => {

            })
    }

    handleUserInviteEmailChange = (event) => {
        const value = event.target.value
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        this.setState({
            userInviteEmail: value,
            validUserEmail: value.match(emailRegex)
        })
    }

    handleInvite = (inviteContext) => {
        if (!this.state.validUserEmail)
            return

        const invite = {
            calendarId: this.context.calendarId,
            email: this.state.userInviteEmail
        }

        inviteContext.handleNewInvite(invite)
            .then(res => {
                this.props.sendSuccessSnack(`Invited user ${invite.email}`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to invite!', err)
                console.debug(err)
            })

        this.setState({
            userInviteEmail: '',
            validUserEmail: false
        })
    }

    handleDeleteInvite = (inviteContext, inviteId) => {
        inviteContext.handleDeleteInvite(inviteId)
            .then(res => {
                this.props.sendSuccessSnack(`Deleted invite`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to delete invite!', err)
                console.debug(err)
            })
    }

    handleRemoveParticipant = (participantId) => {
        this.context.handleRemoveParticipant(participantId)
            .then(res => {
                this.props.sendSuccessSnack(`Removed participant`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to kick participant!', err)
                console.debug(err)
            })
        // const user = {'id': id}
        // axios.put(`/calendar/${this.context.calendar.id}/kick`, user)
        //     .then(res => {
        //         this.context.handleRemoveInvitee(id)
        //         console.log(res)
        //         this.props.sendSuccessSnack(`Removed user`)
        //     })
        //     .catch(err => {
        //         this.props.sendErrorSnack('Failed to kick user!', err)
        //         console.debug(err)
        //     })
    }

    handleRefreshInvitesAndParticipants = (inviteContext) => {
        this.setState({isRefreshInvitesDisabled: true})
        inviteContext.handleRefreshSentInvites(this.context.calendarId)
        this.context.handleRefreshParticipants()
        setTimeout(() => {
            this.setState({isRefreshInvitesDisabled: false})
        }, 5000)
    }

    render() {
        const {classes} = this.props
        return (
            <InviteContext.Consumer>
                {inviteContext => (
                    <React.Fragment>
                        <Typography variant='h5' className={classes.pad}>
                            {'Calendar Status '}
                            <Typography variant='inherit' className={classes.status}>
                                {this.context.calendar.share}
                            </Typography>
                        </Typography>
                        {this.context.calendar.share !== 'Shared' ?
                            (<React.Fragment>
                                <Button variant="contained" color="primary" onClick={() => this.setSharePrompt(true)}>
                                    Share
                                </Button>
                                <Prompt isOpen={this.state.isSharePromptOpen}
                                        setOpen={this.setSharePrompt}
                                        onConfirm={this.handleConfirmPrompt}
                                        title='Share this calendar?'
                                        text='By setting this calendar to share, you will be able to invite
                        other users to participate in managing this calendar.'/>
                            </React.Fragment>) :
                            (<React.Fragment>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <TableContainer component={Paper} className={classes.table}>
                                        <Typography variant="h6" id="tableTitle"
                                                    component="div" className={classes.pendingInviteesTitle}>
                                            Participants
                                        </Typography>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Name</TableCell>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="left">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.context.calendar.participants.map((participant) => (
                                                    <TableRow key={participant.id}>
                                                        <TableCell component="th" scope="row">
                                                            {participant.name}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {participant.email}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Button variant="outlined" color="secondary"
                                                                    onClick={() => this.handleRemoveParticipant(participant.id)}>
                                                                Remove
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TableContainer component={Paper} className={classes.table}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="space-between"
                                            alignItems="center"
                                            className={classes.pendingInvitesTitle}
                                        >
                                            <Typography variant="h6" id="tableTitle"
                                                        component="div">
                                                Pending Invites
                                            </Typography>
                                            <IconButton aria-label="refresh" component="span"
                                                        onClick={() => this.handleRefreshInvitesAndParticipants(inviteContext)}
                                                        disabled={this.state.isRefreshInvitesDisabled}>
                                                <RefreshIcon/>
                                            </IconButton>
                                        </Grid>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="left">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inviteContext.sent.map((invite) => (
                                                    <TableRow key={invite.inviteeEmail}>
                                                        <TableCell component="th" scope="row">
                                                            {invite.inviteeEmail}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Button variant="outlined" color="secondary"
                                                                    onClick={() => this.handleDeleteInvite(inviteContext, invite.id)}>
                                                                Delete Invite
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TextField
                                        error={!this.state.validUserEmail && !(this.state.userInviteEmail === '')}
                                        id='Invite User'
                                        style={{width: 230}}
                                        label='User Email'
                                        placeholder='email@host.com'
                                        value={this.state.userInviteEmail}
                                        onChange={this.handleUserInviteEmailChange}
                                        type='string'
                                        className={classes.pad}
                                    />
                                    <Button variant="contained" color="primary"
                                            onClick={() => this.handleInvite(inviteContext)}>
                                        Invite
                                    </Button>
                                </Grid>
                            </React.Fragment>)}
                    </React.Fragment>)}
            </InviteContext.Consumer>
        );
    }
}

MyShare.contextType = CalendarContext

export default withStyles(useStyles)(MyShare)