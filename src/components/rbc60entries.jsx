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
import { FleetDisplay } from './fleetview';
import { getScopedData } from './boatregisterposts';
import LoginButton from './loginbutton';
import EntryTable from './rbc60entrytable';
import FleetIcon from "./fleeticon";
import RoleRestricted from './rolerestrictedcomponent';
import { Tooltip } from '@mui/material';

export default function RBC60Entryies() {
    const name = 'RBC 60';
    const accessToken = useContext(TokenContext);
    const { user, isAuthenticated } = useAuth0();
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

    if (!data) {
        return <CircularProgress />;
    }

    const entries = (data?.Items) || [];

    const rbc = entries.filter((e) => e.data.rbc);

    const filters = { oga_nos: rbc.map((e) => e.data.boat?.oga_no || '') };

    return (
        <Grid container>
            {isAuthenticated ? '' : <LoginButton />}
            <Grid item xs={12}>
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
                </RoleRestricted>
            </Grid>
            <Grid item xs={12}>
                <FleetDisplay name={name} filters={filters} />
            </Grid>
        </Grid>
    );
}
