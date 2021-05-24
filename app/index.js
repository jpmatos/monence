import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';      ///TODO Review this here
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {UserContext} from "./components/context/UserContext";
import LoginPage from "./components/content/LoginPage";
import axios from "axios";

class UserContextBinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session: null,
            calendars: null,
            handleCreateCalendar: this.handleCreateCalendar,
            handleLogout: this.handleLogout
        }
    }

    handleCreateCalendar = (calendar) => {
        return axios.post('/user/calendars', calendar)
            .then(res => {
                const calendars = this.state.calendars
                calendars.push(res.data.body)
                this.setState({
                    calendars: calendars
                })
            })
            .catch(err => {
                if(err.stack)
                    console.debug(err.stack)
                return Promise.reject(err)
            })
    }

    handleLogout = () => {
        axios.get('/auth/logout')
            .then(() => {
                this.setState({
                    sessions: null,
                    calendars: null
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.sessions !== null && this.state.sessions === null){
            window.history.replaceState(null, '', window.location.origin + '/#/')
            axios.get('/auth/session')
                .then(res => {
                    this.setState({session: res.data.body})
                    if (res.data.body.isAuthenticated)
                        axios.get('/user/calendars')
                            .then((res) => {
                                this.setState({calendars: res.data.body})
                            })
                })
        }
    }

    componentDidMount() {
        axios.get('/auth/session')
            .then(res => {
                this.setState({session: res.data.body})
                if (res.data.body.isAuthenticated)
                    axios.get('/user/calendars')
                        .then((res) => {
                            this.setState({calendars: res.data.body})
                        })
            })
    }

    ///TODO Add a loading screen while waiting for session and calendars
    ///TODO Rethink this with nested react routers
    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.state.session !== null ?
                    this.state.session.isAuthenticated ?
                        this.state.calendars !== null ?
                            this.state.calendars.length !== 0 ?
                                <App/> :
                                <LoginPage needsCalendar={true}/> :
                            null :
                        <LoginPage needsCalendar={false}/> :
                    null}
            </UserContext.Provider>
        );
    }
}


ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <UserContextBinder/>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));