import React, { useContext, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';
import RoleRestricted from './rolerestrictedcomponent';

export function FleetDisplay({ name, filters }) {
  const [page, setPage] = useState(1);

  const onPageChange = (n) => setPage(n.page);

  const state = { filters, bpp: 12, page, sort: 'name', sortDirection: 'asc', view: 'app', };

  return (<Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <FleetIcon /><Typography>&nbsp;&nbsp;{name}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <BoatCards
        state={state} onChangePage={onPageChange}
      />
    </AccordionDetails>
  </Accordion>);
}

export function Fleets({ filter }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const getData = async () => {
      const p = await getScopedData('member', 'fleets', filter, accessToken);
      setData(p.data);
    }
    if (accessToken) {
      getData();
    }
  }, [accessToken, filter])

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <RoleRestricted role='member'>
      {
        data.Items.map(({name, filters}) => <FleetDisplay name={name} filters={filters} />)
      }
    </RoleRestricted>
  );
}

export default function FleetView({ filter }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const getData = async () => {
      const p = await getScopedData('member', 'fleets', filter, accessToken);
      setData(p.data);
    }
    if (accessToken) {
      getData();
    }
  }, [accessToken, filter])

  if (!data) {
    return <CircularProgress />;
  }

  const { filters, name } = data.Items[0];

  return (
    <RoleRestricted role='member'>
      <FleetDisplay name={name} filters={filters} />
    </RoleRestricted>
  );
}