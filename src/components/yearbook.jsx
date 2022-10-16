import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { gql, useQuery } from '@apollo/client';
import { useCardQuery } from '../util/ogsnosforfilter';
import { DEFAULT_BROWSE_STATE } from "../util/statemanagement";
import axios from 'axios';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

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
  const [got, setGot] = useState(0);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState(0);
  const [ogaNos, setOgaNos] = useState();
  const [ownedBoats, setOwnedBoats] = useState([]);
  const membersResult = useQuery(gql`query members { members { salutation firstname lastname member id GDPR smallboats status telephone mobile area town } }`);
  const as = useCardQuery({ ...DEFAULT_BROWSE_STATE.app, bpp:10000 });

  useEffect(() => {
    (async () => {
      if (ogaNos && ogaNos.length > got) {
        // console.log('got', got, 'total', ogaNos.length, 'owned', ownedBoats.length);
        //const boats = 
        await ogaNos.slice(got, got+100).map(async (oga_no) => {
          const r = await axios(
            `https://ogauk.github.io/boatregister/page-data/boat/${oga_no}/page-data.json`
          );
          const { boat } = r.data.result.pageContext;
          return boat;
        });
        // const nob = boats.filter((boat) => boat.ownerships?.owners?.find((o) => o.current));
        // console.log('got', nob.length, 'owned boats');
        // const o = ownedBoats.concat(nob);
        // console.log('got', boats.length, 'owned boats', 'total now', o.length);
        // setOwnedBoats(o);
        setGot(got+100);
        setProgress(100%got/ogaNos.length);
      }
    })();
  }, [ogaNos, got, ownedBoats]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (as.error) return <p>Error: (BoatCards)</p>;
  
  if (as.loading) {
      return <p>Loading...</p>;
  }

  if (membersResult.loading) {
      return <CircularProgress />;
  }

  if (membersResult.error) {
      return (<div>{JSON.stringify(membersResult.error)}</div>);
  }

  const { members } = membersResult.data;
  const { boats, totalCount } = as.data;

  if (!ogaNos) {
    setOgaNos(boats.map((boat) => boat.oga_no));
  }

  if (totalCount !== boats.length) {
    console.log('something went wrong or we have more than 10,000 boats')
  }
  
  if (!ownedBoats) {
    return <CircularProgress />;
  }

  console.log(`${ownedBoats.length} boats owned out of ${totalCount}`);

  return (
    <Box sx={{ width: '100%' }}>
      <CircularProgressWithLabel value={progress} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Members' Boats" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <YearbookMembers members={members} boats={ownedBoats} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <YearbookBoats members={members} boats={ownedBoats} />
      </TabPanel>
    </Box>
  );
}
