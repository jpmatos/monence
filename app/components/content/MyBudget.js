import React from "react";
import Container from "@material-ui/core/Container";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Box} from "@material-ui/core";
import FloatingActionButton from "../FloatingActionButton";
import CalendarContext from "../context/CalendarContext";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import BudgetRow from "../BudgetRow";

class MyBudget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            periods: []
        }
    }

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
                    const start = moment(week.date).startOf('week')
                    const end = start.clone().add(7, 'day')
                    const date = `${start.format('MMM DD')} - ${end.clone().subtract(1, 'day').format('MMM DD')}`
                    const budget = parseFloat(week.value)
                    weekRows.push(this.buildRow(start, end, date, budget))
                })

            let monthRows = []
            calendar.budget.month
                .filter(month => {
                    return moment(month.date).isSame(this.context.getCalendarDate(), 'month')
                })
                .map(month => {
                    const start = moment(month.date).startOf('month')
                    const end = start.clone().endOf('month')
                    const date = `${start.format('MMMM')}`
                    const budget = parseFloat(month.value)
                    monthRows.push(this.buildRow(start, end, date, budget))
                })

            let yearRows = []
            calendar.budget.year
                .filter(month => {
                    return moment(month.date).isSame(this.context.getCalendarDate(), 'year')
                })
                .map(year => {
                    const start = moment(year.date).startOf('year')
                    const end = start.clone().endOf('year')
                    const date = `${start.format('YYYY')}`
                    const budget = parseFloat(year.value)
                    yearRows.push(this.buildRow(start, end, date, budget))
                })

            this.setState({
                periods: [
                    {
                        name: 'Weeks',
                        items: weekRows
                    },
                    {
                        name: 'Month',
                        items: monthRows
                    },
                    {
                        name: 'Year',
                        items: yearRows
                    }
                ]
            })
        })
    }

    buildRow(start, end, date, budget) {
        const items = this.context.getItems().filter(item => {
            return moment(item.start).isBefore(end) && moment(item.end).isAfter(start)
        })
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
        return {
            "name": date,
            "budget": budget,
            "expenses": expenses,
            "gains": gains,
            "total": total,
            "items": items
        }
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
                                        <BudgetRow key={row.title + row.start} row={row}/>
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

export default MyBudget