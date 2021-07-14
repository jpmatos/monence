import {Card, NativeSelect} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import GoogleButton from "react-google-button";
import {UserContext} from "../context/default/UserContext";
import Background from '../img/calculator.jpg'
import ReactLogo from '../img/monence.svg'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © Monence '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = (theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        width: '150px',
        backgroundSize: '150px'
    }
}));

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            calendarName: null,
            validCalendarName: true,
            currency: 'EUR'
        }
    }

    handleCalendarNameChange = (event) => {
        this.setState({
            calendarName: event.target.value,
            validCalendarName: event.target.value !== ''
        })
    }

    handleCreate = () => {
        if (!this.state.validCalendarName)
            return

        if (this.state.calendarName === '') {
            this.setState({validCalendarName: false})
            return
        }

        const calendar = {
            name: this.state.calendarName,
            currency: this.state.currency
        }

        this.context.handleCreateCalendar(calendar)
    }

    handleCurrencyChange = (event) => {
        this.setState({currency: event.target.value})
    }

    render() {
        const {classes} = this.props
        return (
            <Grid container component="main" className={classes.root}>
                <CssBaseline/>
                <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} container
                      direction="column"
                      justify="center"
                      alignItems="center">
                    <div className={classes.paper}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box mb={5} mr={5}>
                            <img src={ReactLogo} alt="React Logo" width="400px"/>
                            </Box>
                        {this.props.needsCalendar ?
                            <React.Fragment>
                                <Box mb={2}>
                                    <TextField
                                        error={!this.state.validCalendarName}
                                        id='Calendar Name'
                                        style={{width: 230}}
                                        label='Give your first calendar a name'
                                        placeholder='ex: Personal Calendar'
                                        value={this.state.calendarName}
                                        onChange={this.handleCalendarNameChange}
                                        type='string'
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
                                    <Button onClick={this.handleCreate} color='primary'>
                                        Start!
                                    </Button>
                                </Grid>
                            </React.Fragment> :
                            <React.Fragment>
                                <GoogleButton onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = '/auth/google';
                                }}/>
                                <Box mt={5}>
                                    <Copyright/>
                                </Box>
                            </React.Fragment>}
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

LoginPage.contextType = UserContext

export default withStyles(useStyles)(LoginPage)