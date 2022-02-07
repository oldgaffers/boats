import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import YAML from 'yaml'

const renderCell = (value) => {
    if (Array.isArray(value)) {
        return JSON.stringify(value);
    } else if (typeof value === 'object') {
        return (<pre align="left">{YAML.stringify(value)}</pre>);
    }
    return value;
};

export default function ChangeViewer({ onClose, open, different, change }) {
    const handleClose = () => {
        console.log('ChangeViewer close');
        onClose();
    }
    // console.log('ChangeViewer', different, change.old, change.new);
    return (
        <Dialog open={open} fullWidth={true} maxWidth='xl'>
        <DialogTitle>Change for {change.old.name} ({change.old.oga_no})</DialogTitle>
        <DialogContent>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">Current</TableCell>
            <TableCell align="left">Proposed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {different.map((key) => (
            <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
              <TableCell component="th" scope="row">
                {key}
              </TableCell>
              <TableCell align="right">{renderCell(change.old[key])}</TableCell>
              <TableCell align="right">{renderCell(change.new[key])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
        </Dialog>
    );
}