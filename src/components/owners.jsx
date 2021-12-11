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
        <TableCell align="left">{owner.firstname} {owner.lastname}</TableCell>
        <TableCell align="right">{owner.share}/64</TableCell>
    </TableRow>
    );
}

function OwnersTable({ classes, owners }) {
  const memberNumbers = owners.map((owner) => owner.member);
  console.log(memberNumbers);
  const membersResults = useQuery(gql(`query members {
    members(members: ${memberNumbers}) {
      firstname
      lastname
      member
      id
    }
  }`));
  if (membersResults.loading) return <CircularProgress />;
  const { members } = membersResults.data;
  console.log('members', JSON.stringify(members));
  const ownersWithNames = owners.map((owner) => {
    let firstname = '';
    let lastname = '';
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      firstname = m[0].firstname;
      lastname = m[0].lastname;
    }
    return {
      ...owner,
      firstname, lastname,
    }
  });
  return (
    <Table className={classes.table} size="small" aria-label="owners">
    <TableHead>
        <TableRow>
        <TableCell align="left">Name</TableCell>
        <TableCell align="right">Share</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {ownersWithNames.map((owner) => (<Owner owner={owner}/>))}
    </TableBody>
    </Table>
  );
}

export default function Owners({ classes, boat }) {
    const owner = useQuery(gql(`query boat {
        boat(where: {oga_no: {_eq: ${boat.oga_no}}}) {
          current_owners
        }
      }`));
    if (owner.loading) return <CircularProgress />;
    const { current_owners } = owner.data.boat[0];
    if (current_owners && current_owners.length > 0) {
      return (
        <TableContainer component={Paper}>
          <OwnersTable classes={classes} owners={current_owners}/>
        </TableContainer>
      );  
    }
    console.log('current_owners', current_owners);
    return (<div/>);
}
