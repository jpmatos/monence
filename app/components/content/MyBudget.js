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
import {Box} from "@material-ui/core";


const useStyles = (themes) => ({
    table: {
        minWidth: 650,
    },
});

class MyBudget extends React.Component {

    createData(name, budget, expenses, gains, total) {
        return {name, budget, expenses, gains, total};
    }

    periods = [
        {
            name: 'Months',
            headerName: 'Month',
            items: [
                this.createData('January', 500, 100, 0, 400),
                this.createData('February', 400, 200, 50, 250),
                this.createData('March', 100, 150, 0, -50)
            ]
        },
        {
            name: 'Weeks',
            headerName: 'Week',
            items: [
                this.createData('Jan 4 - Jan 10', 100, 50, 0, 50),
                this.createData('Jan 11 - Jan 17', 100, 50, 0, 50),
                this.createData('Jan 18 - Jan 24', 100, 50, 0, 50),
                this.createData('Jan 25 - Jan 31', 100, 50, 0, 50),
                this.createData('Feb 1 - Feb 7', 100, 50, 0, 50),
                this.createData('Feb 8 - Feb 14', 100, 50, 0, 50),
                this.createData('Feb 15 - Feb 21', 100, 50, 0, 50),
                this.createData('Feb 22 - Feb 28', 100, 50, 0, 50),
                this.createData('Mar 1 - Mar 7', 100, 50, 0, 50),
                this.createData('Mar 8 - Mar 14', 100, 50, 0, 50),
                this.createData('Mar 15 - Mar 21', 100, 50, 0, 50),
                this.createData('Mar 22 - Mar 28', 100, 50, 0, 50),
                this.createData('Mar 29 - Apr 5', 100, 50, 0, 50)
            ]
        },
        {
            name: 'Year',
            headerName: 'Year',
            items: [
                this.createData('2021', 100, 50, 0, 50)
            ]
        }]

    render() {
        const {classes} = this.props;
        return (
            <Container>
                {this.periods.map(period => (
                    <Box mb={3}>
                        <h4>{period.name}</h4>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{period.headerName}</TableCell>
                                        <TableCell align="right">Budget</TableCell>
                                        <TableCell align="right">Expenses</TableCell>
                                        <TableCell align="right">Gains</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {period.items.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.budget}</TableCell>
                                            <TableCell align="right">{row.expenses}</TableCell>
                                            <TableCell align="right">{row.gains}</TableCell>
                                            <TableCell align="right">{row.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
            </Container>
        );
    }
}

export default withStyles(useStyles)(MyBudget)