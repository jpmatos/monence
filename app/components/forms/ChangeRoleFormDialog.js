import React from "react";
import {Box, Dialog, DialogContent, FormControl, InputLabel, NativeSelect} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";

const useStyles = (theme) => ({
    padBottom: {
        marginBottom: theme.spacing(2)
    },
    formControl: {
        minWidth: 230,
    }
})

class ChangeRoleFormDialog extends React.Component {
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
    }

    handleChange = () => {
        this.props.handleChangeRole(this.props.participant.id, this.state.role)

        this.handleClose()
    }

    handleRoleChange = (event) => {
        this.setState({role: event.target.value})
    }

    render() {
        const {classes} = this.props
        return (
            <Dialog open={this.props.isOpen} onClose={this.handleClose} aria-labelledby='form-dialog-title'>
                <Box mb={-1}>
                    <DialogTitle id='form-dialog-title'>Change Role</DialogTitle>
                </Box>
                <DialogContent>
                    <Grid
                        container
                        direction='column'
                        justify='space-between'
                        alignItems='stretch'
                    >
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="newrole-native-label">
                                New Role
                            </InputLabel>
                            <NativeSelect
                                defaultValue={this.props.participant.role}
                                inputProps={{
                                    name: 'newrole-select',
                                    id: 'newrole-select',
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
                        <Button onClick={this.handleChange} color='primary'>
                            Change
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles)(ChangeRoleFormDialog)