import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { getLargestImage, getBoatData, getScopedData } from '../util/api';
import RoleRestricted from './rolerestrictedcomponent';
import { CSVLink } from "react-csv";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { ownerMembershipNumbers, ownershipsWithNames } from '../util/ownernames';
import { TokenContext } from './TokenProvider';
 
async function getBoats(ogaNos, accessToken) {
  const r = await Promise.allSettled(ogaNos.map((ogaNo) => getBoatData(ogaNo)));
  const pages = r.filter((p) => p.status === 'fulfilled').map((p) => p.value?.result?.pageContext?.boat);
  const boats = pages.map((p) => p);
  const images = await Promise.allSettled(boats.map((b) => {
      if (b.image_key) {
          return getLargestImage(b.image_key);
      } else {
            // console.log('no image', b);
            return undefined;
      }
  }));
  const member = [...new Set(boats.map((b) => ownerMembershipNumbers(b)).flat())];
  const f = {
    fields: 'id,membership,firstname,lastname,GDPR',
    member,
  };
  const d = await getScopedData('member', 'members', f, accessToken);
  const names = d?.Items ?? [];
  return boats.map((b, i) => {
    const image = {};
    const img = images[i].value;
    if (img) {
        const { url, caption } = img;
        image.url = url;
        image.copyright = caption;
    }
    const ownerships = ownershipsWithNames(b, names);
    const owners =  ownerships.filter((o) => o.current);
    const historicOwners = ownerships.filter((o) => !o.current);
    return { ...b, owners, historicOwners, image };
  });
}

function fieldDisplayValue(item) {
  if (Number.isInteger(item)) {
    return item;
  }
  if ((typeof item) === 'number') {
    return item.toFixed(2);
  }
  if (item.name) {
    return item.name;
  }
  if (Array.isArray(item)) {
    return item.filter((it) => it).map((it) => it.name).join(', ');
  }
  if ((typeof item) === 'string') {
    return item.replaceAll('\n', '').replaceAll('"', '“');
  }
  return item;
}

function selectFieldsForExport(data, fields, handicapFields) {
  return data.map((b) => {
    const boat = {};
    fields.forEach((key) => {
      if (b[key]) {
        boat[key] = fieldDisplayValue(b[key]);
      }
    });
    const handicap_data = b.handicap_data || {};
    if (handicapFields === 'all') {
      Object.keys(handicap_data).forEach((key) => {
        const item = handicap_data[key];
        if (item) {
          if (typeof item === 'object') {
            Object.keys(item).forEach((k2) => {
              boat[`${key}.${k2}`] = fieldDisplayValue(item[k2]);
            });
          } else {
            boat[key] = fieldDisplayValue(handicap_data[key]);
          }
        }
      });
    } else {
      handicapFields.forEach((key) => {
        if (handicap_data[key]) {
          boat[key] = fieldDisplayValue(handicap_data[key]);
        }
      });
    }
    return boat;
  });
}

function km(k) {
  switch (k) {
    case 'copyright':
      return 'photo copyright';
    default:
      return k.replace('_', ' ');
  }
}

function vm(v) {
  return v || '';
}

function boatForLeaflet(boat) {
  const { name, oga_no, owners, short_description = '', image, ...text } = boat;
  return `
  <div class="container">
    <div class="header">${name.toUpperCase()} (${oga_no})<div>
    <div class="sidebar">
      <div>${owners ? `Owned by: ${owners}`:''}</div>
      ${Object.keys(text).filter((k) => boat[k]).map((k) => `${km(k)}: ${vm(boat[k]?.name ? boat[k].name : boat[k])}`).join('<p>')}
    </div>
    <div class="photo">
      <img width="600" src="${image.url}" alt="No Image"/>
      <div>${image.copyright}</div>
    </div>
    <div class="footer">${short_description}</div>
  </div>`;
}

function ExportFleetOptions({ name, ogaNos }) {
  const [data, setData] = useState();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    if (!data) {
      getBoats(ogaNos, accessToken).then((r) => setData(r));
    }
  }, [data, ogaNos, accessToken]);

  if (!data) {
    return <CircularProgress />
  }

  const leaflet = selectFieldsForExport(data, [
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

  const race = selectFieldsForExport(data, [
    'name', 'oga_no', 'ownerships',
    'short_description', 'hull_form',
  ],
    'all'
  );

  const style = `<style>
    @media print {.page-break { break-after: page; }}
    .container {
      display: grid;
      width: 100%;
      height: 600px;
      grid-template-columns: 200px 1fr;
      grid-template-rows: 80px 1fr 100px;
      grid-gap: 1rem;
      grid-template-areas:
          "header header"
          "sidebar photo"
          "footer footer";
    }
    .header { grid-area: header; }
    .sidebar { grid-area: sidebar; }
    .photo { grid-area: photo; }
    .footer { grid-area: footer; }
  </style>`;
  const head = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${name}</title>${style}</head>`;
  const boats = leaflet.map((boat) => boatForLeaflet(boat));
  const html = `${head}<body>${boats}</body></html>`;
  const doc = new Blob([html], { type: 'text/html' });
  const uRL = window.URL.createObjectURL(doc);

  return <Stack alignContent='end' spacing='1em'>
    <CSVLink filename={`${name}.csv`} data={leaflet}>Spreadsheet (csv) for boats attending leaflet</CSVLink>
    <a
      target='_self'
      download={`${name}.html`}
      href={uRL}
    >Download HTML for boats attending leaflet</a>
        <a
      target="_blank" rel="noreferrer"
      href={uRL}
    >HTML for boats attending leaflet, opens in new tab for printing</a>
    <CSVLink filename={`${name}.csv`} data={race}>Spreadsheet for Race Officers</CSVLink>
    N.B. all dimensions in metres
  </Stack>;
}

export function ExportFleet({ name, boats, filters }) {
  const [open, setOpen] = useState(false);
  const ogaNos = filters?.oga_nos || boats?.map((b) => b?.oga_no) || [];

  if (ogaNos.length === 0) {
    return '';
  }
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
          <ExportFleetOptions name={name} ogaNos={ogaNos} />
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
