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
import { ExportFleet } from './exportfleet';

export function FleetDisplay({ name, filters, tooltip = 'Click to expand', defaultExpanded=false }) {
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

  return (<Accordion defaultExpanded={defaultExpanded}>
    <AccordionSummary
      expandIcon={
        <Tooltip placement='left' title={tooltip}>
          <ExpandMoreIcon />
        </Tooltip>
      }
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <FleetIcon />
      <Typography>&nbsp;&nbsp;{name}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <BoatCards
        state={state} onChangePage={onPageChange} totalCount={filters.oga_nos.length}
        boats={sortAndPaginate(filtered, state)} otherNav={<ExportFleet name={name} boats={filtered} />}
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
        (data?.Items?.map(({ name, filters }) => <FleetDisplay name={name} filters={filters} />)) || ''
      }
    </RoleRestricted>
  );
}

export function RoleRestrictedFleetView({ filter, role, defaultExpanded=false }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);
  console.log('RoleRestrictedFleetView', filter, role, defaultExpanded);

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
      <FleetDisplay name={name} filters={filters} defaultExpanded={defaultExpanded}/>
    </RoleRestricted>
  );
}

export function PublicFleetView({ filter, defaultExpanded=false }) {
  const [data, setData] = useState();
  console.log('PublicFleetView', filter, defaultExpanded);

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
    return <FleetDisplay name={name} filters={filters} defaultExpanded={defaultExpanded} />;
  }
  return <Typography>No boats to show for fleet defined by {JSON.stringify(filter)}</Typography>;
}

export default function FleetView(props) {
  console.log(props);
  const { role } = props;
  const filter = props.filter || { name: props.topic };
  const defaultExpanded = Object.keys(props).includes('defaultexpanded');
  console.log('FleetView', filter, role, defaultExpanded);
  if (role) {
    if (role === 'public') {
      return <PublicFleetView filter={filter} defaultExpanded={defaultExpanded} />;
    }
    return <RoleRestrictedFleetView filter={filter} role={role} defaultExpanded={defaultExpanded} />;
  } else {
    return <PublicFleetView filter={filter}  defaultExpanded={defaultExpanded} />;
  }
}