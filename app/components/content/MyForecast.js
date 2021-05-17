import React from 'react';
import createTrend from 'trendline';

import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {CalendarContext} from "../context/CalendarContext";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

class MyForecast extends React.Component {

    weightData = [
        {weight: 2, dateTime: 1},
        {weight: 4, dateTime: 2},
        {weight: 5, dateTime: 3},
        {weight: 4, dateTime: 4},
        {weight: 5, dateTime: 5},
    ]

    weights = this.weightData.map((data) => data.weight);
    yMax = Math.max(...this.weights);
    yMin = Math.min(...this.weights);
    timestamps = this.weightData.map((data) => data.dateTime);
    xMax = Math.max(...this.timestamps);
    xMin = Math.min(...this.timestamps);

    trendData = () => {
        const trend = createTrend(this.weightData, 'dateTime', 'weight');
        const trendYMax = trend.calcY(this.xMax)
        const trendYMin =trend.calcY(this.xMin)
        const stepSize = (trendYMax - trendYMin) / 4
        const data = [
            {weight: trend.calcY(this.xMin), dateTime: this.xMin},
            {weight: trend.calcY(this.xMin) + stepSize, dateTime: 2},
            {weight: trend.calcY(this.xMin) + stepSize * 2, dateTime: 3},
            {weight: trend.calcY(this.xMin) + stepSize * 3, dateTime: 4},
            {weight: trend.calcY(this.xMax), dateTime: this.xMax},
        ]

        return data;
    };

    render() {
        return (
            <ResponsiveContainer>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                <LineChart
                    width={600}
                    height={400}
                    data={this.weightData}
                    // margin={{top: 5, right: 30, bottom: 5, left: -20}}

                >
                    <Tooltip  />
                    {/*<Legend />*/}
                    <XAxis
                        name="Time"
                        type="number"
                        dataKey="dateTime"
                        domain={[this.xMin, this.xMax]}
                    />
                    <YAxis
                        name="Weight"
                        type="number"
                        dataKey="weight"
                        domain={[this.yMin, this.yMax]}
                    />
                    <Line type="monotoneX" dataKey="weight" data={this.weightData}/>
                    <Line
                        data={this.trendData()}
                        dataKey="weight"
                        stroke="red"
                        strokeDasharray="3 3"
                    />
                </LineChart>
                </Grid>
            </ResponsiveContainer>
        );
    }
}

MyForecast.contextType = CalendarContext

export default MyForecast