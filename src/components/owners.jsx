import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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

function OwnersTable({ classes, owners }) {
  const memberNumbers = owners
    .map((owner) => owner.member)
    .filter((n, index, array) => n && array.indexOf(n) === index);
  console.log(memberNumbers);
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
    <Table className={classes.table} size="small" aria-label="owners">
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

export default function Owners({ classes, boat }) {
  console.log('ownerships', boat.ownerships);
  const { current, owners } = boat.ownerships;
  if (owners && owners.length > 0) {
    return (
      <TableContainer component={Paper}>
        <OwnersTable classes={classes} owners={owners}/>
      </TableContainer>
    );  
  }
  if (current && current.length > 0) {
    return (
      <TableContainer component={Paper}>
        <OwnersTable classes={classes} owners={current}/>
      </TableContainer>
    );  
  }
  console.log('current_owners', current);
  return (<div/>);
}
