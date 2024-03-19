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

export const MEMBER_QUERY = gql(`query members($members: [Int]!) {
  members(members: $members) {
    firstname
    lastname
    member
    id
    GDPR
    skipper { text }
  }
}`);

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

const addNames = async (client, owners) => {
  const rawMemberNumbers = owners?.filter((o) => queryIf(o)).map((o) => o.member) || [];
  if (rawMemberNumbers.length === 0) {
    return owners;
  }
  const memberNumbers = [...new Set(rawMemberNumbers)]; // e.g. husband and wife owners
  const r = await client.query({ query: MEMBER_QUERY, variables: { members: memberNumbers } });
  const members = r.data.members;
  return owners.map((owner) => {
    const r = { ...owner };
    const m = members.filter((member) => member.id === owner.id);
    if (m.length > 0) {
      const { skipper, GDPR, firstname, lastname } = m[0];
      if (GDPR) {
        r.name = `${firstname} ${lastname}`;
      }
      if (skipper) {
        r.skipper = skipper;
      }
    }
    return r;
  });
};

export default function BoatWrapper({ client, boat, location, lastModified }) {
  const { error, result } = useAsync(addNames, [client, boat.ownerships]);
  const { user } = useAuth0();
  const view = sessionStorage.getItem('BOAT_CURRENT_VIEW');

  // we don't bother with loading and let the owners fill in if they come

  if (error) {
    // console.log(`Error! ${error}`);
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
        <BoatSummary boat={boat} location={location} lastModified={lastModified} />
      </Grid>
      <Grid item xs={12}>
          <BoatDetail view={view} boat={{...boat, ownerships }} user={user}/>
      </Grid>
    </Grid>
    <BoatButtons  boat={{ ...boat, ownerships }} location={location} user={user} />
    </Container>
    </Paper>
  );
};
