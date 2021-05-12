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
            session: null
        }
    }

    componentDidMount() {
        axios.get('/auth/session')
            .then(res => {
                this.setState({session: res.data})
            })
    }

    ///TODO Add a loading screen while waiting for session
    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.state.session === null ? null : this.state.session.isAuthenticated ? <App/> : <LoginPage/>}
            </UserContext.Provider>
        );
    }
}


ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <UserContextBinder/>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));