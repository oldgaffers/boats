/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
// import { useInView } from 'react-intersection-observer'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'clsx';
import TabPanel from './tabpanel';
import ConditionalText from './conditionaltext';
import SailTable from './sailtable';
import SmugMugGallery from './smugmuggallery';
import { feet, price } from './format';
import ReactFBLike from 'react-fb-like';
import References from './references';
import DetailBar from './detailbar';
import AssignmentIcon from '@material-ui/icons/Assignment';

function m2f(val) {
    if(val) {
        return feet(val*100/2.54/12);
    }
}

function hullForm(boat) {
  if (boat.hull_form === null) {
    return null;
  }
  return boat.hull_form.replace(/_/g, ' ');
}

export default function Boat({ classes, boat, link }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fillHeightPaper = clsx(classes.paper, classes.fillHeight);

  // TODO const { ref } = useInView({ threshold: 0 });
  
  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }
  
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
    { title: 'Hull', children: (<Paper>
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
            <ConditionalText label="Calculated THCF" value={hd.calculated_thcf}/>
            <ConditionalText label="THCF" value={hd.thcf}/>
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
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
          <Typography variant="h3" component="h3">{boat.name}</Typography>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
          <Typography variant="h3" component="h3">{boat.year}</Typography>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <SmugMugGallery classes={classes} albumKey={boat.image_key} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fillHeightPaper}>
          <Typography variant="h4" component="h4">Details</Typography>
          <ConditionalText value={boat.oga_no} label="OGA no"/>
          <ConditionalText value={boat.mainsail_type} label="Mainsail"/>
          <ConditionalText value={boat.rigTypeByRigType && boat.rigTypeByRigType.name} label="Rig"/>
          <ConditionalText value={boat.home_port} label="Home port or other location"/>
          <ConditionalText 
            value={(boat.website)?(<a href={boat.website} rel='noopenner noreferrer' target='_blank'>click here</a>):undefined}
            label="Website"
          />
          <div dangerouslySetInnerHTML={{ __html: boat.short_description }}></div>
          <References boat={boat}/>
          <div>
            <CopyToClipboard text={link} onCopy={() => setSnackBarOpen(true)}>
              <Button endIcon={<AssignmentIcon/>} size='small' variant='contained' className={classes.button} >
              Copy page url
              </Button>
            </CopyToClipboard>
              <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              open={snackBarOpen}
              autoHideDuration={2000}
              onClose={handleSnackBarClose}
              message="URL copied to clipboard."
              severity="success"
            />
          </div>
          <div>
            <ReactFBLike href={link} language="en_GB" appId="644249802921642" version="v2.12" />
          </div>
          </Paper>
      </Grid>
      <Grid item xs={12}>
          <DetailBar onChange={handleChange} value={value} panes={panes} />
          <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
          >
          {panes.map((pane, i) => (
              <TabPanel key={i} value={value} index={i}>
                  {pane.children}
              </TabPanel>
          ))}
          </SwipeableViews>
      </Grid>
    </Grid>
  );
}