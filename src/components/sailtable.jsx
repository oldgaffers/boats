import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { m2f } from '../util/format';

export default function SailTable( { handicapData }) {
    if (!handicapData.main) {
        return '';
    }
    return (
    <TableContainer component={Paper}>
        <Table size="small" aria-label="sail data">
        <TableHead>
            <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">luff</TableCell>
            <TableCell align="right">head/leach</TableCell>
            <TableCell align="right">foot/perpendicular</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.entries(handicapData)
                .filter(([, val]) => val.luff)
                .map(([name, sail]) => 
            (<TableRow key={name}>
                <TableCell component="th" scope="row">{name.replace(/_/g, ' ')}</TableCell>
                <TableCell align="right">{m2f(sail.luff)}</TableCell>
                <TableCell align="right">{m2f(sail.head?sail.head:sail.leach)}</TableCell>
                <TableCell align="right">{m2f(sail.foot?sail.foot:sail.perpendicular)}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}