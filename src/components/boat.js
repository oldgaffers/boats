/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import { Link, useParams } from "react-router-dom";
import gql from 'graphql-tag';
import { useInView } from 'react-intersection-observer'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import TabPanel from './tabpanel';
import ConditionalText from './conditionaltext';
import SailTable from './sailtable';
import SmugMugGallery from './smugmuggallery';
import Enquiry from './enquiry';
import { feet, price } from '../util/format';

function m2f(val) {
    if(val) {
        return feet(val*100/2.54/12);
    }
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 600,
  },
  fillHeight: {
    height: "100%",
  },
  button: {
    margin: theme.spacing(1),
  },
  iframe: {
    border: 'none !important'
  }
}));

const boatQuery = (id) => gql`{
    boat(where: {oga_no: {_eq: ${id}}}) {
    id
    name
    previous_names
    year
    year_is_approximate
    public
    place_built
    home_port
    home_country
    ssr
    sail_number
    nhsr
    nsbr
    oga_no
    fishing_number
    callsign
    mssi
    full_description
    image_key
    uk_part1
    constructionMaterialByConstructionMaterial { name }
    constructionMethodByConstructionMethod { name }
    construction_details
    designClassByDesignClass { name }
    designerByDesigner { name }
    draft
    generic_type
    handicap_data
    hull_form
    keel_laid
    launched
    length_on_deck
    mainsail_type
    rigTypeByRigType { name }
    sail_type { name }
    short_description
    updated_at
    website
    genericTypeByGenericType { name }
    builderByBuilder { name notes }
    beam
    air_draft
    for_sale_state { text }
    for_sales(limit: 1, order_by: {updated_at: desc}) {
      asking_price
      flexibility
      offered
      price_flexibility { text }
      reduced
      sales_text
      sold
      summary
      updated_at
    }
    engine_installations {
      engine
      installed
      removed
    }
  }
  }`;

function MoreBelow({ visible }) {
    if (visible && false) { // TODO
      return (<ExpandMoreIcon/>);
    }
    return '';
  }

function DetailBar({ onChange, value, panes }) {
  return (
    <AppBar position="static" color="inherit">
        <Tabs
        onChange={onChange}
            value={value}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
        { panes.map((pane, i) => (<Tab key={i} label={pane.title}/>))}
        </Tabs>
    </AppBar>
  );
}

export default function Boat() {
  const { id } = useParams();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fillHeightPaper = clsx(classes.paper, classes.fillHeight);

  const [ref, inView] = useInView({
    // Optional options 
     threshold: 0,
  });
  
  const { loading, error, data } = useQuery(boatQuery(id));

  useEffect(() => {
      if (data) {
          document.title = data.boat[0].name;
      }
  });

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: (Boat)</p>;
  const boat = data.boat[0];
  console.log(boat);

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
        <ConditionalText value={boat.hull_form.replace(/_/g, ' ')} label="Hull form"/>
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
    const data = boat.handicap_data;
    const sails = [];
    Object.entries(data).forEach(([key, value]) => {
        if (value.luff) {
            sails.push({ name: key, ...value });
        }
    });
    if(data.main || data.thcf || data.calculated_thcf || data.fore_triangle_base) {
        panes.push({ title: 'Rig and Sails', children: (
            <Paper>
            <ConditionalText label="fore triangle base" value={m2f(data.fore_triangle_base)}/>
            <ConditionalText label="fore triangle height" value={m2f(data.fore_triangle_height)}/>
            <ConditionalText label="Calculated THCF" value={data.calculated_thcf}/>
            <ConditionalText label="THCF" value={data.thcf}/>
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
    //if (engineItems.length > 0) {
    //  panes.push({ title: 'Engine', render: () => <Tab.Pane><List>{engineItems}</List></Tab.Pane> });
    //}
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

  console.log('Boat - location', location);
  const homeLocation = { ...location, pathname: '/' };
  console.log('Home - location', homeLocation);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Paper>
        <Container maxWidth="lg" className={classes.container}>
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
                <ConditionalText value={boat.rigTypeByRigType.name} label="Rig"/>
                <ConditionalText value={boat.home_port} label="Home port or other location"/>
                <ConditionalText 
                  value={(boat.website)?(<div>
                    <a href={boat.website} rel='noopenner noreferrer' target='_blank'>click here</a></div>):undefined}
                  label="Website"
                />
                <div dangerouslySetInnerHTML={{ __html: boat.short_description }}></div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <MoreBelow visible={!inView}/>
                <DetailBar ref={ref} onChange={handleChange} value={value} panes={panes} />
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
            <Paper>
              <Grid container direction="row" alignItems="flex-end">
              <Grid item xs={2}>
              <Button size="small"
              variant="contained"
              className={classes.button}
              component={Link}
              to={homeLocation}
               >See more boats</Button>
               </Grid>
               <Grid item xs={10} >
               <Enquiry classes={classes} boat={boat} />
               </Grid>
              </Grid>
            </Paper>
        </Container>
        </Paper>
      </main>
    </div>
  );
}