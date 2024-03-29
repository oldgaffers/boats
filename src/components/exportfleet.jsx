import React, { useState, useEffect } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { getLargestImage } from '../util/api';
import RoleRestricted from './rolerestrictedcomponent';
import { CSVLink } from "react-csv";
import { ApolloConsumer, gql } from '@apollo/client';
import { getBoatData } from '../util/api';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

async function getBoats(ogaNos) {
  const r = await Promise.allSettled(ogaNos.map((ogaNo) => getBoatData(ogaNo)));
  const pages = r.filter((p) => p.status === 'fulfilled').map((p) => p.value?.result?.pageContext?.boat);
  return pages.map((p) => p);
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
  return k.replace('_', ' ');
}

function vm(v) {
  return v; // ?.replace('© ', '') || '';
}

function boatForLeaflet(boat) {
  const { name, oga_no, short_description, image, ...text } = boat;
  return `
  <table border="1">
  <tbody>
  <tr>
  <td style="width: 50%;">
  <div>${name.toUpperCase()} (${oga_no})<div>
  <div>${short_description}</div>
  ${Object.keys(text).filter((k) => boat[k]).map((k) => `${km(k)}: ${vm(boat[k]?.name ? boat[k].name : boat[k])}`).join('<p>')}
  </td>
  <td style="width: 50%;">
  <img width="600" src="${image}"/>
  </td>
  </tr>
  </tbody>
  </table>`;
}

function ExportFleetOptions({ client, name, ogaNos }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      // const oganos = boats?.map((b) => b?.oga_no);
      getBoats(ogaNos).then(async (r) => {
        const images = await Promise.allSettled(r.map((b) => {
          if (b.image_key) {
            return getLargestImage(b.image_key);
          } else {
            console.log('no image', b);
            return undefined;
          }
        }));
        r.forEach((b, i) => {
          if (images[i].value) {
            b.image = images[i].value.url;
            b.copyright = images[i].value.caption;
          }
        });
        const ids = [...new Set(
          r.map((b) => (b?.ownerships?.filter((o) => o.current)) || []).flat().map((o) => o?.id)
        )].filter((id) => id);
        const membersResult = await client.query({ query: MEMBER_QUERY, variables: { ids } });
        const members = membersResult?.data?.members?.filter((m) => m?.GDPR) || [];
        r.forEach((b) => {
          const o = b.ownerships?.filter((o) => o.current)?.map((o) => id2name(o.id, members)) || [];
          b.owners = o.join(', ');
        });
        setData(r);
      });
    }
  }, [data, ogaNos, client]);

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
    'name', 'oga_no', 'owners',
    'short_description', 'hull_form',
  ],
    'all'
  );

  const html = `<div>${leaflet.map((boat) => boatForLeaflet(boat))}</div>`;
  const doc = new Blob([html], { type: 'text/html' });
  const uRL = window.URL.createObjectURL(doc);

  return <Stack alignContent='end' spacing='1em'>
    <CSVLink filename={`${name}.csv`} data={leaflet}>Spreadsheet (csv) for boats attending leaflet</CSVLink>
    <a
      target='_self'
      download={`${name}.html`}
      href={uRL}
    >HTML  for boats attending leaflet</a>
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
          <ApolloConsumer>
            {client => <ExportFleetOptions client={client} name={name} ogaNos={ogaNos} />}
          </ApolloConsumer>
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
