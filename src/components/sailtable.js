import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { m2df } from '../util/format';

function feet(val) { 
    if(val) {
        return `${m2df(val)} ft`
    }
}

export default function SailTable( { rows, classes }) {
    return (
    <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="sail data">
        <TableHead>
            <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">luff</TableCell>
            <TableCell align="right">head/leach</TableCell>
            <TableCell align="right">foot/perpendicular</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => 
            (<TableRow key={row.name}>
                <TableCell component="th" scope="row">{row.name.replace(/_/g, ' ')}</TableCell>
                <TableCell align="right">{feet(row.luff)}</TableCell>
                <TableCell align="right">{feet(row.head?row.head:row.leach)}</TableCell>
                <TableCell align="right">{feet(row.foot?row.foot:row.perpendicular)}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}