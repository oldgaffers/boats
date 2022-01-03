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
import { useLazyQuery } from '@apollo/react-hooks';

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
  const [getMembersResults, { loading, error, data }] = useLazyQuery(gql(`query members {
    members(members: ${JSON.stringify(memberNumbers)}) {
      firstname
      lastname
      member
      id
    }
  }`));
  if (loading) return <CircularProgress />;
  if (error) console.log(`Error! ${error}`);
  const memberNumbers = owners.filter((o) => o.member && !o.name).map((o) => o.id);
  if (memberNumbers.length > 0) {
    getMembersResults();
  }
  const { members } = data || { members: [] };
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
