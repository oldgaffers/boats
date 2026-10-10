import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function formatName({ name, text, note }) {
  if (name) return name;
  if (text) return text;
  if (note) return note;
  return '?'
}

function formatEnd(owner) {
  if (owner.end) return owner.end;
  if (!owner.current) return '-';
  if (!owner.id) return 'Present';
  return 'Present member';
}

function Owner({ owner }) {
  const name = formatName(owner);
  const share = owner.share ? `${owner.share}/64` : '';
  return (
    <TableRow>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{owner.start || '?'}</TableCell>
      <TableCell align="left">{formatEnd(owner)}</TableCell>
      <TableCell align="left">{share}</TableCell>
    </TableRow>
  );
}

export default function Owners({ ownerships }) {
  if (ownerships.length === 0) {
    return (<div />);
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="owners">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">From</TableCell>
            <TableCell align="left">To</TableCell>
            <TableCell align="left">Share</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ownerships.map((owner, index) => <Owner key={index} owner={owner} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
