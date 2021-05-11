import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {Box, Collapse} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import moment from "moment";

export default class BudgetRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small"
                                    onClick={() => this.setState({open: !this.state.open})}>
                            {this.state.open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {this.props.row.name}
                    </TableCell>
                    <TableCell align="right">{this.props.row.budget}</TableCell>
                    <TableCell align="right">{this.props.row.expenses}</TableCell>
                    <TableCell align="right">{this.props.row.gains}</TableCell>
                    <TableCell align="right">{this.props.row.total}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Items
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Recurrency</TableCell>
                                            <TableCell align="right">Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.row.items.map((item) => (
                                            <TableRow key={item.title + item.start}>
                                                <TableCell component="th" scope="row">
                                                    {item.title}
                                                </TableCell>
                                                <TableCell>{moment(item.start).format('MMM DD')}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.recurrency}</TableCell>
                                                <TableCell align="right">
                                                    {item.value}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
}