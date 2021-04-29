import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input'
import {KeyboardDatePicker} from '@material-ui/pickers'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default class ViewEventFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            selectedDate: null,
            value: null
        }
    }

    handleTitleChange = (event) => {
        this.setState({itemTitle: event.target.itemTitle})
    }
    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }
    handleValueChange = (event) => {
        this.setState({value: event.target.value})
    }
    handleClose = () => {
        this.props.setOpen(false)
    }
    handleUpdate = () => {
    }
    handleDelete = () => {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
            this.setState({
                itemTitle: this.props.currentlyOpenEvent.title,
                selectedDate: this.props.currentlyOpenEvent.start,
                value: this.props.currentlyOpenEvent.value
            })
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>

                <DialogTitle id='form-dialog-title'>{this.props.currentlyOpenEvent.title}</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <Input
                            autoFocus
                            placeholder='New Name'
                            label='Rename'
                            margin='dense'
                            id='title'
                            value={this.state.itemTitle}
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
                    <Button color='primary'>
                        Delete
                    </Button>
                    <Button color='primary'>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}