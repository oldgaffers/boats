import React from 'react';
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';

const query = gql`query MyQuery {
  boat_pending_updates_aggregate {
    aggregate {
      count
    }
  }
}`;

export default function ProcessUpdatesButton() {
  const { user, isAuthenticated } = useAuth0();
  let roles = [];
  if (isAuthenticated) {
      roles = user['https://oga.org.uk/roles'] || [];
  }
  // if(document.referrer.includes('localhost')) { roles.push('editor')}
  const [getPending, pd] = useLazyQuery( query ); 
  if(!roles.includes('editor')) {
    return 'this page is just for editors';
  }
  if (!pd.called) {
    getPending();
    return <CircularProgress />;
  }
  if (pd.loading) {
    return <CircularProgress />;
  }
  const count = pd.data?.boat_pending_updates_aggregate.aggregate.count || 0;
  return (
    <Badge badgeContent={count>0 ? count : undefined} color="secondary">
      <Button
        size="small"
        variant="contained"
        color='primary'
        href="/boat_register/pending/"
      >Process Updates</Button>
    </Badge>
  );
}