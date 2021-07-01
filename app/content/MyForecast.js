import {FormControlLabel, Switch} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import React from 'react';

import {ResponsiveContainer} from 'recharts';
import CustomAreaChart from "../components/CustomAreaChart";
import FloatingActionButton from "../components/FloatingActionButton";
import {CalendarContext} from "../context/default/CalendarContext";

class MyForecast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: null,    //Items used to build the data with. Used for updating purposes. Not a source of truth
            data: [],
            sumData: [],
            yearData: [],
            yearDataSum: [],
            gainsSwitch: true
        }
    }

    handleAdvanceMonth = (event) => {
        const currDate = this.context.calendarDate
        const calendarDate = this.context.offsetCalendarDate(1)
        this.updateStateValues(calendarDate)
        if (moment(currDate).year() !== moment(calendarDate).year())
            this.updateStateYearValues(calendarDate)
    }

    handleRecedeMonth = (event) => {
        const currDate = this.context.calendarDate
        const calendarDate = this.context.offsetCalendarDate(-1)
        this.updateStateValues(calendarDate)
        if (moment(currDate).year() !== moment(calendarDate).year())
            this.updateStateYearValues(calendarDate)
    }

    handleDateChange = (event) => {
        const currDate = this.context.calendarDate
        const calendarDate = this.context.setCalendarDate(event)
        this.updateStateValues(calendarDate)
        if (moment(currDate).year() !== moment(calendarDate).year())
            this.updateStateYearValues(calendarDate)
    }

    handleSwitchGainsChane = (event) => {
        this.setState({gainsSwitch: event.target.checked})
        this.updateStateValues(this.context.calendarDate, event.target.checked)
        this.updateStateYearValues(this.context.calendarDate, event.target.checked)
    }

    calculateData(calendarDate, times, unitOfTime, gainsSwitch) {
        let data = []
        const start = moment(calendarDate).startOf(unitOfTime)
        const end = moment(calendarDate).endOf(unitOfTime)
        for (let i = 1; i <= times; i++) {
            data.push({value: 0, time: i})
        }
        this.context.items
            .filter(item => {
                return moment(item.start).isBefore(end) && moment(item.end).isAfter(start)
            })
            .map(item => {
                let time = 0
                if (unitOfTime === 'month')
                    time = moment.utc(item.start).date() - 1
                if (unitOfTime === 'year')
                    time = moment.utc(item.start).month() - 1
                switch (item.type) {
                    case 'expense':
                        data[time].value += parseFloat(item.value)
                        break
                    case 'gain':
                        if (gainsSwitch)
                            data[time].value -= parseFloat(item.value)
                        break
                }
            })
        return data
    }

    calculateSumData(data) {
        let sumData = []
        data.reduce((currentValue, item, index) => {
            currentValue += parseFloat(item.value)
            sumData[index] = {time: item.time, value: currentValue}
            return currentValue
        }, 0)
        return sumData
    }

    updateStateValues(calendarDate, gainsSwitch = this.state.gainsSwitch) {
        const data = this.calculateData(calendarDate, moment(calendarDate).daysInMonth(), 'month', gainsSwitch)
        const sumData = this.calculateSumData(data)
        this.setState({
            data: data,
            sumData: sumData
        })
    }

    updateStateYearValues(calendarDate, gainsSwitch = this.state.gainsSwitch) {
        const yearData = this.calculateData(calendarDate, 12, 'year', gainsSwitch)
        const yearDataSum = this.calculateSumData(yearData)
        this.setState({
            yearData: yearData,
            yearDataSum: yearDataSum
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.items !== null && JSON.stringify(prevState.items) !== JSON.stringify(this.context.items)) {
            this.updateStateValues(this.context.calendarDate)
            this.updateStateYearValues(this.context.calendarDate)
            this.setState({
                items: [...this.context.items]
            })
        }
    }

    componentDidMount() {
        this.updateStateValues(this.context.calendarDate)
        this.updateStateYearValues(this.context.calendarDate)
        this.setState({
            items: [...this.context.items]
        })
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant='h4' align='center'>
                    {moment(this.context.calendarDate).format("MMMM YYYY")}
                </Typography>
                <ResponsiveContainer>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Box>
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-around"
                                    alignItems="center"
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.gainsSwitch}
                                                onChange={this.handleSwitchGainsChane}
                                                label='Gains'
                                                color="primary"
                                                name="checkedB"
                                                inputProps={{'aria-label': 'primary checkbox'}}
                                            />}
                                        label={'Gains'}
                                    />
                                    <Typography variant='h5' align='center'>
                                        Expenses
                                    </Typography>
                                    <Box ml={13}/>
                                </Grid>
                                <CustomAreaChart data={this.state.data} id='splitColor' labelName='Day'/>
                            </Box>
                            <Box>
                                <Typography variant='h5' align='center'>
                                    Cumulative Expenses
                                </Typography>
                                <CustomAreaChart data={this.state.sumData} id='splitColorSum' labelName='Day'/>
                            </Box>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Box>
                                <Typography variant='h5' align='center'>
                                    Year Expenses
                                </Typography>
                                <CustomAreaChart data={this.state.yearData} id='splitColorYear' labelName='Month'/>
                            </Box>
                            <Box>
                                <Typography variant='h5' align='center'>
                                    Cumulative Year Expenses
                                </Typography>
                                <CustomAreaChart data={this.state.yearDataSum} id='splitColorYearSum'
                                                 labelName='Month'/>
                            </Box>
                        </Grid>
                    </Grid>
                </ResponsiveContainer>
                <FloatingActionButton date={this.context.calendarDate}
                                      hideCreate={true}
                                      handleDateChange={this.handleDateChange}
                                      handleAdvanceMonth={this.handleAdvanceMonth}
                                      handleRecedeMonth={this.handleRecedeMonth}/>
            </React.Fragment>
        );
    }
}

MyForecast.contextType = CalendarContext

export default MyForecast