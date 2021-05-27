import React from 'react';

export const CalendarContext = React.createContext({
    calendar: null,
    calendarId: null,
    calendarDate: null,
    items: null,
    currency: null,
    setCalendarId: () => {},
    setCalendarDate: () => {},
    setCurrency: () => {},
    offsetCalendarDate: () => {},
    handleNewItem: () => {},
    handleUpdateItem: () => {},
    handleDeleteItem: () => {},
    handleNewBudget: () => {},
    handleUpdateBudget: () => {},
    handleDeleteBudget: () => {},
    buildDisplayValue: () => {},
    handleNewInvite: () => {},
    handleDeleteInvite: () => {},
    handleRefreshPendingInvites: () => {}
});
