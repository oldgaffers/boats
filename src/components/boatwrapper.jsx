import React from 'react';
import { useAsync } from 'react-async-hook';
import { useAuth0 } from "@auth0/auth0-react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { gql } from '@apollo/client';
import BoatDetail from './boatdetail';
import BoatSummary from './boatsummary';
import BoatButtons from './boatbuttons';
import SmugMugGallery from './smugmuggallery';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
  members(members: $members) {
    firstname
    lastname
    member
    id
    GDPR
  }
}`);

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

const addNames = async (client, owners) => {
  const memberNumbers = owners?.filter((o) => queryIf(o)).map((o) => o.member) || [];
  if (memberNumbers.length === 0) {
    return owners;
  }
  const r = await client.query({ query: MEMBER_QUERY, variables: { members: memberNumbers } });
  const members = r.data.members;
  return owners.map((owner) => {
    if (owner.name) {
      return owner;
    }
    let name = '';
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      const { GDPR, firstname, lastname } = m[0];
      if (GDPR) {
        name = `${firstname} ${lastname}`;
      } else {
        name = 'owner on record but withheld'
      }
    }
    return {
      ...owner,
      name,
    }
  });
};

export default function BoatWrapper({ client, boat, location }) {
  const { error, result } = useAsync(addNames, [client, boat.ownerships]);
  const { user } = useAuth0();

  // we don't bother with loading and let the owners fill in if they come

  if (error) {
    console.log(`Error! ${error}`);
  }
  const ownerships = result || boat.ownerships || [];
  ownerships.sort((a, b) => a.start > b.start);

  return (
    <Paper sx={{paddingTop: '20px', paddingBottom: '20px'}}>
      <Container maxWidth="lg">
      <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
          <Typography variant="h3" component="h3">{boat.name}</Typography>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
          <Typography variant="h3" component="h3">{boat.year}</Typography>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper>
          <SmugMugGallery albumKey={boat.image_key} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <BoatSummary boat={boat} location={location} />
      </Grid>
      <Grid item xs={12}>
          <BoatDetail boat={{...boat, ownerships }} user={user}/>
      </Grid>
    </Grid>
    <BoatButtons  boat={{ ...boat, ownerships }} location={location} user={user} />
    </Container>
    </Paper>
  );
};
