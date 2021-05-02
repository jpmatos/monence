import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import {yellow} from '@material-ui/core/colors';
import {blue} from '@material-ui/core/colors';
import {Box} from "@material-ui/core";

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
        background: `linear-gradient(to right, ${yellow[700]}, ${yellow[700]})`,
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
            content: '"Rec."',
            left: 4,
            opacity: 0,
        },
        '&:after': {
            content: '"One"',
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
            background: `linear-gradient(to right, ${blue[500]}, ${blue[500]})`,
            '&:before': {
                opacity: 1,
            },
            '&:after': {
                opacity: 0,
            }
        },
    },
}))(Switch);

export default function ItemRecurrencySwitch(props) {
    const handleChange = (event) => {
        props.handleRecurrencyChange(event.target.checked) // true=Multi false=One-Time
    };

    return (
        <Box mt={1} mb={1}>
            <Typography component="div">
                <AntSwitch onChange={handleChange}/>
            </Typography>
        </Box>
    );
}
