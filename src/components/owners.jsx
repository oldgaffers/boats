import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Owners({ classes, boat }) {
    const owner = useQuery(gql(`query boat {
        boat(where: {oga_no: {_eq: ${boat.oga_no}}}) {
          current_owners
        }
      }`));
      /*
    const member = 5004
    const members = useQuery(gql(`query members {
        members(member: ${member}) {
          firstname
          lastname
          id
        }
      }`)); */
    if (owner.loading) return <CircularProgress />;
    console.log(members, owner);
    return (
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="owners">
        <TableHead>
            <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Share/leach</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {owner.data.boat[0].current_owners.map((row) => 
            (<TableRow key={row.id}>
                <TableCell align="right">{row.id}</TableCell>
                <TableCell align="right">{row.share}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
 
