import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CalendarContext from './components/context/CalendarContext'
import {value} from './components/context/CalendarContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";


ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <CalendarContext.Provider value={value}>
            <App/>
        </CalendarContext.Provider>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));