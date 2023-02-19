import React, { useContext, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';
import RoleRestricted from './rolerestrictedcomponent';
import { getFilterable } from './boatregisterposts';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';

export function FleetDisplay({ name, filters }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r.data)).catch((e) => console.log(e));
    }
  }, [data]);

  if (!data) return <CircularProgress />;
  const filtered = applyFilters(data, filters);

  const onPageChange = (n) => setPage(n.page);

  const state = { filters, bpp: 12, page, sort: 'name', sortDirection: 'asc', view: 'app', };

  return (<Accordion>
    <AccordionSummary
      expandIcon={
        <Tooltip placement='left' title='Click to see the boats signed up to go all the way round'>
          <ExpandMoreIcon />
        </Tooltip>
      }
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <FleetIcon /><Typography>&nbsp;&nbsp;{name}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <BoatCards
        state={state} onChangePage={onPageChange} totalCount={filters.oga_nos.length}
        boats={sortAndPaginate(filtered, state)}
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
  // console.log('PFV', data);
  return (
    <RoleRestricted role='member'>
      {
        (data?.Items?.map(({ name, filters }) => <FleetDisplay name={name} filters={filters} />))||''
      }
    </RoleRestricted>
  );
}

export function RoleRestrictedFleetView({ filter, role }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const getData = async () => {
      const p = await getScopedData(role, 'fleets', filter, accessToken);
      setData(p.data);
    }
    if (accessToken) {
      getData();
    }
  }, [accessToken, filter, role])

  if (!data) {
    return <CircularProgress />;
  }

  const { filters, name } = data.Items[0];

  return (
    <RoleRestricted role={role}>
      <FleetDisplay name={name} filters={filters} />
    </RoleRestricted>
  );
}

export function PublicFleetView({ filter }) {
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const p = await getScopedData('public', 'fleets', filter);
      setData(p.data);
    }
    getData();
  }, [filter])

  if (!data) {
    return <CircularProgress />;
  }

  if (data.Items.length > 0) {
    const { filters, name } = data.Items?.[0];
    return <FleetDisplay name={name} filters={filters} />;  
  }
  return <Typography>No boats to show for fleet defined by {JSON.stringify(filter)}</Typography>;
}

export default function FleetView({ filter, role='member' }) {
  if (role) {
    if (role === 'public') {
      return <PublicFleetView filter={filter}/>;
    }
    return <RoleRestrictedFleetView filter={filter} role={role} />;
  } else {
    return <PublicFleetView filter={filter}/>;
  }
}