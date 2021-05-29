import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Box, DialogContent, FormControl, InputLabel, NativeSelect} from "@material-ui/core";
import {CalendarContext} from "../../context/default/CalendarContext";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

class CurrencyPickerFormDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.setOpen(false)
    }

    handleChange = (event) => {
        this.context.setCurrency(event.target.value)

        if (this.props.onChange !== undefined && this.props.onChange !== null)
            this.props.onChange(event.target.value)
        this.props.setOpen(false)
    }

    handleReset = () => {
        this.context.setCurrency(this.context.calendar.currency)

        if (this.props.onChange !== undefined && this.props.onChange !== null)
            this.props.onChange(this.context.calendar.currency)
        this.props.setOpen(false)
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>Select Currency</DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <FormControl>
                            {/*<InputLabel htmlFor="uncontrolled-native">Current Currency Displayed</InputLabel>*/}
                            <NativeSelect
                                defaultValue={this.context.currency}
                                inputProps={{
                                    name: 'currency-select',
                                    id: 'currency-select',
                                }}
                                onChange={this.handleChange}
                            >
                                <option key="EUR" value="EUR">€ - Euro</option>
                                <option key="USD" value="USD">$ - US Dollar</option>
                            </NativeSelect>
                        </FormControl>
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
                        <Button onClick={this.handleReset} color='primary'>
                            Reset
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        );
    }
}

CurrencyPickerFormDialog.contextType = CalendarContext

export default CurrencyPickerFormDialog