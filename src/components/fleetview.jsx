import React, { useContext, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { useAuth0 } from "@auth0/auth0-react";
import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';

export default function FleetView({ filters }) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState();
    const accessToken = useContext(TokenContext);
  
    const onBoatMarked = () => console.log('marked');
    const onBoatUnMarked = () => console.log('unmarked');
    const onPageChange = (n) => setPage(n.page);

    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
      const getData = async () => {
        const p = getScopedData('member', 'fleets', filters, accessToken);
        setData(p.data);
      }
      if (accessToken && isAuthenticated) {
        getData();
      }
    }, [accessToken, user, isAuthenticated, filters])
  
    if (!isAuthenticated) {
      return (<div>Please log in to view this page</div>);
    }
  
    if (!data) {
        return <CircularProgress/>;
    }

    const fleet = data.Items[0]; 
  
    const state = { filters: fleet.filters, bpp: 12, page, sort: 'name', sortDirection: 'asc', view: 'app', };

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <FleetIcon /><Typography>&nbsp;&nbsp;{fleet.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <BoatCards
                state={state} markList={state.filters.oga_nos} onChangePage={onPageChange}
                onBoatMarked={onBoatMarked} onBoatUnMarked={onBoatUnMarked}
            />
        </AccordionDetails>
    </Accordion>);
}