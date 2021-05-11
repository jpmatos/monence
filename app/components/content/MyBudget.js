import React from "react";
import Container from "@material-ui/core/Container";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles'
import {Box, Collapse} from "@material-ui/core";
import FloatingActionButton from "../FloatingActionButton";
import CalendarContext from "../context/CalendarContext";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";


// const useStyles = (themes) => ({
//     root: {
//         '& > *': {
//             borderBottom: 'unset',
//         }
//     },
//     table: {
//         minWidth: 650,
//     }
// });

class Row extends React.Component {
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
                                            <TableRow key={item.title}>
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


class MyBudget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            periods: []
        }
    }

    createData(name, budget, expenses, gains, total) {
        return {name, budget, expenses, gains, total};
    }

    // periods = [
    //     {
    //         name: 'Weeks',
    //         items: [
    //             this.createData('Jan 4 - Jan 10', 100, 50, 0, 50),
    //             this.createData('Jan 11 - Jan 17', 100, 50, 0, 50),
    //             this.createData('Jan 18 - Jan 24', 100, 50, 0, 50),
    //             this.createData('Jan 25 - Jan 31', 100, 50, 0, 50)
    //         ]
    //     },
    //     {
    //         name: 'Month',
    //         items: [
    //             this.createData('January', 500, 100, 0, 400)
    //         ]
    //     },
    //     {
    //         name: 'Year',
    //         items: [
    //             this.createData('2021', 100, 50, 0, 50)
    //         ]
    //     }]

    handleClickOpen = () => {
        // this.setState({isNewItemFDOpen: true})
    }

    handleAdvanceMonth = (event) => {
        event.stopPropagation()
        this.context.setCalendarDateMonth(1)
        this.updatePeriods()
    }

    handleRecedeMonth = (event) => {
        event.stopPropagation()
        this.context.setCalendarDateMonth(-1)
        this.updatePeriods()
    }

    handleDateChange = (event) => {
        this.context.setCalendarDate(event)
        this.updatePeriods()
    }

    updatePeriods = () => {
        this.context.getCalendar().then(calendar => {
            let weekRows = []
            calendar.budget.week
                .filter(week => {
                    return moment(week.date).isSame(this.context.getCalendarDate(), 'month')
                })
                .map(week => {
                    const start = moment(week.date)
                    const end = moment(week.date).add(7, 'day')
                    const date = `${start.format('MMM DD')} - ${end.clone().subtract(1, 'day').format('MMM DD')}`

                    const items = this.context.getItems().filter(item => {
                        return moment(item.start).isBefore(end) && moment(item.end).isAfter(start)
                    })

                    const budget = parseFloat(week.value)
                    let expenses = 0
                    let gains = 0
                    let total = budget
                    items.forEach(item => {
                        if (item.type === 'expense') {
                            total -= parseFloat(item.value)
                            expenses += parseFloat(item.value)
                        }
                        if (item.type === 'gain') {
                            total += parseFloat(item.value)
                            gains += parseFloat(item.value)
                        }
                    })
                    weekRows.push({
                        "name": date,
                        "budget": budget,
                        "expenses": expenses,
                        "gains": gains,
                        "total": total,
                        "items": items
                    })
                })
            this.setState({
                periods: [
                    {
                        name: 'Weeks',
                        items: weekRows
                    }
                ]
            })
        })
    }

    componentDidMount() {
        this.updatePeriods()
    }

    render() {
        return (
            <Container>
                <Typography variant='h4' align='center'>
                    {moment(this.context.getCalendarDate()).format("MMMM YYYY")}
                </Typography>
                {this.state.periods.map(period => (
                    <Box mb={3} key={period.name}>
                        <h4>{period.name}</h4>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell>Period</TableCell>
                                        <TableCell align="right">Budget</TableCell>
                                        <TableCell align="right">Expenses</TableCell>
                                        <TableCell align="right">Gains</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {period.items.map((row) => (
                                        <Row key={row.title} row={row}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
                <FloatingActionButton date={this.context.getCalendarDate()}
                                      handleOnClickFAB={this.handleClickOpen}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}/>
            </Container>
        );
    }
}

MyBudget.contextType = CalendarContext

// export default withStyles(useStyles)(MyBudget)
export default MyBudget