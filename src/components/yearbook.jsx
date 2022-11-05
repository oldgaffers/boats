import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { gql, useQuery } from '@apollo/client';
import { useCardQuery } from '../util/oganoutils';
import { DEFAULT_BROWSE_STATE } from "../util/statemanagement";
import { useAuth0 } from "@auth0/auth0-react";

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

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR smallboats status telephone mobile area town } }`);
  const as = useCardQuery({ ...DEFAULT_BROWSE_STATE.app, bpp:10000 });
  const { isAuthenticated } = useAuth0();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  if (as.error) return <p>Error: (BoatCards)</p>;
  
  if (as.loading) {
      return <CircularProgress />;
  }

  if (membersResult.loading) {
      return <CircularProgress />;
  }

  if (membersResult.error) {
      return (<div>{JSON.stringify(membersResult.error)}</div>);
  }

  const { members } = membersResult.data;
  const { boats, totalCount } = as.data;

  if (totalCount !== boats.length) {
    console.log('something went wrong or we have more than 10,000 boats')
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Members' Boats" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <YearbookMembers members={members} boats={boats} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <YearbookBoats members={members} boats={boats} />
      </TabPanel>
    </Box>
  );
}
