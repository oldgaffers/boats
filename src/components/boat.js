import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import RigAndSails from './rigandsails';
import ImageCarousel from './imagecarousel';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const boatQuery = (id) => gql`{
    boat(where: {oga_no: {_eq: 315}}) {
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
    construction_notes
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
    for_sales {
      flexibility
      offered
      price_flexibility {
        text
      }
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

const registration = {
    previous_names: { label: 'Previous name/s' },
    place_built: { label: 'Place built' },
    year: { label: 'Year of Build' },
    year_is_approximate: { label: 'ish' },
    sail_number: { label: 'Sail No.' },
    home_country: { label: 'Home Country' },
    ssr: { label: 'Small Ships Registry no. (SSR)' },
    nhsr: { label: 'National Register of Historic Vessels no. (NRHV)' },
    fishing_number: { label: 'Fishing No.' },
    callsign: { label: 'Call Sign' },
    // other_registries: { label: 'Other Registrations' },
    nsbr: { label: 'National Small Boat Register' },
    uk_part1: { label: 'Official Registration' }
};

const construction = {
    constructionMaterialByConstructionMaterial: { 
      name: { label: 'Construction material' }
    },
    constructionMethodByConstructionMethod: {
      name: { label: 'Construction method' }
    },
    hull_form: { label: 'Hull form' },
    genericTypeByGenericType: { name: { label: 'Generic Type ' } },
    builderByBuilder: { name:  { label: 'Builder' } }
};

const hull = {
    length_on_deck: { label: 'Length on deck (LOD):', unit: 'm' },
    beam: { label: 'Beam', unit: 'm' },
    draft: { label: 'Draft', unit: 'm' }
};

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

export function Boat1({ id }) {
    
    const { loading, error, data } = useQuery(boatQuery(id));

    useEffect(() => {
        if (data) {
            document.title = data.boat.name;
        }
    });

    const rigItems = RigAndSails({ id }); // uses hooks so must be unconditional

    console.log(registration, construction, hull, engine, rigItems);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: (Boat)</p>;
    const boat = data.boat;

    /*
    const panes = [
        { menuItem: 'Registration and location', render: () => <Tab.Pane><List><ListItems labels={registration} boat={boat} /></List></Tab.Pane> },
        { menuItem: 'Construction', render: () => <Tab.Pane><List><ListItems labels={construction} boat={boat} /></List></Tab.Pane> },
        { menuItem: 'Hull', render: () => <Tab.Pane><List><ListItems labels={hull} boat={boat} /></List></Tab.Pane> },
    ];
    
    if (rigItems.length > 0) {
        panes.push({ menuItem: 'Rig and Sails', render: () => <Tab.Pane><List>{rigItems}</List></Tab.Pane> });
    }
    const engineItems = ListItems({ labels: engine, boat: boat.propulsion });
    if (engineItems.length > 0) {
        panes.push({ menuItem: 'Engine', render: () => <Tab.Pane><List>{engineItems}</List></Tab.Pane> });
    }
    

    if (boat.full_desc) {
        panes.unshift(
            { menuItem: 'Full Description', render: () => <Tab.Pane dangerouslySetInnerHTML={{ __html: boat.full_desc }} /> },
        );
    }
    

    if (boat.for_sale) {
        let text = boat.sale_text;
        if (boat.price) {
            text += "<b>Price: </b>" + boat.price;
        }
        panes.unshift({
            menuItem: 'For Sale', render: () => <Tab.Pane dangerouslySetInnerHTML={{ __html: text }} />
        });
    }
    */

    return (
    <MuiThemeProvider>
    <Grid>
        <div>
            <div>
                <Typography variant="h1">{boat.name}</Typography>
            </div>
            <div>
                <Typography variant="h1">{boat.year}</Typography>
            </div>
        </div>
        <div>
            <div>
                <ImageCarousel images={boat.images} />
            </div>
            <div>
                <Typography variant="h2">Details</Typography>
                {
                    /*
                <List>
                    <List.Item header='Boat OGA no:' content={id} />
                    <List.Item header='Mainsail type:' content={boat.class.mainsailType} />
                    <List.Item header='Rig type:' content={boat.class.rigType} />
                    <List.Item header='Home port or other location:' content={boat.home_port} />
                    <ListItem><div dangerouslySetInnerHTML={{ __html: boat.short_desc }}></div></ListItem>
                </List>
                */
                }
            </div>
        </div>
        <div width={16}>
           { /*<Tab panes={panes} />*/}
        </div>
    </Grid>
    </MuiThemeProvider>
    );
};


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Boat({ id }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Album layout
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Something short and leading about the collection below—its contents, the creator, etc.
              Make it short and sweet, but not too short so folks don&apos;t simply skip over it
              entirely.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
          {/* End hero unit */}
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
      </footer>
      {/* End footer */}
  );
}