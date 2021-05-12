import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";


ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <App/>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));