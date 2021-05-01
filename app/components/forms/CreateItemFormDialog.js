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
import {Box} from "@material-ui/core";
import ItemTypeSwitch from "../ItemTypeSwitch";

export default class CreateItemFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            selectedDate: new Date(),
            value: null,
            type: 'expense'
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
    handleTypeChange = (isGain) => {
        if(!isGain){
            this.setState({type: 'expense'})
        } else {
            this.setState({type: 'gain'})
        }
    }

    handleCreate = () => {
        const item = {
            'title': this.state.itemTitle,
            'allDay': true,
            'start': this.state.selectedDate,
            'end': this.state.selectedDate,
            'value': this.state.value
        }

        axios.post(`/calendar/01/${this.state.type}`, item)
            .then(resp => {
                this.props.handleNewItem(resp.data)
                this.props.setOpen(false)
            })
            .catch(err => {
                this.props.setOpen(false)
            })
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New Item</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <Input
                            autoFocus
                            placeholder='Item Name'
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
                        <ItemTypeSwitch
                            handleTypeChange={this.handleTypeChange}
                        />
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
