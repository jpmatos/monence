import ReactDOM from "react-dom";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React from "react";
import UserContextBinder from "./context/UserContextBinder";

import 'bootstrap/dist/css/bootstrap.min.css';      ///TODO Review this here
import './index.css'

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <UserContextBinder/>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));