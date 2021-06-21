import React from 'react'
import clsx from 'clsx'
import {HashRouter, Route, Redirect, Switch} from 'react-router-dom'
import {Link as RouterLink} from 'react-router-dom'

import {withStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ForecastIcon from '@material-ui/icons/TrendingUp'
import GroupIcon from '@material-ui/icons/Group'
import Container from '@material-ui/core/Container'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import SettingsIcon from '@material-ui/icons/Settings'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import MyCalendar from './MyCalendar'
import MyBudget from "./MyBudget"
import {CalendarContext} from "../context/default/CalendarContext"
import MyHome from "./MyHome"
import Grid from "@material-ui/core/Grid"
import MySettings from "./MySettings"
import MyForecast from "./MyForecast"
import {Slide, Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import PlaceHolder from "./PlaceHolder";
import MyShare from "./MyShare";
import MyShareParticipant from "./MyShareParticipant";
import {blue, grey} from "@material-ui/core/colors";

const drawerWidth = 220

const useStyles = (theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: '100%',
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        overflowX: 'hidden',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    list: {
        paddingLeft: theme.spacing(3)
    },
    content: {
        justifyContent: 'flex-end',
        paddingTop: theme.spacing(9) + 1
    },
    bottomPush: {
        height: '100%'
    },
    calendarName: {
        marginLeft: theme.spacing(2),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        background: '#757de8',
        padding: '5px',
        borderRadius: '5px'
        // fontFamily: 'sans-serif'
    },
    padLeft: {
        marginLeft: theme.spacing(1)
    }
})

function ListItemLink(props) {
    const {icon, primary, to, listClass} = props

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    )

    return (
        <li>
            <ListItem button component={renderLink} className={listClass}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            isSnackOpen: false,
            snackMessage: null,
            snackSeverity: 'success'
        }
    }

    handleDrawer = () => {
        this.setState({open: !this.state.open})
    }
    handleDrawerOpen = () => {
        this.setState({open: true})
    }
    handleDrawerClose = () => {
        this.setState({open: false})
    }

    handleCloseSnack = () => {
        this.setState({isSnackOpen: false})
    }

    sendSuccessSnack = (message) => {
        this.sendSnack(message, 'success')
    }

    sendErrorSnack = (message, err) => {
        let msg
        if (err.response) {
            msg = err.response.data.message
        } else if (err.request) {
            msg = err.request
        } else if (err.message)
            msg = err.message
        else {
            msg = 'Unknown Error'
        }
        this.sendSnack(`${message} Server Response: ${msg}`, 'error')
    }

    sendSnack(msg, severity) {
        severity = severity ?? 'info'
        this.setState({
            snackMessage: msg,
            isSnackOpen: true,
            snackSeverity: severity
        })
    }

    render() {
        const {classes} = this.props
        return (
            <HashRouter>
                <CssBaseline/>
                <AppBar
                    position='fixed'
                    className={clsx(classes.appBar)}
                >
                    <Toolbar>
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={this.handleDrawer}
                            edge='start'
                            className={clsx(classes.menuButton)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant='h6' noWrap>
                            {`Monence - ${this.context.calendar.name}`}
                        </Typography>
                        {/*<Typography variant='h6' className={classes.calendarName} noWrap>*/}
                        {/*    {this.context.calendar.name}*/}
                        {/*</Typography>*/}
                        {this.context.calendar.share === 'Shared' ?
                            <PeopleAltIcon className={classes.padLeft}/> : null}
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant='permanent'
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    // onMouseEnter={this.handleDrawerOpen}
                    onMouseLeave={this.handleDrawerClose}
                >
                    <div className={classes.toolbar}/>
                    <Divider/>
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="flex-start"
                        style={{
                            height: '100%',
                            minHeight: '450px'
                        }}
                    >
                        <List>
                            <ListItemLink to={`/home?c=${this.context.calendarId}`} primary='Home'
                                          icon={<HomeIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/calendar?c=${this.context.calendarId}`} primary='Calendar'
                                          icon={<CalendarIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/budget?c=${this.context.calendarId}`} primary='Budget'
                                          icon={<AccountBalanceWalletIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/forecast?c=${this.context.calendarId}`} primary='Forecast'
                                          icon={<ForecastIcon/>}
                                          listClass={classes.list}/>
                        </List>
                        <List>
                            <ListItemLink to={`/share?c=${this.context.calendarId}`} primary='Share'
                                          icon={<GroupIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/settings?c=${this.context.calendarId}`} primary='Settings'
                                          icon={<SettingsIcon/>}
                                          listClass={classes.list}/>
                        </List>
                    </Grid>
                </Drawer>
                <Container maxWidth='lg' className={classes.content} fixed>
                    <Switch>
                        <Route path='/home*'>
                            <MyHome sendSuccessSnack={this.sendSuccessSnack} sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/calendar*'>
                            <MyCalendar sendSuccessSnack={this.sendSuccessSnack} sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/budget*'>
                            <MyBudget sendSuccessSnack={this.sendSuccessSnack} sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/forecast*'>
                            <MyForecast sendSuccessSnack={this.sendSuccessSnack} sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/share*'>
                            {this.context.isOwner() ?
                                <MyShare sendSuccessSnack={this.sendSuccessSnack}
                                         sendErrorSnack={this.sendErrorSnack}/> :
                                <MyShareParticipant sendSuccessSnack={this.sendSuccessSnack}
                                                    sendErrorSnack={this.sendErrorSnack}/>}
                        </Route>
                        <Route path='/settings*'>
                            <PlaceHolder sendSuccessSnack={this.sendSuccessSnack} sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Redirect to={`/home?c=${this.context.calendarId}`}/>
                    </Switch>
                </Container>
                <Snackbar
                    open={this.state.isSnackOpen}
                    onClose={this.handleCloseSnack}
                    TransitionComponent={(props) => (
                        <Slide {...props} direction="up"/>
                    )
                    }
                    key={'TransitionUp'}
                    autoHideDuration={5000}
                >
                    <Alert onClose={this.handleCloseSnack} elevation={6} variant="filled"
                           severity={this.state.snackSeverity}>
                        {this.state.snackMessage}
                    </Alert>
                </Snackbar>
            </HashRouter>
        )
    }
}

App.contextType = CalendarContext

export default withStyles(useStyles)(App)
