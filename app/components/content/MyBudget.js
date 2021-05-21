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
import {CalendarContext} from "../context/CalendarContext";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import BudgetRow from "../BudgetRow";
import CreateBudgetFormDialog from "../forms/CreateBudgetFormDialog";
import axios from "axios";
import ViewBudgetFormDialog from "../forms/ViewBudgetFormDialog";

class MyBudget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            periods: [],
            isNewBudgetFDOpen: false,
            isBudgetFDOpen: false,
            currentlyOpenBudget: {}
        }
    }

    handleClickOpen = () => {
        this.setState({isNewBudgetFDOpen: true})
    }

    handleAdvanceMonth = (event) => {
        const calendarDate = this.context.offsetCalendarDate(1)
        this.updatePeriods(calendarDate)
    }

    handleRecedeMonth = (event) => {
        const calendarDate = this.context.offsetCalendarDate(-1)
        this.updatePeriods(calendarDate)
    }

    handleDateChange = (event) => {
        const calendarDate = this.context.setCalendarDate(event)
        this.updatePeriods(calendarDate)
    }

    handleCurrencyChange = (currency) => {
        const periods = this.state.periods.map(period => {
            period.items = period.items.map(item => {
                item.displayBudget = this.context.buildDisplayValue(item.budget, currency)
                item.displayExpenses = this.context.buildDisplayValue(item.expenses, currency)
                item.displayGains = this.context.buildDisplayValue(item.gains, currency)
                item.displayTotal = this.context.buildDisplayValue(item.total, currency)
                return item
            })
            return period
        })
        this.setState({periods: periods})
    }

    setNewBudgetFD = (event) => {
        this.setState({isNewBudgetFDOpen: event})
    }

    setBudgetFD = (event) => {
        this.setState({isBudgetFDOpen: event})
    }

    handleNewBudget = (budget, cb) => {
        axios.post(`/calendar/${this.context.calendarId}/budget`, budget)
            .then(resp => {
                this.context.handleNewBudget(resp.data)
                cb()
                this.updatePeriods(this.context.calendarDate)
            })
            .catch(err => {
                cb()
            })
    }

    handleUpdateBudget = (id, budget, cb) => {
        axios.put(`/calendar/${this.context.calendarId}/budget/${id}`, budget)
            .then(resp => {
                this.context.handleUpdateBudget(resp.data)
                cb()
                this.updatePeriods(this.context.calendarDate)
            })
            .catch(err => {
                cb()
            })
    }

    handleDeleteBudget = (id, period, cb) => {
        axios.delete(`/calendar/${this.context.calendarId}/budget/${id}`)
            .then(resp => {
                this.context.handleDeleteBudget(id, period)   //TODO Change to response from id
                cb()
                this.updatePeriods(this.context.calendarDate)
            })
            .catch(err => {
                cb()
            })
    }

    onClickBudget = (id, period) => {
        const budget = this.context.calendar.budget[period].find(budget => budget.id === id)
        this.setState({
            currentlyOpenBudget: budget,
            isBudgetFDOpen: true
        })
    }

    updatePeriods = (calendarDate) => {
        const calendar = this.context.calendar
        let weekRows = []
        calendar.budget.week
            .filter(week => {
                return moment(week.date).isSame(moment(calendarDate), 'month')
            })
            .sort((first, second) => moment(first.date).isAfter(second.date) ? 1 : -1)
            .map(week => {
                const id = week.id
                const period = week.period
                const start = moment(week.date).startOf('isoWeek')
                const end = start.clone().add(7, 'day')
                const date = `${start.format('MMM DD')} - ${end.clone().subtract(1, 'day').format('MMM DD')}`
                const budget = week.value
                weekRows.push(this.buildRow(id, period, start, end, date, budget))
            })

        let monthRows = []
        calendar.budget.month
            .filter(month => {
                return moment(month.date).isSame(moment(calendarDate), 'month')
            })
            .map(month => {
                const id = month.id
                const period = month.period
                const start = moment(month.date).startOf('month')
                const end = start.clone().endOf('month')
                const date = `${start.format('MMMM')}`
                const budget = month.value
                monthRows.push(this.buildRow(id, period, start, end, date, budget))
            })

        let yearRows = []
        calendar.budget.year
            .filter(month => {
                return moment(month.date).isSame(moment(calendarDate), 'year')
            })
            .map(year => {
                const id = year.id
                const period = year.period
                const start = moment(year.date).startOf('year')
                const end = start.clone().endOf('year')
                const date = `${start.format('YYYY')}`
                const budget = year.value
                yearRows.push(this.buildRow(id, period, start, end, date, budget))
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
    }

    buildRow(id, period, start, end, date, budget) {
        const items = this.context.items.filter(item => {
            return moment(item.start).isBefore(end) && moment(item.end).isAfter(start)
        })
        let expenses = 0
        let gains = 0
        let total = budget
        items.forEach(item => {
            if (item.type === 'expense') {
                total -= item.value
                expenses += item.value
            }
            if (item.type === 'gain') {
                total += item.value
                gains += item.value
            }
        })
        return {
            "id": id,
            "period": period,
            "name": date,
            "budget": budget,
            "expenses": expenses,
            "gains": gains,
            "total": total,
            "displayBudget": this.context.buildDisplayValue(budget),
            "displayExpenses": this.context.buildDisplayValue(expenses),
            "displayGains": this.context.buildDisplayValue(gains),
            "displayTotal": this.context.buildDisplayValue(total),
            "items": items
        }
    }

    componentDidMount() {
        this.updatePeriods(this.context.calendarDate)
    }

    render() {
        return (
            <Container>
                <Typography variant='h4' align='center'>
                    {moment(this.context.calendarDate).format("MMMM YYYY")}
                </Typography>
                {this.state.periods.map(period => (
                    <Box mb={3} key={period.name}>
                        <Typography variant='h5'>{period.name}</Typography>
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
                                    {period.items.map((row, index) => (
                                        <BudgetRow key={index} row={row} onClick={this.onClickBudget}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
                <CreateBudgetFormDialog isOpen={this.state.isNewBudgetFDOpen} setOpen={this.setNewBudgetFD}
                                        handleNewBudget={this.handleNewBudget}/>
                <ViewBudgetFormDialog isOpen={this.state.isBudgetFDOpen} setOpen={this.setBudgetFD}
                                      currentlyOpenBudget={this.state.currentlyOpenBudget}
                                      handleUpdateBudget={this.handleUpdateBudget}
                                      handleDeleteBudget={this.handleDeleteBudget}/>
                <FloatingActionButton date={this.context.calendarDate}
                                      handleOnClickFAB={this.handleClickOpen}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}
                                      handleCurrencyChange={this.handleCurrencyChange}/>
            </Container>
        );
    }
}

MyBudget.contextType = CalendarContext

export default MyBudget