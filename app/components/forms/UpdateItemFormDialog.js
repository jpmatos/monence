import React from 'react'
import axios from 'axios'

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
import {Box} from "@material-ui/core";

export default class UpdateItemFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            selectedDate: null,
            value: null,
            editable: false
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
    handleEdit = () => {
        this.setState({editable: true})
    }
    handleUpdate = () => {

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
                <DialogTitle id='form-dialog-title'>{this.props.currentlyOpenItem.title}</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <Input
                            autoFocus
                            inputProps={
                                {readOnly: !this.state.editable}
                            }
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