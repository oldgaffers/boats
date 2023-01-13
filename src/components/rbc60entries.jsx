import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { TokenContext } from './TokenProvider';
import FleetView from './fleetview';
import { getScopedData } from './boatregisterposts';
import LoginButton from './loginbutton';
import EntryTable from './rbc60entrytable';
import FleetIcon from "./fleeticon";
import RoleRestricted from './rolerestrictedcomponent';
import { Tooltip } from '@mui/material';

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
        <RoleRestricted role='member'>
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
        </RoleRestricted>);
}

export default function RBC60Entryies() {
    const { isAuthenticated } = useAuth0();

    return (
        <>
            <Typography>
                On this page everyone can see the list of boats
                going all the way round on the OGA 60 Round Britain Cruise.
                You can also see a map of the cruise and when the cruise starts,
                the positions of each boat will be updated by the skippers.
            </Typography>
            <Grid container>
                {isAuthenticated ? '' : <LoginButton />}
                <Grid item xs={12}>
                    <FleetView filter={{ name: 'RBC 60' }} role='public' />
                </Grid>
                <Typography>
                Logged-in members can also see a table of all the boats registered for RBC60 events.
            </Typography>
                <Grid item xs={12}>
                    <RCBEntryTable />
                </Grid>
            </Grid>
        </>
    );
}
