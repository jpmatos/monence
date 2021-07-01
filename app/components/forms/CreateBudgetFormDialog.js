import {Box, DialogContent} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {KeyboardDatePicker} from "@material-ui/pickers";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import moment from "moment";
import React from 'react'

class CreateBudgetFormDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            value: null,
            validValue: true,
            selectedDate: new Date(),
            period: 'month'
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
        setTimeout(() => {
            this.setState({
                selectedDate: new Date(),
                value: null,
                validValue: true,
                period: 'month'
            })
        }, 1000)
    }

    handleValueChange = (event) => {
        this.setState({
            value: event.target.value,
            validValue: event.target.value != 0
        })
    }

    handlePeriodChange = (event, newValue) => {
        this.setState({period: newValue})
    }

    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }

    handleCreate = () => {
        if (!this.state.validValue)
            return;

        let value = this.state.value
        if (typeof (value) === 'string')
            value = parseFloat(value.replace(/,/g, ''))

        if (this.state.value === null || value === 0) {
            this.setState({validValue: false})
            return
        }

        const budget = {
            'date': moment.utc(this.state.selectedDate)
                .startOf(this.state.period === 'week' ? 'isoWeek' : this.state.period)
                .toDate(),
            'value': value,
            'period': this.state.period     //week/month/year
        }

        this.props.handleNewBudget(budget)
        this.handleClose()
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>New Budget</DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
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
                        <KeyboardDatePicker
                            disableToolbar
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
                        <Box mt={1} mb={1}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <ToggleButtonGroup
                                    value={this.state.period}
                                    exclusive
                                    size="small"
                                    onChange={this.handlePeriodChange}
                                    aria-label="recurrency selection"
                                >
                                    <ToggleButton value="week" aria-label="Week selection">
                                        Week
                                    </ToggleButton>
                                    <ToggleButton value="month" aria-label="Month selection">
                                        Month
                                    </ToggleButton>
                                    <ToggleButton value="year" aria-label="Year selection">
                                        Year
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Box>
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

export default CreateBudgetFormDialog