import React from 'react';
import createTrend from 'trendline';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart
} from 'recharts';
import {CalendarContext} from "../context/CalendarContext";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import FloatingActionButton from "../FloatingActionButton";

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'rgba(255, 255, 255, 255)',
                lineHeight: '5px',
                border: '10px solid rgba(255, 255, 255, 255)',
                borderBottom: '1px solid rgba(255, 255, 255, 255)'
            }}>
                <p className="label">{`Day ${label}`}</p>
                <p className="label">{`Value : ${payload[0].value.toString().replace('-', '+')} €`}</p>
                {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
                {/*<p className="desc">Anything you want can be displayed here.</p>*/}
            </div>
        );
    }

    return null;
};

class MyForecast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sumData: [],
            off: 0,
            sumDataOff: 0
        }
    }

    handleAdvanceMonth = (event) => {
        this.context.offsetCalendarDate(1)
    }

    handleRecedeMonth = (event) => {
        this.context.offsetCalendarDate(-1)
    }

    handleDateChange = (event) => {
        this.context.setCalendarDate(event)
    }

    updateData() {
        let data = []
        const start = moment(this.context.calendarDate).startOf('month')
        const end = moment(this.context.calendarDate).endOf('month')
        const days = moment(this.context.calendarDate).daysInMonth()
        for (let i = 1; i <= days; i++) {
            data.push({value: 0, day: i})
        }
        this.context.items
            .filter(item => {
                return moment(item.start).isBefore(end) && moment(item.end).isAfter(start)
            })
            .map(item => {
                const day = moment.utc(item.start).date() - 1
                switch (item.type) {
                    case 'expense':
                        data[day].value += parseFloat(item.value)
                        break
                    case 'gain':
                        data[day].value -= parseFloat(item.value)
                }
            })
        this.setState({
            data: data
        })
        return data
    }

    updateSumData(data) {
        let sumData = []
        data.reduce((currentValue, item, index) => {
            currentValue += parseFloat(item.value)
            sumData[index] = {day: item.day, value: currentValue}
            return currentValue
        }, 0)
        return sumData
    }

    xRange(data) {
        const days = data.map((data) => data.day)
        return [Math.min(...days), Math.max(...days)]
    }

    yRange(data) {
        const values = data.map((data) => data.value)
        return [Math.min(...values), Math.max(...values)]
    }

    gradientOffset(data) {
        const dataMax = Math.max(...data.map((i) => i.value));
        const dataMin = Math.min(...data.map((i) => i.value));
        let off
        if (dataMax <= 0) {
            off = 0;
        } else if (dataMin >= 0) {
            off = 1;
        } else
            off = dataMax / (dataMax - dataMin);
        return off
    };

    componentDidMount() {
        const data = this.updateData()
        const off = this.gradientOffset(data)
        const sumData = this.updateSumData(data)
        const sumDataOff = this.gradientOffset(sumData)
        this.setState({
            data: data,
            sumData: sumData,
            off: off,
            sumDataOff: sumDataOff
        })
    }

    render() {
        return (
            <React.Fragment>
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
                            <AreaChart
                                width={600}
                                height={400}
                                data={this.state.data}
                                margin={{top: 5, right: 30, bottom: 5, left: -20}}

                            >
                                <Tooltip content={<CustomTooltip/>}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                {/*<Legend />*/}
                                <XAxis
                                    name="Day"
                                    type="number"
                                    dataKey="day"
                                    domain={this.xRange(this.state.data)}
                                />
                                <YAxis
                                    name="Value"
                                    type="number"
                                    dataKey="value"
                                    domain={this.yRange(this.state.data)}
                                />
                                <defs>
                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={this.state.off} stopColor="red" stopOpacity={1}/>
                                        <stop offset={this.state.off} stopColor="green" stopOpacity={1}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#000" fill="url(#splitColor)"/>
                            </AreaChart>
                            <AreaChart
                                width={600}
                                height={400}
                                data={this.state.sumData}
                                margin={{top: 5, right: 30, bottom: 5, left: -20}}

                            >
                                <Tooltip content={<CustomTooltip/>}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                {/*<Legend />*/}
                                <XAxis
                                    name="Day"
                                    type="number"
                                    dataKey="day"
                                    domain={this.xRange(this.state.sumData)}
                                />
                                <YAxis
                                    name="Value"
                                    type="number"
                                    dataKey="value"
                                    domain={this.yRange(this.state.sumData)}
                                />
                                <defs>
                                    <linearGradient id="splitColorSumData" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={this.state.sumDataOff} stopColor="red" stopOpacity={1}/>
                                        <stop offset={this.state.sumDataOff} stopColor="green" stopOpacity={1}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#000" fill="url(#splitColorSumData)"/>
                            </AreaChart>
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