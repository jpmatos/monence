import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import GoogleButton from "react-google-button";
import {UserContext} from "../context/default/UserContext";
import {FormControl, NativeSelect} from "@material-ui/core";
import Background from '../img/calculator.jpg'

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
        // backgroundImage: '../img/calculator.jpg',
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
                        <Box mb={2}>
                            <Typography variant="h4">
                                Monence
                            </Typography>
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
                            <form className={classes.form} noValidate>
                                <GoogleButton onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = '/auth/google';
                                }}/>
                                <Box mt={5}>
                                    <Copyright/>
                                </Box>
                            </form>}
                    </div>
                </Grid>
            </Grid>
        );
    }
}

LoginPage.contextType = UserContext

export default withStyles(useStyles)(LoginPage)