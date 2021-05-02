import React from 'react'
import axios from 'axios'
import 'date-fns'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import {KeyboardDatePicker} from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import {Box, TextField} from "@material-ui/core";
import ItemTypeSwitch from "../ItemTypeSwitch";
import ItemRecurrencySwitch from "../ItemRecurrencySwitch";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";

export default class CreateItemFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            validTitle: true,
            selectedDate: new Date(),
            selectedEndDate: new Date(),
            value: null,
            validValue: true,
            type: 'expense',
            recurrency: 'single',
            recurrencyPeriod: 'monthly'
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
        setTimeout(() => {
            this.setState({
                itemTitle: null,
                validTitle: true,
                selectedDate: new Date(),
                selectedEndDate: new Date(),
                value: null,
                validValue: true,
                type: 'expense',
                recurrency: 'single',
                recurrencyPeriod: 'monthly'
            })
        }, 1000)
    }
    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }
    handleEndDateChange = (event) => {
        this.setState({selectedEndDate: event})
    }
    handleTitleChange = (event) => {
        this.setState({
            itemTitle: event.target.value,
            validTitle: event.target.value !== ''
        })
    }
    handleValueChange = (event) => {
        this.setState({
            value: event.target.value,
            validValue: event.target.value != 0
        })
    }
    handleTypeChange = (isGain) => {
        if (!isGain) {
            this.setState({type: 'expense'})
        } else {
            this.setState({type: 'gain'})
        }
    }
    handleRecurrencyChange = (isRecurrent) => {
        if (isRecurrent) {
            this.setState({recurrency: 'recurrent'})
        } else {
            this.setState({recurrency: 'single'})
        }
    }
    handleRecurrencyPeriodChange = (event, newValue) => {
        this.setState({recurrencyPeriod: newValue})
    }

    handleCreate = () => {
        if (!this.state.validTitle || !this.state.validValue)
            return;

        const item = {
            'title': this.state.itemTitle,
            'start': this.state.selectedDate,
            'end': this.state.selectedEndDate,
            'value': this.state.value,
            'type': this.state.type,                            //expense/gain
            'recurrency': this.state.recurrency,                //single/recurrent
            'recurrencyPeriod': this.state.recurrencyPeriod     //weekly/monthly/yearly
        }

        let fail = false
        if (item.title === null || item.title === '') {
            fail = true
            this.setState({validTitle: false})
        }
        if (item.value === null || item.value == 0) {
            fail = true
            this.setState({validValue: false})
        }
        if (fail)
            return

        axios.post(`/calendar/01/item`, item)
            .then(resp => {
                this.props.handleNewItem(resp.data)
                this.handleClose()
            })
            .catch(err => {
                this.handleClose()
            })
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>New Item</DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <TextField
                            error={!this.state.validTitle}
                            id='title'
                            label='Title'
                            value={this.itemTitle}
                            onChange={this.handleTitleChange}
                            type='string'
                        />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                autoOk={true}
                                variant='inline'
                                format='MM/dd/yyyy'
                                margin='normal'
                                id='date-picker-inline'
                                label='Date'
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <CurrencyTextField
                            error={!this.state.validValue}
                            label='Amount'
                            variant='standard'
                            value={this.state.value}
                            currencySymbol='€'
                            //minimumValue='0'
                            outputFormat='string'
                            decimalCharacter='.'
                            digitGroupSeparator=','
                            onChange={this.handleValueChange}
                            textAlign='left'
                            placeholder='20.00'
                        />
                        <Grid
                            container
                            direction="row"
                            justify="space-around"
                            alignItems="flex-start"
                        >
                            <ItemTypeSwitch
                                handleTypeChange={this.handleTypeChange}
                            />
                            <ItemRecurrencySwitch
                                handleRecurrencyChange={this.handleRecurrencyChange}
                            />
                        </Grid>
                        {this.state.recurrency === 'recurrent' ?
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <ToggleButtonGroup
                                        value={this.state.recurrencyPeriod}
                                        exclusive
                                        size="small"
                                        onChange={this.handleRecurrencyPeriodChange}
                                        aria-label="recurrency selection"
                                    >
                                        <ToggleButton value="weekly" aria-label="Week selection">
                                            Week
                                        </ToggleButton>
                                        <ToggleButton value="monthly" aria-label="monthly selection">
                                            Month
                                        </ToggleButton>
                                        <ToggleButton value="yearly" aria-label="yearly selection">
                                            Year
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <KeyboardDatePicker
                                    disableToolbar
                                    autoOk={true}
                                    variant='inline'
                                    format='MM/dd/yyyy'
                                    margin='normal'
                                    id='date-picker-inline'
                                    label='End Date'
                                    value={this.state.selectedEndDate}
                                    onChange={this.handleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            : null}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Box pl={1}>
                            <Button onClick={this.handleClose} color='primary'>
                                Cancel
                            </Button>
                        </Box>
                    </Grid>
                    <Box pr={1}>
                        <Button onClick={this.handleCreate} color='primary'>
                            Create
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        )
    }
}
