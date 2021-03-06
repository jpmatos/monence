import {TableCell} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {grey} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React from "react";
import ChangeRoleFormDialog from "../components/forms/ChangeRoleFormDialog";
import InviteUserFormDialog from "../components/forms/InviteUserFormDialog";
import Prompt from "../components/Prompt";
import PromptConfirm from "../components/PromptConfirm";
import {CalendarContext} from "../context/default/CalendarContext";
import {InviteContext} from "../context/default/InviteContext";

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
            isRefreshInvitesDisabled: false,
            isInviteUserFDOpen: false,
            isChangeRoleFDOpen: false,
            selectedParticipant: {},
            isUnsharePromptOpen: false
        }
    }

    setSharePrompt = (value) => {
        this.setState({isSharePromptOpen: value})
    }

    setUnsharePrompt = (event) => {
        this.setState({isUnsharePromptOpen: event})
    }

    setInviteUserFD = (value) => {
        this.setState({isInviteUserFDOpen: value})
    }

    setChangeRoleFD = (value, participant) => {
        if (!value)
            participant = {}

        this.setState({
            isChangeRoleFDOpen: value,
            selectedParticipant: participant
        })
    }

    handleShare = () => {
        this.context.setCalendarShare()
            .then(() => {
                this.props.sendSuccessSnack('Shared calendar')
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to share calendar!', err)
            })
    }

    handleUnshare = () => {
        this.context.setCalendarUnshare()
            .then(() => {
                this.props.sendSuccessSnack('Unshared calendar')
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to unshare calendar!', err)
            })
    }

    handleInvite = (inviteContext, invite) => {
        inviteContext.handleNewInvite(invite)
            .then(res => {
                this.props.sendSuccessSnack(`Invited user ${invite.email}`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to invite!', err)
                console.debug(err)
            })
    }

    handleDeleteInvite = (inviteContext, inviteId) => {
        axios.delete(`/invite/${inviteId}`)
            .then(res => {
                inviteContext.handleDeleteInvite(inviteId)
            })
            .then(res => {
                this.props.sendSuccessSnack(`Deleted invite`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to delete invite!', err)
                console.debug(err)
            })
    }

    handleChangeRole = (participantId, role) => {
        const roleBody = {
            role: role
        }

        return axios.put(`/calendar/${this.context.calendarId}/role/${participantId}`, roleBody)
            .then(res => {
                const participant = res.data.body
                this.context.handleChangeRole(participant)
            })
            .then(() => {
                this.props.sendSuccessSnack(`Changed participant role`)
            })
            .catch((err) => {
                this.props.sendErrorSnack('Failed to change participant role!', err)
                console.debug(err)
            })

    }

    handleRemoveParticipant = (participantId) => {
        return axios.put(`/calendar/${this.context.calendarId}/kick/${participantId}`)
            .then(res => {
                this.context.handleRemoveParticipant(participantId)
            })
            .then(res => {
                this.props.sendSuccessSnack(`Removed participant`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to kick participant!', err)
                console.debug(err)
            })
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
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Typography variant='h5' className={classes.pad}>
                                {'Calendar Status: '}
                                <Typography variant='inherit' className={classes.status}>
                                    {this.context.calendar.share}
                                </Typography>
                            </Typography>
                            {this.context.calendar.share === 'Shared' ?
                                <Box pt={2.5} pl={2}>
                                    <Button color="secondary" onClick={() => {
                                        this.setUnsharePrompt(true)
                                    }}>
                                        Unshare
                                    </Button>
                                    <PromptConfirm isOpen={this.state.isUnsharePromptOpen}
                                                   setOpen={this.setUnsharePrompt}
                                                   onConfirm={this.handleUnshare}
                                                   inputText={this.context.calendar.name}
                                                   title='Unshare this calendar?'
                                                   text='This action is irreversible! All participants will be kicked from the calendar! Type the name of the calendar to confirm.'/>

                                </Box> : null}
                        </Grid>
                        {this.context.calendar.share !== 'Shared' ?
                            (<React.Fragment>
                                <Button variant="contained" color="primary" onClick={() => this.setSharePrompt(true)}>
                                    Share
                                </Button>
                                <Prompt isOpen={this.state.isSharePromptOpen}
                                        setOpen={this.setSharePrompt}
                                        onConfirm={this.handleShare}
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
                                                    <TableCell align="left">Role</TableCell>
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
                                                            {participant.role}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            <Button variant="outlined" color="primary"
                                                                    onClick={() => this.setChangeRoleFD(true, participant)}>
                                                                Change Role
                                                            </Button>
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
                                            {/*<IconButton aria-label="refresh" component="span"*/}
                                            {/*            onClick={() => this.handleRefreshInvitesAndParticipants(inviteContext)}*/}
                                            {/*            disabled={this.state.isRefreshInvitesDisabled}>*/}
                                            {/*    <RefreshIcon/>*/}
                                            {/*</IconButton>*/}
                                        </Grid>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="left">Role</TableCell>
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
                                                            {invite.role}
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
                                    <Button variant="contained"
                                            color="primary"
                                            onClick={() => this.setInviteUserFD(true)}
                                            className={classes.pad}>
                                        Invite a User
                                    </Button>
                                </Grid>
                                <InviteUserFormDialog isOpen={this.state.isInviteUserFDOpen}
                                                      setOpen={this.setInviteUserFD}
                                                      handleInvite={(invite) => this.handleInvite(inviteContext, invite)}
                                                      calendarId={this.context.calendarId}/>
                                <ChangeRoleFormDialog isOpen={this.state.isChangeRoleFDOpen}
                                                      setOpen={this.setChangeRoleFD}
                                                      handleChangeRole={this.handleChangeRole}
                                                      participant={this.state.selectedParticipant}/>
                            </React.Fragment>)}
                    </React.Fragment>)}
            </InviteContext.Consumer>
        );
    }
}

MyShare.contextType = CalendarContext

export default withStyles(useStyles)(MyShare)