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
import HomeIcon from '@material-ui/icons/Home';
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ForecastIcon from '@material-ui/icons/TrendingUp'
import Container from '@material-ui/core/Container'
import EuroIcon from '@material-ui/icons/Euro';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import MyCalendar from './MyCalendar'
import PlaceHolder from './PlaceHolder'
import MyBudget from "./MyBudget";
import {CalendarContext} from "../context/CalendarContext";
import MyHome from "./MyHome";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

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

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
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

    render() {
        const {classes} = this.props;
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
                            Monence
                        </Typography>
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
                                          icon={<EuroIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/forecast?c=${this.context.calendarId}`} primary='Forecast'
                                          icon={<ForecastIcon/>}
                                          listClass={classes.list}/>
                        </List >
                        <List>
                            <ListItemLink to={`/settings?c=${this.context.calendarId}`} primary='Settings' icon={<SettingsIcon/>}
                                          listClass={classes.list}/>
                            <ListItemLink to={`/logout?c=${this.context.calendarId}`} primary='Logout' icon={<ExitToAppIcon/>}
                                          listClass={classes.list}/>
                        </List>
                    </Grid>
                </Drawer>
                <Container maxWidth='lg' className={classes.content}>
                    <Switch>
                        <Route path='/home*' component={MyHome}/>
                        <Route path='/calendar*' component={MyCalendar}/>
                        <Route path='/budget*' component={MyBudget}/>
                        <Route path='/forecast*' component={PlaceHolder}/>
                        <Route path='/settings*' component={PlaceHolder}/>
                        <Route path='/logout*' component={PlaceHolder}/>
                        <Redirect to={`/home?c=${this.context.calendarId}`}/>
                    </Switch>
                </Container>
            </HashRouter>
        )
    }
}

MyNavbar.contextType = CalendarContext

export default withStyles(useStyles)(MyNavbar)
