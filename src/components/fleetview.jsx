import React, { useState, useEffect } from 'react';
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
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(async (token) => {
        if (filter.owned) {
          // eslint-disable-next-line no-unused-vars
          const { owned, ...f } = filter;
          const owner_gold_id = user?.["https://oga.org.uk/id"];
          const p = await getFleets('member', { ...f, owner_gold_id }, token);
          setData(p);
        } else {
          const p = await getFleets('member', filter, token);
          setData(p);
        }
      }).catch((e) => {
        console.error('Error getting access token:', e);
        const returnTo = window.location.origin + window.location.pathname;
        logout({ returnTo });
        alert('Please log in again');
      });
    }
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
  const { getAccessTokenSilently, logout } = useAuth0();
  console.log('RoleRestrictedFleetView', filter, role, defaultExpanded);

  useEffect(() => {
    getAccessTokenSilently().then(async (accessToken) => {
      const p = await getFleets(role, filter, accessToken);
      setData(p);
    }
    ).catch((e) => {
      console.error('Error getting access token:', e);
      const returnTo = window.location.origin + window.location.pathname;
      logout({ returnTo });
      alert('Please log in again');
    });
  }, [filter, role])

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

function convertArgs(args) {
  const defaultExpanded = args.includes('open');
  const view = args.includes('gallery') ? 'gallery' : 'cards';
  const role = args.includes('member') ? 'member' : 'public';
  return { role, defaultExpanded, view };
}

function parseprops(props) {
  const searchParams = new URLSearchParams(props?.location?.search);
  const name = props.topic || props.fleet || searchParams.get('name');
  const filter = props.filter || { name };
  const r = { filter };
  const args = props.args || Object.keys(props).filter((k) => k.startsWith('ogaArg')).map((k) => props[k]);
  if (args?.length) {
    Object.assign(r, convertArgs(args));
    const name = args.find((a) => !['public', 'private', 'closed', 'open', 'gallery', 'cards'].includes(a));
    if (name) r.filter = { name };
  }
  return r;
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