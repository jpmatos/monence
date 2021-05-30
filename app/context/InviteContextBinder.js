import React from 'react';
import {InviteContext} from "./default/InviteContext";
import axios from "axios";
import CalendarContextBinder from "./CalendarContextBinder";
import {UserContext} from "./default/UserContext";

class InviteContextBinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: null,
            sent: [],
            handleNewInvite: this.handleNewInvite,
            handleDeleteInvite: this.handleDeleteInvite,
            handleAcceptInvite: this.handleAcceptInvite,
            handleDeclineInvite: this.handleDeclineInvite,
            handleRefreshPendingInvites: this.handleRefreshPendingInvites,
            handleRefreshSentInvites: this.handleRefreshSentInvites
        }
    }

    handleNewInvite = (invite) => {
        return axios.post(`/invite`, invite)
            .then(res => {
                const invite = res.data.body
                const sent = this.state.sent
                sent.push(invite)
                this.setState({
                    sent: sent
                })
            })
    }

    handleDeleteInvite = (inviteId) => {
        return axios.delete(`/invite/${inviteId}`)
            .then(res => {
                const sent = this.state.sent.filter(inv => inv.id !== inviteId)
                this.setState({
                    sent: sent
                })
            })
    }


    handleAcceptInvite = (inviteId) => {
        return axios.put(`/invite/${inviteId}/accept`)
            .then(res => {
                const participating = res.data.body
                this.context.handleNewParticipating(participating)

                const pending = this.state.pending.filter(invite => invite.id !== inviteId)
                this.setState({
                    pending: pending
                })
            })
    }

    handleDeclineInvite = (inviteId) => {
        return axios.delete(`/invite/${inviteId}/decline`)
            .then(res => {
                const pending = this.state.pending.filter(invite => invite.id !== inviteId)
                this.setState({
                    pending: pending
                })
            })
    }

    handleRefreshPendingInvites = () => {
        return axios.get('/invites/pending')
            .then(res => {
                const pending = res.data.body

                this.setState({
                    pending: pending
                })
            })
    }

    handleRefreshSentInvites = (calendarId) => {
        return axios.get(`/invites/sent/${calendarId}`)
            .then(res => {
                const sent = res.data.body

                this.setState({
                    sent: sent
                })
            })
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevState.invites !== this.state.invites && prevState.invites !== null) {
    //         axios.get('/invite')
    //             .then(res => {
    //                 const invites = res.data.body
    //
    //                 this.setState({
    //                     invites: invites
    //                 })
    //             })
    //     }
    // }

    componentDidMount() {
        axios.get('/invites/pending')
            .then(res => {
                const pending = res.data.body

                this.setState({
                    pending: pending
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <InviteContext.Provider value={this.state}>
                {this.state.pending !== null ?
                    <CalendarContextBinder/>
                    : null}
            </InviteContext.Provider>
        )
    }
}

InviteContextBinder.contextType = UserContext

export default InviteContextBinder