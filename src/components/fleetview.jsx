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
import { getLargestImage, getScopedData } from './boatregisterposts';
import RoleRestricted from './rolerestrictedcomponent';
import { getFilterable } from './boatregisterposts';
import { applyFilters, sortAndPaginate } from '../util/oganoutils';
import { CSVLink } from "react-csv";
import { gql, useQuery } from '@apollo/client';
import { getBoatData } from './boatregisterposts';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

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

function combineFieldsForExport(shortData, fullData, members) {
  return shortData.map((b) => {
    const fb = fullData.find((boat) => boat.oga_no === b.oga_no);
    const owners = (b.owners?.map((id) => id2name(id, members)) || []).join(',');
    return { ...b, owners, ...(fb || {}) };
  });
}

function selectFieldsForExport(data, fields, handicapFields) {
  return data.map((b) => {
    const boat = {};
    fields.forEach((key) => {
      if (b[key]) {
        boat[key] = b[key];
      }
    });
    const handicap_data = b.handicap_data || {};
    if (handicapFields === 'all') {
      Object.keys(handicap_data).forEach((key) => {
        const item = handicap_data[key];
        if (item) {
          if (typeof item === 'object') {
            Object.keys(item).forEach((k2) => {
              boat[`${key}.${k2}`] = item[k2];
            });
          } else {
            boat[key] = handicap_data[key];
          }
        }
      });
    } else {
      handicapFields.forEach((key) => {
        if (handicap_data[key]) {
          boat[key] = handicap_data[key];
        }
      });
    }
    return boat;
  });
}

function ExportFleetOptions({ name, boats }) {
  const [data, setData] = useState();
  const ids = boats.map((b) => b.owners).flat();
  const membersResult = useQuery(MEMBER_QUERY, { variables: { ids } });
  const members = membersResult?.data?.members?.filter((m) => m?.GDPR) || [];

  useEffect(() => {
    if (!data) {
      const oganos = boats?.map((b) => b?.oga_no);
      console.log('Q', oganos);
      getBoats(oganos).then(async (r) => {
        const images = await Promise.allSettled(r.map((b) => {
          if (b.image_key) {
            console.log('has image', b.image_key);
            return getLargestImage(b.image_key);
          } else {
            console.log('no image', b);
            return undefined;
          }
        }));
        console.log(images);
        r.forEach((b, i) => {
          if (images[i].value) {
            b.image = images[i].value.data.url;
            b.copyright = images[i].value.data.caption;
          }
        });
        setData(r);
      });
    }
  }, [data, boats]);



  if (!data) {
    return <CircularProgress />
  }

  const fullData = combineFieldsForExport(boats, data, members);

  const leaflet = selectFieldsForExport(fullData, [
    'name', 'oga_no', 'place_built', 'owners',
    'construction_material', 'construction_method',
    'builder', 'designer', 'design_class',
    'mainsail_type', 'rig_type',
    'short_description', 'hull_form', 'place_built',
    'construction_details', 'spar_material',
    'image', 'copyright',
  ],
    [
      'beam', 'draft', 'length_on_deck', 'length_over_all', 'length_on_waterline', 'thcf',
    ]
  );

  const race = selectFieldsForExport(fullData, [
    'name', 'oga_no', 'owners',
    'short_description', 'hull_form',
  ],
    'all'
  );
  return <Stack alignContent='end' spacing='1em'>
    <CSVLink filename={`${name}.csv`} data={leaflet}>Spreadsheet (csv) for boats attending leaflet</CSVLink>
    <CSVLink filename={`${name}.csv`} data={race}>Spreadsheet for Race Officers</CSVLink>
    N.B. all dimensions in metres
  </Stack>;
}

function ExportFleet({ name, boats }) {
  const [open, setOpen] = useState(false);
  return <RoleRestricted role='member'>
    <Button onClick={() => setOpen(true)}>Export</Button>
    <Dialog
      open={open}
      aria-labelledby="dialog-update-member-details"
      maxWidth='md'
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Export Fleet {name}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          <ExportFleetOptions name={name} boats={boats} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
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