import React from 'react'
import axios from 'axios'
import capitalize from 'capitalize'

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
import {Box, TextField} from "@material-ui/core";

export default class UpdateItemFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            validTitle: true,
            selectedDate: null,
            value: null,
            validValue: true,
            editable: false
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
        // this.setState({
        //     itemTitle: null,
        //     validTitle: true,
        //     selectedDate: new Date(),
        //     value: null,
        //     validValue: true,
        // })
    }
    handleTitleChange = (event) => {
        this.setState({
            itemTitle: event.target.value,
            validTitle: event.target.value !== ''
        })
    }
    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }
    handleValueChange = (event) => {
        this.setState({
            value: event.target.value,
            validValue: event.target.value != 0
        })
    }
    handleEdit = () => {
        this.setState({editable: true})
    }
    handleUpdate = () => {
        if (!this.state.validTitle || !this.state.validValue)
            return;

        const item = {
            'title': this.state.itemTitle,
            'start': this.state.selectedDate,
            'end': this.state.selectedDate,
            'value': this.state.value.replaceAll(',', '')
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

        axios.put(`/calendar/01/item/${this.props.currentlyOpenItem.id}`, item)
            .then(resp => {
                this.props.handleUpdateItem(resp.data)
                this.handleClose()
            })
            .catch(err => {
                this.handleClose()
            })
    }
    handleDelete = () => {
        axios.delete(`/calendar/01/item/${this.props.currentlyOpenItem.id}`)
            .then(resp => {
                this.props.handleDeleteItem(this.props.currentlyOpenItem.id)
                this.handleClose()
            })
            .catch(err => {
                this.handleClose()
            })
    }

    capitalizeWord() {
        if (this.props.currentlyOpenItem.type !== undefined)
            return capitalize.words((this.props.currentlyOpenItem.recurrency === 'recurrent' ? 'recurring ' : '')
                + this.props.currentlyOpenItem.type)
        else
            return ''
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
            this.setState({
                itemTitle: this.props.currentlyOpenItem.title,
                selectedDate: this.props.currentlyOpenItem.start,
                value: this.props.currentlyOpenItem.value,
                editable: false
            })
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>
                        {this.capitalizeWord()}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='flex-start'
                        alignItems='stretch'
                    >
                        <TextField
                            error={!this.state.validTitle}
                            inputProps={
                                {readOnly: !this.state.editable}
                            }
                            placeholder='New Name'
                            label='Title'
                            id='title'
                            value={this.state.itemTitle}
                            onChange={this.handleTitleChange}
                            type='string'
                        />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                inputProps={
                                    {readOnly: !this.state.editable}
                                }
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
                            inputProps={
                                {readOnly: !this.state.editable}
                            }
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
                    <Box onClick={this.handleDelete} display={this.state.editable ? "none" : ""}>
                        <Button color='primary'>
                            Delete
                        </Button>
                    </Box>
                    <Box pr={1}>
                        <Button onClick={this.state.editable ? this.handleUpdate : this.handleEdit} color='primary'>
                            {this.state.editable ? "Update" : "Edit"}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        )
    }
}