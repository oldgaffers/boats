import React from 'react';
import { useAsync } from 'react-async-hook';
import { useAuth0 } from "@auth0/auth0-react";
import Typography from '@mui/material/Typography';
import { gql } from '@apollo/client';
import BoatDetail from './boatdetail';
import BoatSummary from './boatsummary';
import BoatButtons from './boatbuttons';
import SmugMugGallery from './smugmuggallery';
import { Grid, Stack } from '@mui/material';

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
    <Stack>
      <Typography variant="h3" component="h3">{boat.name} ({boat.oga_no})</Typography>
      <Grid container>
        <Grid size={8}>
          <SmugMugGallery albumKey={boat.image_key} ogaNo={boat.oga_no} name={boat.name} />
        </Grid>
        <Grid size={4}>
          <BoatSummary boat={boat} location={location} lastModified={lastModified} />
        </Grid>
      </Grid>
      <BoatDetail view={view} boat={{ ...boat, ownerships }} user={user} />
      <BoatButtons boat={{ ...boat, ownerships }} location={location} user={user} />
    </Stack>
  );
};
