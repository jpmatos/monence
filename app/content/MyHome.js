import React from 'react'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import {UserContext} from "../context/default/UserContext";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {CalendarContext} from "../context/default/CalendarContext";
import {FormControl, FormHelperText, InputLabel, NativeSelect, TableCell, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";

const useStyles = (theme => ({
    large: {
        marginTop: theme.spacing(3),
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
    },
    calendar: {
        minWidth: 250
    },
    logout: {
        height: '100vh'
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
    }
}))

class MyHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedCreate: false,
            calendarName: null,
            validCalendarName: true,
            currency: 'EUR',
            isRefreshInvitesDisabled: false
        }
    }

    clickCreateNewCalendar = () => {
        this.setState({
            clickedCreate: true
        })
    }

    handleCalendarNameChange = (event) => {
        this.setState({
            calendarName: event.target.value,
            validCalendarName: event.target.value !== ''
        })
    }

    handleCreateCalendar = () => {
        if (!this.state.validCalendarName)
            return

        if (this.state.calendarName === null || this.state.validCalendarName === '') {
            this.setState({
                validCalendarName: false
            })
            return
        }

        const calendar = {
            name: this.state.calendarName,
            currency: this.state.currency
        }

        this.context.handleCreateCalendar(calendar)
            .then(() => {
                this.props.sendSuccessSnack('Created calendar!')
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to create calendar!', err)
                console.debug(err.stack)
            })
        this.setState({
            clickedCreate: false
        })
    }

    handleCurrencyChange = (event) => {
        this.setState({currency: event.target.value})
    }

    handleOnCalendarChange = (event, calendarContext) => {
        window.history.replaceState(null, '', window.location.href.split('?')[0] + '?c=' + event.target.value)
        calendarContext.setCalendarId(event.target.value)

    }

    handleLogout = () => {
        this.context.handleLogout()
    }

    handleAcceptInvite = (inviteId) => {
        this.context.handleAcceptInvite(inviteId)
            .then(() => {
                this.props.sendSuccessSnack('Accepted invite!')
            })
            .catch(err => {
                this.props.sendErrorSnack('Failed to accept invite!', err)
                console.debug(err)
            })
    }

    handleDeclineInvite = (inviteId) => {
        this.context.handleDeclineInvite(inviteId)
            .then(() => {
                this.props.sendSuccessSnack('Declined invite!')
            })
            .catch((err) => {
                this.props.sendErrorSnack('Failed to decline invite!', err)
                console.debug(err)
            })
    }

    handleRefreshPendingInvites = () => {
        this.setState({isRefreshInvitesDisabled: true})
        this.context.handleRefreshPendingInvites()
        setTimeout(() => {
            this.setState({isRefreshInvitesDisabled: false})
        }, 5000)
    }

    render() {
        const {classes} = this.props
        return (
            <CalendarContext.Consumer>
                {calendarContext => (
                    <Grid container
                          direction="column"
                          justify="center"
                          alignItems="center">
                        <Avatar alt="Current User" src={this.context.session.photo}
                                className={classes.large}/>
                        <Box mt={3}>
                            <Typography variant='h4'>
                                {this.context.session.name}
                            </Typography>
                        </Box>
                        <Box mb={4}>
                            <Button color="secondary" onClick={this.handleLogout}>
                                Log-Out
                            </Button>
                        </Box>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="uncontrolled-native">Current Calendar</InputLabel>
                            <NativeSelect
                                defaultValue={calendarContext.calendarId}
                                inputProps={{
                                    name: 'name',
                                    id: 'uncontrolled-native',
                                }}
                                onChange={(event) => this.handleOnCalendarChange(event, calendarContext)}
                            >
                                <optgroup label="My Calendars">
                                    {this.context.user.calendars.map(calendar => (
                                        <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
                                    ))}
                                </optgroup>
                                {this.context.user.invitedCalendars.length !== 0 ?
                                    (<React.Fragment>
                                        <optgroup label="Shared With Me">
                                            {this.context.user.invitedCalendars.map(calendar => (
                                                <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
                                            ))}
                                        </optgroup>
                                    </React.Fragment>)
                                    : null}
                            </NativeSelect>
                        </FormControl>
                        <Box mt={2}>
                            {!this.state.clickedCreate ?
                                <Button onClick={this.clickCreateNewCalendar} color='primary'>
                                    Create New Calendar
                                </Button> :
                                <React.Fragment>
                                    <FormControl>
                                        <Box mb={2}>
                                            <TextField
                                                error={!this.state.validCalendarName}
                                                id='calendarName'
                                                label='Name'
                                                value={this.calendarName}
                                                onChange={this.handleCalendarNameChange}
                                                type='string'
                                                className={classes.calendar}
                                            />
                                        </Box>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <NativeSelect
                                                defaultValue={this.state.currency}
                                                inputProps={{
                                                    name: 'currency-select',
                                                    id: 'currency-select',
                                                }}
                                                onChange={this.handleCurrencyChange}
                                            >
                                                <option key="EUR" value="EUR">€ - Euro</option>
                                                <option key="USD" value="USD">$ - US Dollar</option>
                                            </NativeSelect>
                                            <Button onClick={this.handleCreateCalendar}
                                                    color='primary'>
                                                Create
                                            </Button>
                                        </Grid>
                                    </FormControl>
                                </React.Fragment>
                            }
                        </Box>
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
                                <IconButton aria-label="refresh" component="span" onClick={this.handleRefreshPendingInvites} disabled={this.state.isRefreshInvitesDisabled}>
                                    <RefreshIcon/>
                                </IconButton>
                            </Grid>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Calendar</TableCell>
                                        <TableCell align="left">Inviter</TableCell>
                                        <TableCell align="left">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.context.user.invites.map((invite) => (
                                        <TableRow key={invite.calendarName}>
                                            <TableCell component="th" scope="row">
                                                {invite.calendarName}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {invite.inviter}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Button variant="outlined" color="secondary"
                                                        onClick={() => this.handleDeclineInvite(invite.id)}>
                                                    Decline
                                                </Button>
                                                <Button variant="outlined" color="primary"
                                                        onClick={() => this.handleAcceptInvite(invite.id)}>
                                                    Accept
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                )}
            </CalendarContext.Consumer>
        )
    }
}

MyHome.contextType = UserContext

export default withStyles(useStyles)(MyHome)