import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class Prompt extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.setOpen(false)
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
                    {this.props.text}
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={this.handleClose}>
                        Back
                    </Button>
                    <Button color='primary' onClick={this.onConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Prompt