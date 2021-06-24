import React from 'react';
import {InviteContext} from "./default/InviteContext";
import axios from "axios";
import CalendarContextBinder from "./CalendarContextBinder";
import {UserContext} from "./default/UserContext";
import LoadingScreen from "../components/LoadingScreen";

class InviteContextBinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: [],
            sent: [],
            handleNewPending: this.handleNewPending,
            handleNewInvite: this.handleNewInvite,
            handleNewParticipant: this.handleNewParticipant,
            handleDeleteInvite: this.handleDeleteInvite,
            handleAcceptInvite: this.handleAcceptInvite,
            handleDeclineInvite: this.handleDeclineInvite,
            handleRefreshPendingInvites: this.handleRefreshPendingInvites,
            handleRefreshSentInvites: this.handleRefreshSentInvites
        }
    }

    handleNewPending = (invite) => {
        const pending = this.state.pending
        pending.push(invite)
        this.setState({
            pending: pending
        })
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

    handleNewParticipant = (participant) => {
        const sent = this.state.sent.filter(inv => inv.inviteeId !== participant.id)
        this.setState({
            sent: sent
        })
    }

    handleDeleteInvite = (inviteId) => {
        const sent = this.state.sent.filter(inv => inv.id !== inviteId)
        this.setState({
            sent: sent
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
        const pending = this.state.pending.filter(invite => invite.id !== inviteId)
        this.setState({
            pending: pending
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

    clearSentInvites = () => {
        this.setState({
            sent: []
        })
    }

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
                    <CalendarContextBinder
                        handleRefreshSentInvites={this.handleRefreshSentInvites}
                        clearSentInvites={this.clearSentInvites}/>
                    : <LoadingScreen/>}
            </InviteContext.Provider>
        )
    }
}

InviteContextBinder.contextType = UserContext

export default InviteContextBinder