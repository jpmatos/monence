import 'date-fns';
import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import Grid from '@material-ui/core/Grid'

export default function NewExpenseFormDialog(props) {

    let {open, setOpen} = props;
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [value, setValue] = React.useState();

    const handleClose = () => {
        setOpen(false);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCreate = () => {
        axios.post('/item', {
            'date': selectedDate,
            'value': value
        })
            .then(resp => {
                setOpen(false)
            })
            .catch(err => {
                setOpen(false)
            })
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Expense</DialogTitle>
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            autoOk={true}
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <CurrencyTextField
                        label="Amount"
                        variant="standard"
                        value={value}
                        currencySymbol="€"
                        //minimumValue="0"
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        onChange={(event, value) => setValue(value)}
                        textAlign="left"
                        placeholder="20.00"
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
