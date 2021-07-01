import {Box, Collapse} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import moment from "moment";
import React from "react";

export default class BudgetRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    onClick = () => {
        this.props.onClick(this.props.row.id)
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
                    <TableCell component="th" scope="row" onClick={this.onClick}>
                        {this.props.row.name}
                    </TableCell>
                    <TableCell align="right" onClick={this.onClick}>{this.props.row.displayBudget}</TableCell>
                    <TableCell align="right" onClick={this.onClick}>{this.props.row.displayExpenses}</TableCell>
                    <TableCell align="right" onClick={this.onClick}>{this.props.row.displayGains}</TableCell>
                    <TableCell align="right" onClick={this.onClick}>{this.props.row.displayTotal}</TableCell>
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
                                        {this.props.row.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {item.title}
                                                </TableCell>
                                                <TableCell>{moment(item.start).format('MMM DD')}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.recurrency}</TableCell>
                                                <TableCell align="right">
                                                    {item.displayValue}
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