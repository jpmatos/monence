import React from 'react'

import {withStyles} from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddIcon from '@material-ui/icons/Add'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = (theme) => ({
    root: {
        height: 380,
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    fab: {
        position: 'fixed',
        right: '5%',
        bottom: '5%',
        zIndex: 1050
    }
})

class FloatingActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDatePickerOpen: false
        }
    }

    handleDatePicker(event) {
        event.stopPropagation()
        this.setState({isDatePickerOpen: true})
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <SpeedDial ariaLabel={'SpeedDial'} open={true} className={classes.fab} icon={<AddIcon/>}
                           onClick={this.props.handleOnClickFAB}>
                    <SpeedDialAction key='Retreat Month' title='-1 Month' icon={<KeyboardArrowDownIcon/>}
                                     onClick={this.props.handleRecedeMonth}/>
                    <SpeedDialAction key='Advance Month' title='+1 Month' icon={<KeyboardArrowUpIcon/>}
                                     onClick={this.props.handleAdvanceMonth}/>
                    <SpeedDialAction key='Pick Date' title={'Set Date'} icon={<CalendarTodayIcon/>}
                                     onClick={this.handleDatePicker.bind(this)}/>
                </SpeedDial>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        disableToolbar
                        views={["year", "month"]}
                        open={this.state.isDatePickerOpen}
                        onOpen={() => this.setState({isDatePickerOpen: true})}
                        onClose={() => this.setState({isDatePickerOpen: false})}
                        value={this.props.date}
                        onChange={this.props.handleDateChange}
                        TextFieldComponent={() => null}
                    />
                </MuiPickersUtilsProvider>
            </React.Fragment>
        )
    }

}

export default withStyles(useStyles)(FloatingActionButton)
