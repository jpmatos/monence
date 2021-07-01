import {Box, Dialog, DialogContent, FormControl, InputLabel, NativeSelect} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";

const useStyles = (theme) => ({
    padBottom: {
        marginBottom: theme.spacing(2)
    },
    formControl: {
        minWidth: 230,
    }
})

class InviteUserFormDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInviteEmail: '',
            validUserEmail: false,
            role: "Viewer"
        }
    }

    handleClose = () => {
        this.props.setOpen(false)
        setTimeout(() => {
            this.setState({
                userInviteEmail: '',
                validUserEmail: false
            })
        }, 1000)
    }

    handleInvite = () => {
        if (!this.state.validUserEmail)
            return

        const invite = {
            calendarId: this.props.calendarId,
            email: this.state.userInviteEmail,
            role: this.state.role
        }

        this.props.handleInvite(invite)

        this.handleClose()
    }

    handleUserInviteEmailChange = (event) => {
        const value = event.target.value
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        this.setState({
            userInviteEmail: value,
            validUserEmail: value.match(emailRegex)
        })
    }

    handleRoleChange = (event) => {
        this.setState({role: event.target.value})
    }

    render() {
        const {classes} = this.props
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>Invite User</DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <TextField
                            error={!this.state.validUserEmail && !(this.state.userInviteEmail === '')}
                            id='Invite User'
                            style={{width: 230}}
                            label='User Email'
                            placeholder='email@host.com'
                            value={this.state.userInviteEmail}
                            onChange={this.handleUserInviteEmailChange}
                            type='string'
                            className={classes.padBottom}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="role-native-label-placeholder">
                                Role
                            </InputLabel>
                            <NativeSelect

                                defaultValue="Viewer"
                                inputProps={{
                                    name: 'role-select',
                                    id: 'role-select',
                                }}
                                onChange={this.handleRoleChange}
                            >
                                <option key="Viewer" value="Viewer">Viewer</option>
                                <option key="Editor" value="Editor">Editor</option>
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
                        <Button onClick={this.handleInvite} color='primary'>
                            Invite
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles)(InviteUserFormDialog)