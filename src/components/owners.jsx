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
    const member = useQuery(gql(`query member {
        member(member: ${owner.member}, id: ${owner.id}) {
          firstname
          lastname
        }
      }`)); 
    if (member.loading) return <CircularProgress />;
    console.log('owner', owner, 'member', member.data);
    const { firstname, lastname } = member.data ? member.data.member : { firstname: '', lastname: '' };
    return (
    <TableRow key={owner.id}>
        <TableCell align="left">{firstname} {lastname}</TableCell>
        <TableCell align="right">{owner.share}/64</TableCell>
    </TableRow>
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
        <Table className={classes.table} size="small" aria-label="owners">
        <TableHead>
            <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Share</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {owner.data.boat[0].current_owners.map((row) => (<Owner owner={row}/>))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}
