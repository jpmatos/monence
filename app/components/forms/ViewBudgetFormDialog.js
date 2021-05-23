import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import {KeyboardDatePicker} from "@material-ui/pickers";
import capitalize from "capitalize";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import moment from "moment";

class ViewBudgetFormDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: null,
            value: null,
            validValue: true,
            editable: false,
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
    }

    handleValueChange = (event) => {
        this.setState({
            value: event.target.value,
            validValue: event.target.value != 0
        })
    }
    handleDateChange = (event) => {
        this.setState({selectedDate: event})
    }
    handleEdit = () => {
        this.setState({editable: true})
    }

    handleUpdate = () => {
        if (!this.state.validValue)
            return;

        let value = this.state.value
        if(typeof(value) === 'string')
            value = parseFloat(value.replaceAll(',', ''))
        const budget = {
            'date': moment.utc(this.state.selectedDate)
                .startOf(this.props.currentlyOpenBudget.period === 'week' ? 'isoWeek' : this.props.currentlyOpenBudget.period)
                .toDate(),
            'value': value
        }

        if (budget.value === null || value === 0) {
            this.setState({validValue: false})
            return;
        }

        this.props.handleUpdateBudget(this.props.currentlyOpenBudget.id, budget)
        this.handleClose()
    }

    handleDelete = () => {
        this.props.handleDeleteBudget(this.props.currentlyOpenBudget.id)
        this.handleClose()
    }

    printTitle() {
        if (this.props.currentlyOpenBudget.period !== undefined)
            return capitalize.words((this.props.currentlyOpenBudget.period + ' Budget'))
        else
            return ''
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
            this.setState({
                selectedDate: this.props.currentlyOpenBudget.date,
                value: this.props.currentlyOpenBudget.value,
                editable: false,
            })
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>
                        {this.printTitle()}
                    </DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='flex-start'
                        alignItems='stretch'
                    >
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

export default ViewBudgetFormDialog