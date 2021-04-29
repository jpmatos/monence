import React from 'react'
import axios from 'axios'
import 'date-fns'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import {KeyboardDatePicker} from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default class NewEventFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            selectedDate: null,
            value: null
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
    }
    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }
    handleTitleChange = (event) => {
        this.setState({itemTitle: event.target.value})
    }
    handleValueChange = (event) => {
        this.setState({value: event.target.value})
    }
    handleCreate = () => {
        const item = {
            'title': this.state.itemTitle,
            'allDay': true,
            'start': this.state.selectedDate,
            'end': this.state.selectedDate,
            'value': this.state.value
        }
        axios.post('/calendar/01/item', item)
            .then(resp => {
                this.props.handleNewEvent(item)
                this.props.setOpen(false)
            })
            .catch(err => {
                this.props.setOpen(false)
            })
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New Expense</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <Input
                            autoFocus
                            placeholder='New Item'
                            margin='dense'
                            id='title'
                            label='Name'
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={this.handleCreate} color='primary'>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
