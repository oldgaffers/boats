/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import TabPanel from './tabpanel';
import ConditionalText from './conditionaltext';
import SailTable from './sailtable';
import { m2df, price } from '../util/format';
import DetailBar from './detailbar';

function m2f(val) { return `${m2df(val)} ft`};

function hullForm(boat) {
  if (boat.hull_form === null) {
    return null;
  }
  return boat.hull_form.replace(/_/g, ' ');
}

export default function Boat({ classes, boat }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  // TODO const { ref } = useInView({ threshold: 0 });
  
  const panes = [
    { title: 'Registration and location', children: (
      <Paper>
        <ConditionalText value={boat.previous_names} label="Previous name/s"/>
        <ConditionalText value={boat.place_built} label="Place built"/>
        <ConditionalText value={boat.home_country} label="Home Country"/>
        <ConditionalText value={boat.year_is_approximate?'around ':''+boat.year} label="Year of Build"/>
        <ConditionalText value={boat.sail_number} label="Sail No."/>
        <ConditionalText value={boat.ssr} label="Small Ships Registry no. (SSR)"/>
        <ConditionalText value={boat.nhsr} label="National Register of Historic Vessels no. (NRHV)"/>
        <ConditionalText value={boat.fishing_number} label="Fishing No."/>
        <ConditionalText value={boat.callsign} label="Call Sign"/>
        <ConditionalText value={boat.nsbr} label="National Small Boat Register"/>
        <ConditionalText value={boat.uk_part1} label="Official Registration" />     
      </Paper>)
     },
    { title: 'Construction', children: (
      <Paper>
        <ConditionalText value={boat.genericTypeByGenericType} label="Generic type"/>
        <ConditionalText value={hullForm(boat)} label="Hull form"/>
        <ConditionalText value={boat.builderByBuilder} label="Builder"/>
        <ConditionalText value={boat.constructionMaterialByConstructionMaterial} label="Construction material"/>
        <ConditionalText value={boat.constructionMethodByConstructionMethod} label="Construction method"/>
        <ConditionalText value={boat.construction_details} label="Construction details"/>
      </Paper>
        )    
    },
    { title: 'Hull', children: (
      <Paper>
        <ConditionalText value={m2f(boat.length_on_deck)} label="Length on deck (LOD)"/>
        <ConditionalText label="Length overall (LOA)" value={m2f(boat.handicap_data?boat.handicap_data.length_overall:undefined)}/>
        <ConditionalText label="Waterline Length (LWL)" value={m2f(boat.handicap_data?boat.handicap_data.length_on_waterline:undefined)}/>
        <ConditionalText value={m2f(boat.beam)} label="Beam"/>
        <ConditionalText value={m2f(boat.draft)} label="Draft"/>        
      </Paper>)},
  ];

  if (boat.full_description) {
    panes.unshift(
        { title: 'Full Description', children: (<Paper dangerouslySetInnerHTML={{ __html: boat.full_description }} />) },
    );
  }
  
  if (boat.handicap_data) {
    const hd = boat.handicap_data;
    const sails = [];
    Object.entries(hd).forEach(([key, val]) => {
        if (val.luff) {
            sails.push({ name: key, ...val });
        }
    });
    if(hd.main || hd.thcf || hd.calculated_thcf || hd.fore_triangle_base) {
        panes.push({ title: 'Rig and Sails', children: (
          <Paper>
            <ConditionalText label="fore triangle base" value={m2f(hd.fore_triangle_base)}/>
            <ConditionalText label="fore triangle height" value={m2f(hd.fore_triangle_height)}/>
            <ConditionalText label="Calculated THCF" value={hd.calculated_thcf && hd.calculated_thcf.toFixed(3)}/>
            <ConditionalText label="THCF" value={hd.thcf && hd.thcf.toFixed(3)}/>
            <SailTable classes={classes} rows={sails}/>
          </Paper>
        )});    
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
  }

  if (boat.for_sale_state && boat.for_sale_state.text === 'for_sale') {
    const fs = boat.for_sales[0];

    panes.unshift(
        { title: 'For Sale', children: (
          <Paper>
            <ConditionalText label="Price" value={price(fs.asking_price)}/>
            <div dangerouslySetInnerHTML={{ __html: fs.sales_text }} />
          </Paper>
        ) },
    );
  }

 const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <DetailBar onChange={handleChange} value={value} panes={panes} />
      {panes.map((pane, i) => (
          <TabPanel key={i} value={value} index={i}>
              {pane.children}
          </TabPanel>
      ))}
    </>
  );
}