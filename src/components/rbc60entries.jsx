import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TokenContext } from './TokenProvider';
import { PublicFleetView } from './fleetview';
import { getScopedData } from './boatregisterposts';
import EntryTable from './rbc60entrytable';
import FleetIcon from "./fleeticon";
import RoleRestricted from './rolerestrictedcomponent';
import RCBEntryMap from './rbc60map';

function RCBEntryTable() {
    const name = 'RBC 60';
    const accessToken = useContext(TokenContext);
    const { user } = useAuth0();
    const [data, setData] = useState();

    useEffect(() => {
        const getData = async () => {
            const p = await getScopedData('member', 'entries', { topic: name }, accessToken);
            setData(p.data);
        }
        if (accessToken) {
            getData();
        }
    }, [accessToken, user]);

    if (!accessToken) {
        return '';
    }
    if (!data) {
        return <CircularProgress />;
    }

    const entries = (data?.Items) || [];

    return (
        <RoleRestricted role='member' hide={false}>
            <Accordion>
                <AccordionSummary
                    expandIcon={
                        <Tooltip placement='left' title='click to show or hide the text'>
                            <ExpandMoreIcon />
                        </Tooltip>
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <FleetIcon /><Typography>Table of Entries</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <EntryTable rows={entries} />
                </AccordionDetails>
            </Accordion>
        </RoleRestricted>
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
                On this page everyone can see the list of boats
                going all the way round on the OGA 60 Round Britain Cruise.
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
                    <Tab label="Circumnavigators" {...a11yProps(0)} />
                    <Tab label="Map" {...a11yProps(1)} />
                    <Tab label="Entries" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <PublicFleetView filter={{ name: 'RBC 60' }} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RCBEntryMap />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <RCBEntryTable />
            </TabPanel>
        </>
    );
}
