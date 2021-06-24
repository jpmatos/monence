import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {TextField, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

class PromptConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            isDisabled: true
        }
    }

    handleInputTextChange = (event) => {
        this.setState({
            inputText: event.target.value,
            isDisabled: event.target.value !== this.props.inputText
        })
    }

    handleClose = () => {
        this.props.setOpen(false)
        setTimeout(() => {
            this.setState({
                inputText: '',
                isDisabled: true
            })
        }, 1000)
    }

    onConfirm = () => {
        this.props.setOpen(false)
        this.props.onConfirm()
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>
                    {this.props.title}
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Typography>
                            {this.props.text}
                        </Typography>
                        <Box pt={1}>
                            <TextField
                                id='inputText'
                                label='Name'
                                value={this.state.inputText}
                                onChange={this.handleInputTextChange}
                                type='string'
                            />
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={this.handleClose}>
                        Back
                    </Button>
                    <Button color='primary' onClick={this.onConfirm} disabled={this.state.isDisabled}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PromptConfirm