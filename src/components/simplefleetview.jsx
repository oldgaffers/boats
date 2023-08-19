import React, { useEffect, useContext } from 'react';
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
import { useLazyAxios } from 'use-axios-client';

function FleetView({fleet}) {
  const onBoatMarked = () => // console.log('marked');
  const onBoatUnMarked = () => // console.log('unmarked');
  const onPageChange = () => // console.log('pageChange');

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

export default function SimpleFleetView({filters}) {
  const accessToken = useContext(TokenContext);
  const scope = 'member';
  const table = 'fleets';
  const { isAuthenticated } = useAuth0();
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/${scope}/${table}`,
    params: {
      ...filters,
    },
    headers: {
        Authorization: `Bearer ${accessToken}`,
    }
  });

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      getData();
    }
  }, [accessToken, getData, isAuthenticated, filters])

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  if (loading) return <CircularProgress />

  if (error) {
      // console.log(error);
      return (<div>
          Sorry, we had a problem getting the data
      </div>);
  }

  if (!data) {
      return <CircularProgress />;
  }
  const fleets = data.Items; 

  return (
    <div>
      {fleets.map(({name}) => {
        return (<FleetView filter={name} />);
      }
    )}
    </div>
  );
}
