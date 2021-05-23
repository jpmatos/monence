import React from 'react'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import {UserContext} from "../context/UserContext";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {CalendarContext} from "../context/CalendarContext";
import {FormControl, FormHelperText, InputLabel, NativeSelect, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = (theme => ({
    root: {
        height: '50vh',
    },
    large: {
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
    }
}));

class MyHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedCreate: false,
            calendarName: null,
            validCalendarName: true
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

        this.context.handleCreateCalendar(this.state.calendarName)
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

    handleOnCalendarChange = (event, calendarContext) => {
        window.history.replaceState(null, '', window.location.href.split('?')[0] + '?c=' + event.target.value)
        calendarContext.setCalendarId(event.target.value)

    }

    handleLogout = () => {
        this.context.handleLogout()
    }

    render() {
        const {classes} = this.props
        return (
            <CalendarContext.Consumer>
                {calendarContext => (
                    <Grid container component="main" className={classes.root}>
                        <Grid container
                              direction="column"
                              justify="center"
                              alignItems="center"
                              style={{
                                  height: '100%'
                              }}>
                            <Avatar alt="Current User" src={this.context.session.photos[0].value}
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
                                    {this.context.calendars.map(calendar => (
                                        <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
                                    ))}
                                </NativeSelect>
                            </FormControl>
                            <Box mt={2}>
                                {!this.state.clickedCreate ?
                                    <Button onClick={this.clickCreateNewCalendar} color='primary'>
                                        Create New Calendar
                                    </Button> :
                                    <React.Fragment>
                                        <TextField
                                            error={!this.state.validCalendarName}
                                            id='calendarName'
                                            label='Name'
                                            value={this.calendarName}
                                            onChange={this.handleCalendarNameChange}
                                            type='string'
                                            className={classes.calendar}
                                        />
                                        <Box mt={2}>
                                            <Button onClick={this.handleCreateCalendar}
                                                    color='primary'>
                                                Create
                                            </Button>
                                        </Box>
                                    </React.Fragment>
                                }
                            </Box>
                        </Grid>

                    </Grid>
                )}
            </CalendarContext.Consumer>
        )
    }
}

MyHome.contextType = UserContext

export default withStyles(useStyles)(MyHome)