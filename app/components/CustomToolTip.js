import moment from "moment";
import React from "react";

export default function CustomTooltip({active, payload, label, labelName}) {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'rgba(255, 255, 255, 255)',
                lineHeight: '5px',
                border: '10px solid rgba(255, 255, 255, 255)',
                borderBottom: '1px solid rgba(255, 255, 255, 255)'
            }}>
                <p className="label">{labelName === 'Month' ? `${moment.months(label - 1)}` : `${labelName} ${label}`}</p>
                <p className="label">{`Value : ${payload[0].value.toString().replace('-', '+')} €`}</p>
            </div>
        );
    }

    return null;
};