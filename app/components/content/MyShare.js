import React from "react";
import Typography from "@material-ui/core/Typography";
import {withStyles} from '@material-ui/core/styles'
import {grey} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import Prompt from "../prompts/Prompt";
import {CalendarContext} from "../context/CalendarContext";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import Paper from '@material-ui/core/Paper';

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
})

class MyShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSharePromptOpen: false,
            userInviteEmail: '',
            validUserEmail: false
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

    handleInvite = () => {
        if(!this.state.validUserEmail)
            return

        const invite = {
            email: this.state.userInviteEmail
        }

        axios.post(`/calendar/${this.context.calendar.id}/invite`, invite)
            .then(res => {
                this.context.handleNewInvite(res.data.body)
                this.props.sendSuccessSnack(`Invited user ${res.data.body.email}`)
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

    handleDeleteInvite = (inviteId) => {
        axios.delete(`/calendar/${this.context.calendar.id}/invite/${inviteId}`)
            .then(res => {
                this.context.handleDeleteInvite(inviteId)
                this.props.sendSuccessSnack(`Deleted invite`)
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to delete invite!', err)
                console.debug(err)
            })
    }

    render() {
        const {classes} = this.props
        return (
            <React.Fragment>
                <Typography variant='h5' className={classes.pad}>
                    {'Calendar Status '}
                    <Typography variant='inherit' className={classes.status}>
                        {this.context.calendar.share}
                    </Typography>
                </Typography>
                {this.context.calendar.share === 'Personal' ?
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
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Email</TableCell>
                                            <TableCell align="left">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.context.calendar.invites.map((invite) => (
                                            <TableRow key={invite.email}>
                                                <TableCell component="th" scope="row">
                                                    {invite.email}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button variant="outlined" color="secondary" onClick={() => this.handleDeleteInvite(invite.id)}>
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
                            <Button variant="contained" color="primary" onClick={this.handleInvite}>
                                Invite
                            </Button>
                        </Grid>
                    </React.Fragment>)}
            </React.Fragment>
        );
    }
}

MyShare.contextType = CalendarContext

export default withStyles(useStyles)(MyShare)