import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { useAuth0 } from '@auth0/auth0-react';
import { kg, m2f, price, m2f2 } from '../util/format';
import DetailBar from './detailbar';
import TabPanel from './tabpanel';
import ConditionalText from './conditionaltext';
import Owners from './owners';
import Skippers from './skippers';
import SailTable from './sailtable';
import { HandicapDisplay } from './Handicap';
import { TextPane } from './boatpane';
import { VoyagePane } from './voyage';
import HandicapForm from './handicapform';
import { currentSaleRecord } from '../util/sale_record';

const registration_fields = ['sail_number', 'ssr', 'nhsr', 'fishing_number', 'mmsi', 'callsign', 'nsbr', 'uk_part1'];

function is_oga(boat) {
  return (boat.ownerships || []).some((o) => {
    return o.current && o.id;
  });
}

export default function BoatDetail({ view, boat }) {
  const { user } = useAuth0();
  const [value, setValue] = useState(0);
  const roles = user?.['https://oga.org.uk/roles'] || [];
  const hd = boat.handicap_data || {};

  const pane_data = [
    { title: 'Design & Build', fields: ['generic_type', 'design_class', 'designer', 'hull_form', 'builder', 'place_built', 'year_of_build', 'construction_material', 'construction_method', 'spar_material', 'construction_details'] },
    {
      title: 'Dimensions', fields: [
        { field: 'length_on_deck', df: m2f, abbr: 'LOD' },
        { field: 'length_on_waterline', df: m2f, abbr: 'LWL' },
        { field: 'beam', df: m2f },
        { field: 'draft', df: m2f },
        { field: 'displacement', df: kg },
      ]
    },
  ];


  boat.year_of_build = { approx: boat.year_is_approximate, value: boat.year };

  const panes = [
    {
      title: pane_data[0].title, children: <TextPane data={boat} fields={pane_data[0].fields} />
    },
    {
      title: pane_data[1].title, children: <TextPane data={hd} fields={pane_data[1].fields} />
    },
  ];
  const registration_fields_for_boat = Object.keys(boat).filter(value => registration_fields.includes(value));
  if (registration_fields_for_boat.length > 0) {
    panes.unshift(
      {
        title: 'Registrations', children: (
          <Paper>
            <ConditionalText value={boat.sail_number} label="Sail No." />
            <ConditionalText value={boat.ssr} label="Small Ships Registry no. (SSR)" />
            <ConditionalText value={boat.nhsr} label="National Register of Historic Vessels no. (NRHV)" />
            <ConditionalText value={boat.fishing_number} label="Fishing No." />
            <ConditionalText value={boat.mmsi} label="MMSI" />
            <ConditionalText value={boat.callsign} label="Call Sign" />
            <ConditionalText value={boat.nsbr} label="National Small Boat Register" />
            <ConditionalText value={boat.uk_part1} label="Official Registration" />
          </Paper>
        )
      });
  }
  if (hd.main || hd.fore_triangle_base || hd.sailarea) {
    panes.push({
      title: 'Rig and Sails', children: (
        <Paper>
          <ConditionalText label="Fore triangle base" value={m2f(hd.fore_triangle_base)} />
          <ConditionalText label="Fore triangle height" value={m2f(hd.fore_triangle_height)} />
          <ConditionalText label="Sail Area" value={m2f2(hd.sailarea)} />
          <HandicapDisplay boat={boat} />
          <SailTable handicapData={boat.handicap_data} />
        </Paper>
      )
    });
  }
  if (roles.includes('member') && boat.ownerships?.length > 0) {
    panes.push({
      title: `Owners${is_oga(boat) ? '*' : ''}`, children: (
        <Owners ownerships={boat.ownerships} />
      )
    });
    const skippers = (boat.ownerships).filter((o) => o.skipper);
    if (skippers.length > 0) {
      panes.push({
        title: 'About the Skippers', children: (
          <Skippers skippers={skippers} email={user.email} />
        )
      });
    }
  }

  /*
  const engine = {
      engine_make: { label: 'Engine make:' },
      engine_power: { label: 'Engine power:' },
      engine_date: { label: 'Engine date:' },
      engine_fuel: { label: 'Engine fuel:' },
      previous_engine: { label: 'Previous engine(s):' },
      propellor_blades: { label: 'Propeller blades:' },
      propellor_type: { label: 'Propeller type:' },
      propellor_position: { label: 'Propeller position:' }
  };
  
  */
  if (boat.full_description) {
    panes.unshift(
      { title: 'Details', children: (<Paper dangerouslySetInnerHTML={{ __html: boat.full_description }} />) },
    );
  }

  if (view === 'sail') {
    panes.unshift({ title: 'Voyages', children: <VoyagePane boat={boat} roles={roles} />  });
  }

  if (boat.selling_status === 'for_sale') {
    const fs = currentSaleRecord(boat);

    if (fs) {
      panes.unshift(
        {
          title: 'For Sale', children: (
            <Paper>
              <ConditionalText label="Price" value={price(fs.asking_price)} />
              <div dangerouslySetInnerHTML={{ __html: fs.sales_text }} />
            </Paper>
          )
        },
      );
    }
  }

  panes.push({
    title: 'Handicap Measurements', children: (
      <Paper>
        <HandicapForm boat={boat} />
      </Paper>
    )
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <DetailBar
        sx={{ height: "8rem" }}
        onChange={handleChange} value={value} panes={panes}
      />
      {panes.map((pane, i) => (
        <TabPanel key={i} value={value} index={i}>
          {pane.children}
        </TabPanel>
      ))}
    </>
  );
}