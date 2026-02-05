import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Tab, Tabs } from '@mui/material';
import Typography from '@mui/material/Typography';
import { PublicFleetView } from './fleetview';
import { getScopedData } from '../util/api';
import EntryTable from './rbc60entrytable';
import RCBEntryMap from './rbc60map';

function RBCEntryTable() {
    const name = 'RBC 60';
    const { user, getAccessTokenSilently, logout } = useAuth0();
    const [data, setData] = useState();

    useEffect(() => {
        getAccessTokenSilently().then(async (accessToken) => {
            const p = await getScopedData('member', 'entries', { topic: name }, accessToken);
            setData(p.data);
        }).catch((e) => {
            console.error('Error getting access token:', e);
            const returnTo = window.location.origin + window.location.pathname;
            logout({ returnTo });
            alert('Please log in again');
        });
    }, [user]);

    if (!data) {
        return <CircularProgress />;
    }

    const entries = (data?.Items) || [];

    return (
        <EntryTable rows={entries} />
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
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
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function RBC60Entryies() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Typography>
                On this page everyone can see the boats
                going all the way round on the OGA 60 Round Britain Cruise and also the boats planning
                to visit each 'Party Port'
            </Typography>
            <Typography>
                Logged-in members can see a table of all the boats registered for RBC60 events
                and a map of the cruise.
            </Typography>
            <Typography>When the cruise starts,
                the positions of each boat will be updated by the skippers.
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="round britain features">
                    <Tab label="The Boats" {...a11yProps(0)} />
                    <Tab label="Map" {...a11yProps(1)} />
                    <Tab label="Entries" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <PublicFleetView filter={{ name: 'RBC 60' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Ramsgate' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Cowes' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Plymouth' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Neyland' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Dublin' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Oban' }} />
                <PublicFleetView filter={{ name: 'RBC 60 River Tay' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Blyth' }} />
                <PublicFleetView filter={{ name: 'RBC 60 Jubilee Party' }} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RCBEntryMap />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <RBCEntryTable />
            </TabPanel>
        </>
    );
}
