import React from 'react';

export const CalendarContext = React.createContext({
    calendar: null,
    calendarId: null,
    calendarDate: null,
    items: null,
    setCalendarId: () => {},
    setCalendarDate: () => {},
    offsetCalendarDate: () => {},
    handleNewItem: () => {},
    handleUpdateItem: () => {},
    handleDeleteItem: () => {},
    handleNewBudget: () => {},
    handleUpdateBudget: () => {},
    handleDeleteBudget: () => {}
});
