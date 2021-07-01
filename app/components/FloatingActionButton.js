import DateFnsUtils from "@date-io/date-fns";
import {Fab} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import {withStyles} from '@material-ui/core/styles'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddIcon from '@material-ui/icons/Add'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import React from 'react'
import CurrencyPickerFormDialog from "./forms/CurrencyPickerFormDialog";

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
        zIndex: 1050,
        width: 'auto',
    },
    others: {
        marginLeft: '20px',
        zIndex: 1050
    }
})

const SecondaryButton = (props) => {
    return (
        <Box mb='11px' mr='7px'>
            <Fab color='secondary' aria-label='up' size='small' onClick={props.handleOnClick}>
                {props.icon}
            </Fab>
        </Box>
    )
}

class FloatingActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDatePickerOpen: false,
            isCurrencyOpen: false
        }
    }

    handleDatePicker = (event) => {
        event.stopPropagation()
        this.setState({isDatePickerOpen: true})
    }

    handleCurrency = (event) => {
        event.stopPropagation()
        this.setState({isCurrencyOpen: true})
    }

    setCurrencyFD = (event) => {
        this.setState({isCurrencyOpen: event})
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
                    <Fab color='primary'
                         aria-label='add'
                         onClick={this.props.handleOnClickFAB}
                         style={{visibility: this.props.hideCreate || !this.props.canEdit ? 'hidden' : 'visible'}}>
                        <AddIcon/>
                    </Fab>
                    <SecondaryButton handleOnClick={this.props.handleRecedeMonth} icon={<KeyboardArrowDownIcon/>}/>
                    <SecondaryButton handleOnClick={this.props.handleAdvanceMonth} icon={<KeyboardArrowUpIcon/>}/>
                    <SecondaryButton handleOnClick={this.handleDatePicker} icon={<CalendarTodayIcon/>}/>
                    <SecondaryButton handleOnClick={this.handleCurrency} icon={<AccountBalanceIcon/>}/>
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
                <CurrencyPickerFormDialog isOpen={this.state.isCurrencyOpen} setOpen={this.setCurrencyFD}
                                          onChange={this.props.handleCurrencyChange}/>
            </React.Fragment>
        )
    }

}

FloatingActionButton.defaultProps = {
    hideCreate: false
};

export default withStyles(useStyles)(FloatingActionButton)
