import React from 'react';

export const CalendarContext = React.createContext({
    calendar: null,
    calendarId: null,
    calendarDate: null,
    items: null,
    currency: null,
    isOwner: () => {
    },
    canEdit: () => {
    },
    setCalendarId: () => {
    },
    setCalendarDate: () => {
    },
    setCurrency: () => {
    },
    setActiveUsers: () => {
    },
    handleUserLeft: () => {
    },
    handleNewUser: () => {
    },
    offsetCalendarDate: () => {
    },
    handleNewItem: () => {
    },
    handleUpdateItem: () => {
    },
    handleDeleteItem: () => {
    },
    handleNewBudget: () => {
    },
    handleUpdateBudget: () => {
    },
    handleDeleteBudget: () => {
    },
    buildDisplayValue: () => {
    },
    setCalendarShare: () => {
    },
    setCalendarUnshare: () => {
    },
    handleRemoveParticipant: () => {
    },
    handleRefreshParticipants: () => {
    },
    handleNewParticipant: () => {
    },
    handleChangeRole: () => {
    },
    handleLeaveCalendar: () => {
    },
    handleDeleteCalendar: () => {
    }
});
