import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { useAuth0 } from "@auth0/auth0-react";
import { TokenContext } from './TokenProvider';
import axios from 'axios';

export default function SimpleFleetView({filters}) {
  const onBoatMarked = () => console.log('marked');
  const onBoatUnMarked = () => console.log('unmarked');
  const onPageChange = () => console.log('pageChange');
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);
  const scope = 'member';
  const table = 'fleets';

  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const getData = async () => {
        const p = await axios({
          url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${table}`,
          params: {
            ...filters,
          },
          headers: {
              Authorization: `Bearer ${accessToken}`,
          }
        });
        console.log('axios', p.data);
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
  const fleets = data.Items; 

  return (
    <div>
      {fleets.map((fleet) => {
        const state = { filters: fleet.filters, bpp: 12, page: 1, sort: 'name', sortDirection: 'asc', view: 'app', };
        return (<Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <FleetIcon/><Typography>&nbsp;&nbsp;{fleet.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BoatCards
            state={state} markList={state.filters.oga_nos} onChangePage={onPageChange}
            onBoatMarked={onBoatMarked} onBoatUnMarked={onBoatUnMarked}
          />
        </AccordionDetails>
      </Accordion>);
      }
    )}
    </div>
  );
}
