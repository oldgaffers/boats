import * as React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from '@apollo/client';

export default function MyFleets() {
  const onBoatMarked = () => console.log('marked');
  const onBoatUnMarked = () => console.log('unmarked');
  const onPageChange = () => console.log('pageChange');
  const [getFleets, getFleetsResult] = useLazyQuery(gql`query fleet($id: Int!) {
    fleet(where: {owner_gold_id: {_eq: $id}}) { name filters }
  }`);

  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (<div>Please log in to view this page</div>);
  }

  console.log(user);

  if (!getFleetsResult.called) {
    getFleets({ variables: { id: user['https://oga.org.uk/id'] }});
    return <CircularProgress />;
  }

  if (getFleetsResult.loading) {
    return <CircularProgress />;
  }

  if (getFleetsResult.error) {
    console.log(getFleetsResult.error);
    return (<div>Sorry, something went wrong</div>);
  }

  console.log(getFleetsResult.data);

  const fleets = getFleetsResult.data.fleet;

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
