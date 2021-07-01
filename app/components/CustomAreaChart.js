import React from 'react';
import {Area, AreaChart, CartesianGrid, Label, Tooltip, XAxis, YAxis} from "recharts";
import CustomTooltip from "./CustomToolTip";

export default class CustomAreaChart extends React.Component {
    constructor(props) {
        super(props);
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

    xRange(data) {
        const times = data.map((data) => data.time)
        return [Math.min(...times), Math.max(...times)]
    }

    yRange(data) {
        const values = data.map((data) => data.value)
        return [Math.min(...values), Math.max(...values)]
    }

    render() {
        return (
            <AreaChart
                width={600}
                height={400}
                data={this.props.data}
                margin={{top: 5, right: 30, bottom: 5, left: -20}}

            >
                <Tooltip content={<CustomTooltip labelName={this.props.labelName}/>}/>
                <CartesianGrid strokeDasharray="3 3"/>
                {/*<Legend />*/}
                <XAxis
                    name={this.props.labelName}
                    type="number"
                    dataKey="time"
                    domain={this.xRange(this.props.data)}
                >
                    <Label
                        value={this.props.labelName}
                        position="insideBottomRight"
                        offset={0}
                        content={props => {
                            return (
                                <text
                                    style={{fontSize: "14px"}}
                                    x={props.viewBox.x + props.viewBox.width}
                                    y={props.viewBox.y + props.viewBox.height + 3}
                                    textAnchor="end"
                                    fill="#bfbfbf"
                                >
                                    {props.value}
                                </text>
                            );
                        }}
                    />
                </XAxis>
                <YAxis
                    name="Value"
                    type="number"
                    dataKey="value"
                    domain={this.yRange(this.props.data)}
                >
                    <Label
                        value="Expenses"
                        position="insideTopLeft"
                        offset={0}
                        // angle={-90}
                        content={props => {
                            return (
                                <text
                                    style={{fontSize: "14px", transform: 'rotate(-90deg)'}}
                                    x={-30}
                                    y={props.viewBox.y + props.viewBox.width - 40}
                                    textAnchor="end"
                                    fill="#bfbfbf"
                                >
                                    {props.value}
                                </text>
                            );
                        }}
                    />
                </YAxis>
                <defs>
                    <linearGradient id={this.props.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset={this.gradientOffset(this.props.data)} stopColor="red" stopOpacity={1}/>
                        <stop offset={this.gradientOffset(this.props.data)} stopColor="green" stopOpacity={1}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#000" fill={`url(#${this.props.id})`}/>
            </AreaChart>
        )
    }
}