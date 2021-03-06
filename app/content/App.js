import {MenuItem, Slide, Snackbar, Tooltip} from "@material-ui/core"
import AppBar from '@material-ui/core/AppBar'
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Grid from "@material-ui/core/Grid"
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import {withStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import GroupIcon from '@material-ui/icons/Group'
import HomeIcon from '@material-ui/icons/Home'
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ForecastIcon from '@material-ui/icons/TrendingUp'
import {Alert, AvatarGroup} from "@material-ui/lab"
import clsx from 'clsx'
import React from 'react'
import {HashRouter, Link as RouterLink, Redirect, Route, Switch} from 'react-router-dom'
import {CalendarContext} from "../context/default/CalendarContext"
import About from "./About";
import MyBudget from "./MyBudget"
import MyCalendar from './MyCalendar'
import MyForecast from "./MyForecast"
import MyHome from "./MyHome"
import MyShare from "./MyShare";
import MyShareParticipant from "./MyShareParticipant";

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

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

function ListItemLink(props) {
    const {icon, primary, to, selected, setSelected, listClass} = props

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    )

    return (
        <li>
            <MenuItem button selected={to === selected} onClick={() => setSelected(to)} component={renderLink}
                      className={listClass}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </MenuItem>
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
            snackSeverity: 'success',
            selected: null,
            response: ""
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

    setSelected = (value) => {
        this.setState({
            selected: value
        })
    }

    buildTitle = () => {
        let title = `Monence - ${this.context.calendar.name}`
        let location = ''

        const split = window.location.href.split('#')
        if (split.length > 1) {
            location = split[1].split('?')[0].replace(/\//g, '')
            location = location.charAt(0).toUpperCase() + location.slice(1)
            location = ' - ' + location
        }

        return title + location
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

    componentDidMount() {
        this.setState({
            selected: window.location.href.split('#')[1]
        })
    }

    render() {
        const {classes} = this.props
        return (
            <HashRouter>
                <CssBaseline/>
                <AppBar
                    position='fixed'
                    className={clsx(classes.appBar)}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Toolbar>
                            <IconButton
                                color='inherit'
                                aria-label='open drawer'
                                onClick={this.handleDrawer}
                                edge='start'
                                className={clsx(classes.menuButton)}>
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant='h6' noWrap>
                                {this.buildTitle()}
                            </Typography>
                            {this.context.calendar.share === 'Shared' ?
                                <PeopleAltIcon className={classes.padLeft}/> : null}
                        </Toolbar>
                        <Box mr={5}>
                            <AvatarGroup max={4}>
                                {this.context.activeUsers.map(user => (
                                    <HtmlTooltip
                                        title={<Typography variant="h5">{user.name}</Typography>}
                                        key={user.id}
                                    >
                                        <Avatar alt={user.name} src={user.photos}/>
                                    </HtmlTooltip>
                                ))}
                            </AvatarGroup>
                        </Box>
                    </Grid>
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
                    onMouseLeave={this.handleDrawerClose}>
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
                        }}>
                        <List>
                            <ListItemLink
                                to={`/home?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='Home'
                                icon={<HomeIcon/>}
                                listClass={classes.list}/>
                            <ListItemLink
                                to={`/calendar?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='Calendar'
                                icon={<CalendarIcon/>}
                                listClass={classes.list}/>
                            <ListItemLink
                                to={`/budget?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='Budget'
                                icon={<AccountBalanceWalletIcon/>}
                                listClass={classes.list}/>
                            <ListItemLink
                                to={`/forecast?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='Forecast'
                                icon={<ForecastIcon/>}
                                listClass={classes.list}/>
                        </List>
                        <List>
                            <ListItemLink
                                to={`/share?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='Share'
                                icon={<GroupIcon/>}
                                listClass={classes.list}/>
                            <ListItemLink
                                to={`/about?c=${this.context.calendarId}`}
                                selected={this.state.selected}
                                setSelected={this.setSelected}
                                primary='About'
                                icon={<InfoIcon/>}
                                listClass={classes.list}/>
                        </List>
                    </Grid>
                </Drawer>
                <Container maxWidth='lg' className={classes.content} fixed>
                    <Switch>
                        <Route path='/home*'>
                            <MyHome
                                socket={this.props.socket}
                                sendSuccessSnack={this.sendSuccessSnack}
                                sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/calendar*'>
                            <MyCalendar
                                sendSuccessSnack={this.sendSuccessSnack}
                                sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/budget*'>
                            <MyBudget
                                sendSuccessSnack={this.sendSuccessSnack}
                                sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/forecast*'>
                            <MyForecast
                                sendSuccessSnack={this.sendSuccessSnack}
                                sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Route path='/share*'>
                            {this.context.isOwner() ?
                                <MyShare
                                    sendSuccessSnack={this.sendSuccessSnack}
                                    sendErrorSnack={this.sendErrorSnack}/> :
                                <MyShareParticipant
                                    socket={this.props.socket}
                                    sendSuccessSnack={this.sendSuccessSnack}
                                    sendErrorSnack={this.sendErrorSnack}/>}
                        </Route>
                        <Route path='/about*'>
                            <About
                                sendSuccessSnack={this.sendSuccessSnack}
                                sendErrorSnack={this.sendErrorSnack}/>
                        </Route>
                        <Redirect to={`/home?c=${this.context.calendarId}`}/>
                    </Switch>
                </Container>
                <Snackbar
                    open={this.state.isSnackOpen}
                    onClose={this.handleCloseSnack}
                    TransitionComponent={(props) => (
                        <Slide {...props} direction="up"/>)}
                    key={'TransitionUp'}
                    autoHideDuration={5000}>
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
