import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { applyFilters } from '../util/oganoutils';
import { getFilterable } from './boatregisterposts';
import { memberPredicate } from '../util/membership';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function membersBoats(boats, members) {
  return boats.filter((b) => b.owners?.length > 0).map((b) => {
    const owners = b.owners.map((o) => members.find((m) => m.id === o && o)).filter((o) => o);
    return { ...b, owners, id: b.oga_no };
  }).filter((b) => b.owners.length > 0);
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [excludeNotPaid, setExcludeNotPaid] = useState(true);
  const [excludeNoConsent, setExcludeNoConsent] = useState(true);
  const [data, setData] = useState();
  const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR smallboats status telephone mobile area town } }`);
  const { isAuthenticated } = useAuth0();

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <FormControlLabel control={<Switch onChange={handleNotPaidSwitchChange} checked={excludeNotPaid} />} label="Exclude not paid" />
          <FormControlLabel control={<Switch onChange={handleNoConsentSwitchChange} checked={excludeNoConsent} />} label="Exclude no Consent" />
        </FormGroup>
        <Tabs value={value} onChange={handleChange} aria-label="yearbook members and boats">
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Members' Boats" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <YearbookMembers members={ybmembers} boats={ybboats} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <YearbookBoats members={ybmembers} boats={ybboats} />
      </TabPanel>
    </Box>
  );
}
