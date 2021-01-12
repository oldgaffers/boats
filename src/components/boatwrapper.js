import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import BoatDetail from './boatdetail';
import BoatSummary from './boatsummary';
import BoatButtons from './boatbuttons';
import SmugMugGallery from './smugmuggallery';

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

export default function BoatWrapper({ boat, linkComponent, location }) {

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
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
        <BoatSummary classes={classes} boat={boat} location={location} />
      </Grid>
      <Grid item xs={12}>
        <BoatDetail classes={classes} boat={boat} />
      </Grid>
    </Grid>
        <BoatButtons
          classes={classes}
          boat={boat}
          linkComponent={linkComponent}
          location={location}
        />
      </Container>
    </Paper>
  );
};
