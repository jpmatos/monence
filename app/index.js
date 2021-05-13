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
            calendars: null
        }
    }

    componentDidMount() {
        axios.get('/auth/session')
            .then(res => {
                this.setState({session: res.data})
                if (res.data.isAuthenticated)
                    axios.get('/user/calendars')
                        .then((res) => {
                            this.setState({calendars: res.data})
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