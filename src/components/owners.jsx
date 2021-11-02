import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export default function Owners({ classes, boat }) {
    const owner = useQuery(gql(`query boat {
        boat(where: {oga_no: {_eq: ${boat.oga_no}}}) {
          current_owners
        }
      }`));
    const member = 5004
    const members = useQuery(gql(`query members {
        members(member: ${member}) {
          firstname
          lastname
          id
        }
      }`));
    if (members.loading || owner.loading) return <CircularProgress />;
    console.log(members, owner);
    return (<Typography>you will see owners here as you are a member</Typography>);
}
