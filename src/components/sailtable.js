import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function SailTable( { rows, classes }) {
    return (
    <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="sail data">
        <TableHead>
            <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">luff</TableCell>
            <TableCell align="right">head</TableCell>
            <TableCell align="right">foot</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => 
            (<TableRow key={row.name}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right">{row.luff}</TableCell>
                <TableCell align="right">{row.head}</TableCell>
                <TableCell align="right">{row.foot}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}