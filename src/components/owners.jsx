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

const getnames = (members, id) => {
  if (!members) return undefined;
  const m = members.filter((member) => member.id === id);
  if (m.length>0) {
    return m[0];
  }
  return undefined;
}

export default function Owners({ classes, boat }) {
  const { current_owners } = boat;
  const member = current_owners ? current_owners[0].member : 0;
  const members = useQuery(gql(`query member {
        member(member: ${member}) {
          member
          id
          firstname
          lastname
        }
    }`)); 
    if (members.loading) return <CircularProgress />;
    console.log('owner', current_owners, 'member', members.data);
    const owners = current_owners.map((owner) => {
      return {
        ...owner,
        ...getnames(members, owner.id),
      }
    })
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
            {owners.map(({ id, firstname, lastname, share }) => (
              <TableRow key={id}>
                <TableCell align="left">{firstname} {lastname}</TableCell>
                <TableCell align="right">{share}/64</TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}
