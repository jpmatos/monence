import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CalendarContext from './components/context/CalendarContext'
import {value} from './components/context/CalendarContext'

import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
    <CalendarContext.Provider value={value}>
        <App/>
    </CalendarContext.Provider>
    , document.getElementById('root'));