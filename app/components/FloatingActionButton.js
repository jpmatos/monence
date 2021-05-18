import React from 'react'

import {withStyles} from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddIcon from '@material-ui/icons/Add'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Fab} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const useStyles = (theme) => ({
    root: {
        height: 380,
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    add: {
        position: 'fixed',
        right: '5%',
        bottom: '5%',
        zIndex: 1050
    },
    others: {
        marginLeft: '20px',
        zIndex: 1050
    }
})

const SecondaryButton = (props) => {
    return (
        <Box mb='11px' mr='7px'>
            <Fab color='extended' aria-label='up' size='small' onClick={props.handleOnClick}>
                {props.icon}
            </Fab>
        </Box>
    )
}

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
                <Grid
                    container
                    direction="column-reverse"
                    justify="center"
                    alignItems="flex-end"
                    className={classes.add}
                >
                    <Fab color='primary' aria-label='add' onClick={this.props.handleOnClickFAB}
                         style={{visibility: this.props.hideCreate ? 'hidden' : 'visible'}}>
                        <AddIcon/>
                    </Fab>
                    <SecondaryButton handleOnClick={this.props.handleRecedeMonth} icon={<KeyboardArrowDownIcon/>}/>
                    <SecondaryButton handleOnClick={this.props.handleAdvanceMonth} icon={<KeyboardArrowUpIcon/>}/>
                    <SecondaryButton handleOnClick={this.handleDatePicker.bind(this)} icon={<CalendarTodayIcon/>}/>
                </Grid>
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

FloatingActionButton.defaultProps = {
    hideCreate: false
};

export default withStyles(useStyles)(FloatingActionButton)
