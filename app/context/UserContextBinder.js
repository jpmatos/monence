import React from 'react';
import CalendarContextBinder from './CalendarContextBinder';

import {UserContext} from "./default/UserContext";
import LoginPage from "../content/LoginPage";
import axios from "axios";

class UserContextBinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session: null,
            user: null,
            handleCreateCalendar: this.handleCreateCalendar,
            handleLogout: this.handleLogout,
            handleAcceptInvite: this.handleAcceptInvite,
            handleDeclineInvite: this.handleDeclineInvite,
            handleRefreshPendingInvites: this.handleRefreshPendingInvites
        }
    }

    handleCreateCalendar = (calendar) => {
        return axios.post('/user/calendars', calendar)
            .then(res => {
                const user = this.state.user
                user.calendars.push(res.data.body)
                this.setState({
                    user: user
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
                    session: null,
                    user: null
                })
            })
    }

    handleAcceptInvite = (inviteId) => {
        return axios.put(`/user/invite/${inviteId}/accept`)
            .then(res => {
                const invitedCalendar = res.data.body
                const user = this.state.user
                user.invitedCalendars.push(invitedCalendar)
                user.invites = user.invites.filter(inv => inv.id !== inviteId)
                this.setState({
                    user: user
                })
            })
    }

    handleDeclineInvite = (inviteId) => {
        return axios.put(`/user/invite/${inviteId}/decline`)
            .then(() => {
                const user = this.state.user
                user.invites = user.invites.filter(inv => inv.id !== inviteId)
                this.setState({
                    user: user
                })
            })
    }

    handleRefreshPendingInvites = () => {
        return axios.get(`/user/invites`)
            .then(res => {
                const invites = res.data.body
                const user = this.state.user
                user.invites = invites
                this.setState({user: user})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.session !== null && this.state.session === null){
            window.history.replaceState(null, '', window.location.origin + '/#/')
            axios.get('/auth/session')
                .then(res => {
                    this.setState({session: res.data.body})
                    if (res.data.body.isAuthenticated)
                        axios.get('/user')
                            .then((res) => {
                                this.setState({user: res.data.body})
                            })
                })
        }
    }

    componentDidMount() {
        axios.get('/auth/session')
            .then(res => {
                this.setState({session: res.data.body})
                if (res.data.body.isAuthenticated)
                    axios.get('/user')
                        .then((res) => {
                            this.setState({user: res.data.body})
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
                        this.state.user !== null ?
                            this.state.user.calendars.length !== 0 ?
                                <CalendarContextBinder/> :
                                <LoginPage needsCalendar={true}/> :
                            null :
                        <LoginPage needsCalendar={false}/> :
                    null}
            </UserContext.Provider>
        );
    }
}

export default UserContextBinder