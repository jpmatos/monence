import React from 'react';

export const InviteContext = React.createContext({
    pending: null,
    sent: [],
    handleNewInvite: () => {},
    handleDeleteInvite: () => {},
    handleAcceptInvite: () => {},
    handleDeclineInvite: () => {},
    handleRefreshPendingInvites: () => {},
    handleRefreshSentInvites: () => {}
});
