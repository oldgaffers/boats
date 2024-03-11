import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import BoatGallery from './boatgallery';
import { TokenContext } from './TokenProvider';
import { getFleets, } from '../util/api';
import RoleRestricted from './rolerestrictedcomponent';
import { getFilterable } from '../util/api';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { ExportFleet } from './exportfleet';

export function FleetDisplay({ view, name, filters, tooltip = 'Click to expand', defaultExpanded = false }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r)).catch((e) => console.log(e));
    }
  }, [data]);

  if (!data) return <CircularProgress />;
  const filtered = applyFilters(data, filters);

  const onPageChange = (n) => setPage(n.page);

  const bpp = (view === 'gallery') ? 100 : 12;

  const state = { filters, bpp, page, sort: 'name', sortDirection: 'asc', view: 'app', };

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
      {(view === 'gallery')
        ?
          <BoatGallery boats={sortAndPaginate(filtered, state)} />
        :
          <BoatCards
            state={state} onChangePage={onPageChange} totalCount={filtered.length}
            boats={sortAndPaginate(filtered, state)} otherNav={<ExportFleet name={name} boats={filtered} />}
          />
      }
    </AccordionDetails>
  </Accordion>);
}

export function Fleets({ filter }) {
  const [data, setData] = useState();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getData = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        if (filter.owned) {
          const { owned, ...f } = filter;
          const owner_gold_id = user?.["https://oga.org.uk/id"];
          const p = await getFleets('member', {...f, owner_gold_id}, token);
          setData(p);
        } else {
          const p = await getFleets('member', filter, token);
          setData(p);
        }
      }
    };
    getData();
  }, [filter, isAuthenticated, getAccessTokenSilently, user]);

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <RoleRestricted role='member'>
      {
        (data.map(({ name, filters }) => <FleetDisplay key={name} name={name} filters={filters} />)) || ''
      }
    </RoleRestricted>
  );
}

export function RoleRestrictedFleetView({ view, filter, role, defaultExpanded = false }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);
  console.log('RoleRestrictedFleetView', filter, role, defaultExpanded);

  useEffect(() => {
    const getData = async () => {
      const p = await getFleets(role, filter, accessToken);
      setData(p);
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
      <FleetDisplay view={view} name={name} filters={filters} defaultExpanded={defaultExpanded} />
    </RoleRestricted>
  );
}

export function PublicFleetView({ view, filter, defaultExpanded = false }) {
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const p = await getFleets('public', filter);
      setData(p);
    }
    getData();
  }, [filter])

  if (!data) {
    return <CircularProgress />;
  }

  if (data.length > 0) {
    const { filters, name } = data[0];
    return <FleetDisplay view={view} name={name} filters={filters} defaultExpanded={defaultExpanded} />;
  }
  return <Typography>No boats to show for fleet defined by {JSON.stringify(filter)}</Typography>;
}

function parseprops(props) {
  if (props.args) {
    const name = props.args[0];
    const filter = props.filter || { name };
    const defaultExpanded = props.args.includes('open');
    const view = props.args.includes('gallery') ? 'gallery' : 'cards';
    return { role: 'public', filter, defaultExpanded, view };
  }
  const role = props.role || 'public';
  const searchParams = new URLSearchParams(props?.location?.search);
  const name = props.topic || props.fleet || searchParams.get('name');
  const filter = props.filter || { name };
  const defaultExpanded = Object.keys(props).includes('defaultexpanded');
  const view = props.view ?? 'cards';
  return { role, filter, defaultExpanded, view };
}

export default function FleetView(props) {
  const { role, filter, defaultExpanded, view } = parseprops(props);
  if (role) {
    if (role === 'public') {
      return <PublicFleetView filter={filter} defaultExpanded={defaultExpanded} view={view} />;
    }
    return <RoleRestrictedFleetView filter={filter} role={role} defaultExpanded={defaultExpanded} view={view} />;
  } else {
    return <PublicFleetView filter={filter} defaultExpanded={defaultExpanded} view={view} />;
  }
}