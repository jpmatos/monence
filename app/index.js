import MomentUtils from "@date-io/moment";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";

import 'bootstrap/dist/css/bootstrap.min.css'; ///TODO Review this here
import React from "react";
import ReactDOM from "react-dom";
import UserContextBinder from "./context/UserContextBinder";
import './index.css'

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <UserContextBinder/>
    </MuiPickersUtilsProvider>
    , document.getElementById('root'));