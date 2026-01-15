 
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useAuth0 } from '@auth0/auth0-react';
import { getScopedData } from '../util/api';
import { m2f, price, m2f2, newestForSaleRecord } from '../util/format';
import DetailBar from './detailbar';
import TabPanel from './tabpanel';
import ConditionalText from './conditionaltext';
import Owners from './owners';
import Skippers from './skippers';
import Voyage from './voyage';
import SailTable from './sailtable';
import { HandicapDisplay } from './Handicap';
import { TextPane } from './boatpane';

const registration_fields = ['sail_number', 'ssr', 'nhsr', 'fishing_number', 'mmsi', 'callsign', 'nsbr', 'uk_part1'];

function is_oga(boat) {
  return (boat.ownerships || []).some((o) => {
    return o.current && o.id;
  });
}

export default function BoatDetail({ view, boat }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [value, setValue] = useState(0);
  const [voyages, setVoyages] = useState();
  const roles = user?.['https://oga.org.uk/roles'] || [];
  const hd = boat.handicap_data || {};

  useEffect(() => {
    const getData = async () => {
      // TODO filter by boat in the query
      const d = await getScopedData('public', 'voyage');
      const p = d?.Items ?? [];
      if ((user?.['https://oga.org.uk/roles'] || []).includes('member')) {
        const token = await getAccessTokenSilently();
        const q = await getScopedData('member', 'voyage', undefined, token);
        if (q?.Items) {
          p.push(...q.Items);
        }
      }
      setVoyages(p.filter((v) => v.boat.oga_no === boat.oga_no));
    }
    getData();
  }, [user, getAccessTokenSilently, boat.oga_no]);

  const pane_data = [
    { title: 'Design & Build', fields: ['generic_type', 'design_class', 'designer', 'hull_form', 'builder', 'place_built', 'year_of_build', 'construction_material', 'construction_method', 'spar_material', 'construction_details'] },
    { title: 'Dimensions', fields: [
      { field: 'length_on_deck', df: m2f, abbr: 'LOD' },
      { field: 'length_on_waterline', df: m2f, abbr: 'LWL' },
      { field: 'beam', df: m2f },
      { field: 'draft', df: m2f },
      { field: 'displacement', df: m2f },
      { field: 'solent', df: m2f },
    ] },
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
  if (roles.includes('member') && boat.ownerships?.length > 0 ) {
    panes.push({
      title: `Owners${is_oga(boat) ? '*' : ''}`, children: (
        <Owners boat={boat} />
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

  if (view === 'sail' && voyages?.length > 0) {

    const sortedVoyages = [...voyages];
    sortedVoyages.sort((a, b) => a.start.localeCompare(b.start));

    let introText = 'These are the voyages the owners have made public.';

    if (user) {
      if (roles.includes('member')) {
        introText = 'The owners have told us about the following voyages.';
      } else {
        introText = `${introText} Members get to see any additional voyages restricted to members only.`;
      }
    } else {
      introText = `${introText} Logged in members get to see any additional voyages restricted to members only.`;
    }

    panes.unshift({
      title: 'Voyages', children: <Stack>
        <Box verflow='auto' minWidth='50vw' maxWidth='85vw'>
          <Typography>{introText}</Typography>
          <Grid container spacing={2}>
            {sortedVoyages.map((voyage, index) =>
              <Grid key={index} xs={4} minWidth={300}>
                <Voyage key={`v${index}`} voyage={voyage} />
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>
    });
  }

  if (boat.selling_status === 'for_sale') {
    const fs = newestForSaleRecord(boat);

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
          <Typography>To assist with keeping the boat register up to date and accurate members have been asked
to remeasure their boats hull and sail plan. Many boats have been re rigged over the years
and it is correct to update the national OGA boat register data base with accurate figures.
Standard production boats with the builders / designers sail plan should not need to
remeasure as their measurements will be readily available. If however, you have a more
modern gaffer with a custom sail plan then we need to know the new sail details.
</Typography>
<Typography>Please complete the form by clicking on the 'I have edits for this boat' button below.</Typography>
<Typography>You can also email your data to the boat register editors.</Typography>
          <Stack direction='row'>
            <img width='80%' src='https://oldgaffers.github.io/boatregister/handicapmeasurements.svg' alt='boat measurement diagram' />
            <Stack width='20%'>
              <Typography variant='h6'>Sail Dimensions</Typography>
              <Typography>Mainsail, mizzen and main and mizzen
topsails, and schooners’ foresails and
fore-topsails, are measured as the
actual sail dimensions, not the spar
lengths. Headsails - it is the size of the
foretriangle that is measured.</Typography>
              <Typography variant='h6'>Foretriangle</Typography>
              <Typography>I is measured from deck to the top of
the highest headsail halyard sheave
(for jib topsail if one can be flown). J is
measured from the foreside of the mast to the eye of the fitting which sets the tack of the furthest forward headsail, or to the sheave of
the jib outhaul at the end of the bowsprit.</Typography>
<Typography variant='h6'>Hull</Typography>
<Typography>
  LOA is hull length excluding spars and rudder, LWL excludes the rudder and Beam is the widest part of the hull (outside
measurement) excluding rubbing strakes and other appendages.</Typography>
            </Stack>
          </Stack>
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