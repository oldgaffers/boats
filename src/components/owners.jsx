import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function Owner({ owner }) {
  console.log('Owner', owner);
    return (
    <TableRow key={owner.id}>
        <TableCell align="left">{owner.name}</TableCell>
        <TableCell align="left">{owner.start || '?'}</TableCell>
        <TableCell align="left">{owner.end || '-'}</TableCell>
        <TableCell align="left">{owner.share}/64</TableCell>
    </TableRow>
    );
}

function OwnersTable({ owners }) {
  const memberNumbers = owners
    .map((owner) => owner.member)
    .filter((n, index, array) => n && array.indexOf(n) === index);
  const membersResults = useQuery(gql(`query members {
    members(members: ${JSON.stringify(memberNumbers)}) {
      firstname
      lastname
      member
      id
    }
  }`));
  if (membersResults.loading) return <CircularProgress />;
  console.log(membersResults);
  const { members } = membersResults.data || { members: [] };
  console.log('members', JSON.stringify(members));
  const ownersWithNames = owners.map((owner) => {
    if (owner.name) {
      return owner;
    }
    let name = '';
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      name = `${m[0].firstname} ${m[0].lastname}`;
    }
    return {
      ...owner,
      name,
    }  
  });
  return (
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
        {ownersWithNames
          .sort((a, b) => a.start>b.start)
          .map((owner) => (<Owner id={owner.id} owner={owner}/>))
        }
    </TableBody>
    </Table>
  );
}

export default function Owners({ boat }) {
  const { current, owners } = boat.ownerships || { current: [], owners: [] };
  if (owners && owners.length > 0) {
    return (
      <TableContainer component={Paper}>
        <OwnersTable owners={owners}/>
      </TableContainer>
    );  
  }
  if (current && current.length > 0) {
    return (
      <TableContainer component={Paper}>
        <OwnersTable owners={current}/>
      </TableContainer>
    );  
  }
  return (<div/>);
}
