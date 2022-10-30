import React, { useContext, useEffect } from 'react';
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth0 } from "@auth0/auth0-react";
import { useLazyAxios } from 'use-axios-client';
import { TokenContext } from './TokenProvider';

export default function ProcessUpdatesButton() {
  const { user, isAuthenticated } = useAuth0();
  const accessToken = useContext(TokenContext);
  const scope = 'public';
  const table = 'edit_boat';
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${table}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  useEffect(() => {
    if (accessToken) {
      getData();
    }
  }, [accessToken, getData])

  if (loading) return <CircularProgress />

  if (error) {
      console.log(error);
      return (<div>
          Sorry, we had a problem getting the data
      </div>);
  }

  let roles = [];
  if (isAuthenticated) {
      roles = user['https://oga.org.uk/roles'] || [];
  }
  if(!roles.includes('editor')) {
    return 'this page is just for editors';
  }
 
  const count = data?.Count || 0;
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