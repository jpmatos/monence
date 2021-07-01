import {Box, TextField} from "@material-ui/core";
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from "@material-ui/core/IconButton";
import EventNoteIcon from '@material-ui/icons/EventNote';
import {KeyboardDatePicker} from '@material-ui/pickers'

import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import capitalize from 'capitalize'
import moment from "moment";
import React from 'react'

class ViewItemFormDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemTitle: null,
            validTitle: true,
            selectedDate: null,
            selectedEndDate: null,
            value: null,
            validValue: true,
            editable: false,
            isRecurrent: false
        }
        this.calendarUrlBase = 'https://www.google.com/calendar/render'
    }

    handleClose = () => {
        this.props.setOpen(false)
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
    handleEndDateChange = (event) => {
        this.setState({selectedEndDate: event})
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

        let value = this.state.value
        if (typeof (value) === 'string')
            value = parseFloat(value.replace(/,/g, ''))
        const item = {
            'title': this.state.itemTitle,
            'start': this.state.selectedDate,
            'value': value
        }

        if (this.props.currentlyOpenItem.recurrency === 'recurrent')
            item.end = this.state.selectedEndDate

        let fail = false
        if (item.title === null || item.title === '') {
            fail = true
            this.setState({validTitle: false})
        }
        if (item.value === null || value === 0) {
            fail = true
            this.setState({validValue: false})
        }
        if (fail)
            return

        this.props.handleUpdateItem(this.props.currentlyOpenItem.id, this.props.currentlyOpenItem.recurrency, item)
        this.handleClose()
    }

    handleDelete = () => {
        this.props.handleDeleteItem(this.props.currentlyOpenItem.id, this.props.currentlyOpenItem.recurrency)
        this.handleClose()
    }

    handleGoogleCalendar = () => {
        const date = moment(this.props.currentlyOpenItem.start).format('YYYYMMDD')
        console.log(this.props.currentlyOpenItem.type)
        console.log(this.props.currentlyOpenItem.type === 'expense')

        const details = 'Amount: ' +
            (this.props.currentlyOpenItem.type === 'expense' ? '-' : encodeURIComponent('+')) +
            this.props.currentlyOpenItem.displayValue
        const url = this.createCalendarUrl(this.props.currentlyOpenItem.title, details, date)
        window.open(url, '_blank');
    }

    capitalizeWord() {
        if (this.props.currentlyOpenItem.type !== undefined)
            return capitalize.words((this.props.currentlyOpenItem.recurrency === 'recurrent' ? 'recurring ' : '')
                + this.props.currentlyOpenItem.type)
        else
            return ''
    }

    createCalendarUrl(title, details, date) {
        return this.calendarUrlBase + '?action=TEMPLATE&text=' + title + '&details=' + details + '&dates=' + date + '%2F' + date
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
            let start, end
            const isRecurrent = this.props.currentlyOpenItem.recurrency === 'recurrent'
            if (isRecurrent) {
                const res = this.props.getRecurrentDates(this.props.currentlyOpenItem.id)
                start = res.start
                end = res.end
            } else {
                start = this.props.currentlyOpenItem.start
                end = null
            }

            this.setState({
                "itemTitle": this.props.currentlyOpenItem.title,
                "selectedDate": start,
                "selectedEndDate": end,
                "value": this.props.currentlyOpenItem.value,
                "editable": false,
                "isRecurrent": isRecurrent
            })
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <DialogTitle id='form-dialog-title'>
                            {this.capitalizeWord()}
                        </DialogTitle>
                        <Box pr={2} pt={1}>
                            <IconButton aria-label="googlecalendar" component="span"
                                        onClick={this.handleGoogleCalendar}>
                                <EventNoteIcon/>
                            </IconButton>
                        </Box>
                    </Grid>
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
                        <KeyboardDatePicker
                            disableToolbar
                            readOnly={!this.state.editable}
                            autoOk={true}
                            variant='inline'
                            format='DD/MM/YYYY'
                            margin='normal'
                            id='date-picker-inline'
                            label='Date'
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        {this.state.isRecurrent ?
                            <KeyboardDatePicker
                                disableToolbar
                                readOnly={!this.state.editable}
                                autoOk={true}
                                variant='inline'
                                format='DD/MM/YYYY'
                                margin='normal'
                                id='end-date-picker-inline'
                                label='Date'
                                value={this.state.selectedEndDate}
                                onChange={this.handleEndDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            : null}
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

export default ViewItemFormDialog