import React from 'react';

export const InviteContext = React.createContext({
    pending: null,
    sent: [],
    handleNewPending: () => {
    },
    handleNewInvite: () => {
    },
    handleNewParticipant: () => {
    },
    handleDeleteInvite: () => {
    },
    handleAcceptInvite: () => {
    },
    handleDeclineInvite: () => {
    },
    handleRefreshPendingInvites: () => {
    },
    handleRefreshSentInvites: () => {
    }
});
