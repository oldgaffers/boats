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

function Owner({ id, share, firstname, lastname }) {
    return (
    <TableRow key={id}>
        <TableCell align="left">{firstname} {lastname}</TableCell>
        <TableCell align="right">{share}/64</TableCell>
    </TableRow>
    );
}

function OwnersTable(classes, current_owners) {
  const member = useQuery(gql(`query member {
    member(member: ${current_owners[0].member}, id: ${current_owners[0].id}) {
      firstname
      lastname
      member
      id
    }
  }`)); 
  if (member.loading) return <CircularProgress />;
  console.log('current_owners', JSON.stringify(current_owners));
  console.log('member', JSON.stringify(member));
  const owners = current_owners.map((owner) => {
    let firstname = '';
    let lastname = '';
    member.data.forEach((m) => {
      if (m.id === owner.id) {
        firstname = m.firstname;
        lastname = m.lastname;
      }
    });
    return {
      ...owner,
      firstname, lastname,
    }
  });
  console.log('owner', owners, 'member', member.data);
  return (
    <Table className={classes.table} size="small" aria-label="owners">
    <TableHead>
        <TableRow>
        <TableCell align="left">Name</TableCell>
        <TableCell align="right">Share</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {owners.map((owner) => (<Owner owner={owner}/>))}
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
    return (
      <TableContainer component={Paper}>
        <OwnersTable classes={classes} owners={owner.data.boat[0].current_owners}/>
      </TableContainer>
    );
}
