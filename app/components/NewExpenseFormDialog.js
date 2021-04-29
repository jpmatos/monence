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
import Input from '@material-ui/core/Input'

export default function NewExpenseFormDialog(props) {

    let {isOpen, setOpen, handleNewEvent} = props;
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [value, setValue] = React.useState();
    const [itemTitle , setItemTitle] = React.useState('');

    const handleClose = () => {
        setOpen(false);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleTitleChange = (event) => {
        setItemTitle(event.target.value)
    }

    const handleCreate = () => {
        const item = {
            'title': itemTitle,
            'allDay': true,
            'start': selectedDate,
            'end': selectedDate,
            'value': value
        }
        axios.post('/calendar/01/item', item)
            .then(resp => {
                handleNewEvent(item)
                setOpen(false)
            })
            .catch(err => {
                setOpen(false)
            })
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Expense</DialogTitle>
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <Input
                        autoFocus
                        placeholder="New Item"
                        margin="dense"
                        id="title"
                        label="Name"
                        value={itemTitle}
                        onChange={handleTitleChange}
                        type="string"
                    />
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
