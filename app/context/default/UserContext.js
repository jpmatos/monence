import React from 'react';

export const UserContext = React.createContext({
    session: null,
    user: null,
    handleCreateCalendar: () => {
    },
    handleLogout: () => {
    },
    handleNewParticipating: () => {
    },
    handleLeaveCalendar: () => {
    },
    handleDeleteCalendar: () => {
    }
})