import {Box} from "@material-ui/core";
import {green, red} from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const AntSwitch = withStyles((theme) => ({
    root: {
        width: 100,
        height: 48,
        padding: 8,
    },
    switchBase: {
        padding: 11,
    },
    thumb: {
        width: 26,
        height: 26,
        backgroundColor: '#fff',
    },
    track: {
        background: `linear-gradient(to right, ${red[500]}, ${red[500]})`,
        opacity: '1 !important',
        borderRadius: 20,
        position: 'relative',
        '&:before, &:after': {
            display: 'inline-block',
            position: 'absolute',
            top: '50%',
            width: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            textAlign: 'center',
        },
        '&:before': {
            content: '"Gain"',
            left: 4,
            opacity: 0,
        },
        '&:after': {
            content: '"Cost"',
            right: 4,
        },
    },
    checked: {
        '&$switchBase': {
            color: '#185a9d',
            transform: 'translateX(50px)',
            '&:hover': {
                backgroundColor: 'rgba(24,90,257,0.08)',
            },
        },
        '& $thumb': {
            backgroundColor: '#fff',
        },
        '& + $track': {
            background: `linear-gradient(to right, ${green[500]}, ${green[500]})`,
            '&:before': {
                opacity: 1,
            },
            '&:after': {
                opacity: 0,
            }
        },
    },
}))(Switch);

export default function ItemTypeSwitch(props) {
    const handleChange = (event) => {
        props.handleTypeChange(event.target.checked) // true=cost/expense false=gain
    };

    return (
        <Box mt={1} mb={1}>
            <Typography component="div">
                <AntSwitch onChange={handleChange}/>
            </Typography>
        </Box>
    );
}
