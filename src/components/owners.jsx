import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Owner({ owner }) {
  // console.log(owner);
  const name = owner.name || owner.text || owner.note || 'name on record but withheld';
  const share = owner.share ? `${owner.share}/64` : '';
  return (
    <TableRow>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{owner.start || '?'}</TableCell>
      <TableCell align="left">{owner.end || '-'}</TableCell>
      <TableCell align="left">{share}</TableCell>
    </TableRow>
  );
}

/*

export const MEMBER_QUERY = gql(`query members($members: [Int]!) {
  members(members: $members) {
    firstname
    lastname
    member
    id
    GDPR
    skipper { text }
  }
}`);

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

const addNames = async (client, owners) => {
  const rawMemberNumbers = owners?.filter((o) => queryIf(o)).map((o) => o.member) || [];
  if (rawMemberNumbers.length === 0) {
    return owners;
  }
  const memberNumbers = [...new Set(rawMemberNumbers)]; // e.g. husband and wife owners
  const r = await client.query({ query: MEMBER_QUERY, variables: { members: memberNumbers } });
  const members = r.data.members;
  return owners.map((owner) => {
    const r = { ...owner };
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      const { skipper, GDPR, firstname, lastname } = m[0];
      if (GDPR) {
        r.name = `${firstname} ${lastname}`;
      }
      if (skipper) {
        r.skipper = skipper;
      }
    }
    return r;
  });
};

  const ownerships = result || boat.ownerships || [];
  ownerships.sort((a, b) => a.start > b.start);
*/

export default function Owners({ owners }) {
  if (owners?.length === 0) {
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
          {owners.map((owner, index) => <Owner key={index} owner={owner} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}