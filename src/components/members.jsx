import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { applyFilters } from '../util/oganoutils';
import { getFilterable } from './boatregisterposts';
import { memberPredicate } from '../util/membership';
import YearbookMembers from './yearbook_members';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

export function membersBoats(boats, members) {
  return boats.filter((b) => b.owners?.length > 0).map((b) => {
    const owners = b.owners.map((o) => members.find((m) => m.id === o && o)).filter((o) => o);
    return { ...b, owners, id: b.oga_no };
  }).filter((b) => b.owners.length > 0);
}

export default function Members() {
  const [excludeNotPaid, setExcludeNotPaid] = useState(false);
  const [excludeNoConsent, setExcludeNoConsent] = useState(true);
  const [data, setData] = useState();
  const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR smallboats status telephone mobile area town } }`);
  const { user, isAuthenticated } = useAuth0();

  const roles = user?.['https://oga.org.uk/roles'] || [];
  
  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r.data)).catch((e) => console.log(e));
    }
  }, [data]);


  if (!data) return <CircularProgress />;

  const boats = applyFilters(data, {});

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  if (membersResult.loading) {
    return <CircularProgress />;
  }

  if (membersResult.error) {
    return (<div>{JSON.stringify(membersResult.error)}</div>);
  }

  const { members } = membersResult.data;
  const ybmembers = members.filter((m) => memberPredicate(m.id, m, excludeNotPaid, excludeNoConsent));

  const ybboats = membersBoats(boats, ybmembers);

  const handleNotPaidSwitchChange = (event, newValue) => {
    setExcludeNotPaid(newValue);
  }

  const handleNoConsentSwitchChange = (event, newValue) => {
    setExcludeNoConsent(newValue);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <FormGroup>
        {roles.includes['editor']?<FormControlLabel control={<Switch onChange={handleNotPaidSwitchChange} checked={excludeNotPaid} />} label="Exclude not paid" />:''}
          {roles.includes['editor']?<FormControlLabel control={<Switch onChange={handleNoConsentSwitchChange} checked={excludeNoConsent} />} label="Exclude no Consent" />:''}
        </FormGroup>
      </Box>
      <YearbookMembers members={ybmembers} boats={ybboats} />
    </Box>
  );
}
