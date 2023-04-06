import React, { useContext, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FleetIcon from "./fleeticon";
import BoatCards from './boatcards';
import { TokenContext } from './TokenProvider';
import { getScopedData } from './boatregisterposts';
import RoleRestricted from './rolerestrictedcomponent';
import { getFilterable } from './boatregisterposts';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { CSVLink } from "react-csv";
import { gql, useQuery } from '@apollo/client';
import { getBoatData } from './boatregisterposts';
import { Button, Dialog } from '@mui/material';

// thumb			short_description			place_built			construction_details		hull_form	draft	beam	loa	lwl	spar_material	thcf			

async function getBoats(ogaNos) {
  const r = await Promise.allSettled(ogaNos.map((ogaNo) => getBoatData(ogaNo)));
  return r.map((b) => b.value.data.result.pageContext.boat);
}

const MEMBER_QUERY = gql(`query members($ids: [Int]!) {
  members(ids: $ids) {
    firstname
    lastname
    member
    id
    GDPR
  }
}`);

function id2name(id, members) {
  const m = members.find((m) => m.id === id);
  if (m) {
    return `${m.firstname} ${m.lastname}`;
  }
}

function ExportFleet({ name, boats }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const ids = boats.map((b) => b.owners).flat();
  const membersResult = useQuery(MEMBER_QUERY, { variables: { ids } });
  const members = membersResult?.data?.members?.filter((m) => m?.GDPR) || [];

  // eslint-disable-next-line no-unused-expressions
  useEffect(() => {
    if (open) {
      getBoats(boats?.map((b) => b?.oga_no))?.then((r) => setData(r))
    }
  }, [open, boats]);

  if (!data) {
    return <Button disabled={true}>Export</Button>
  }
  const mb = boats.map((b) => {
    const boat = { ...b, owners: b?.owners?.map((id) => id2name(id, members)) };
    const fb = data.find((boat) => boat.oga_no === b.oga_no);
    if (!fb) {
      console.log('missing full data for', b);
      return boat;
    }
    const handicap_data = fb.handicap_data || {};
    console.log(handicap_data);
    [
      'short_description', 'hull_form', 'place_built', 'construction_details', 'spar_material',
    ].forEach((key) => {
      if (fb[key]) {
        boat[key] = fb[key];
      }
    });
    [
      'beam',	'draft',	'length_over_all',	'length_on_waterline',	'thcf',
    ].forEach((key) => {
      if (handicap_data[key]) {
        boat[key] = handicap_data[key];
      }
    });
    return boat;
  });

  return <RoleRestricted role='member'>
    <Button onClick={() => setOpen(true)}>Export</Button>
    <Dialog
      open={open}
      aria-labelledby="dialog-update-member-details"
      maxWidth='md'
      fullWidth
    >
      <CSVLink filename={`${name}.csv`} data={mb}><FileDownloadIcon /></CSVLink>
    </Dialog>
  </RoleRestricted>;
}

export function FleetDisplay({ name, filters, tooltip = 'Click to expand' }) {
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

export default function FleetView({ filter, role = 'member' }) {
  if (role) {
    if (role === 'public') {
      return <PublicFleetView filter={filter} />;
    }
    return <RoleRestrictedFleetView filter={filter} role={role} />;
  } else {
    return <PublicFleetView filter={filter} />;
  }
}