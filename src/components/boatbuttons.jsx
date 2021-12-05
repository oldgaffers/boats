import React from 'react';
import { useLocation } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PhotoButton from './photobutton';
import EditButton from './editbutton';
import Enquiry from './enquiry';
import { prefix } from '../util/rr';

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

export default function BoatButtons({ boat }) {
  const location = useLocation();

  const classes = useStyles();

  const photoCancelled = () => {
    console.log('cancel');
  }

  const photoDone = () => {
    console.log('done');
  }
  console.log('referrer', document.referrer);
  return (
    <Paper>
        <Grid container direction="row" alignItems="flex-end">
        <Grid item xs={2}>
            {
              (document.referrer.includes('boat_register'))?
              (
                <Button size="small"
                variant="contained"
                className={classes.button}
                onClick={() => window.history.back()}
                >See more boats</Button>
              )
              :
              (
                <Button size="small"
                variant="contained"
                className={classes.button}
                component={'a'}
                href={`${prefix(location)}browse_the_register/`}
                >See more boats</Button>
              )
            }
        </Grid>
        <Grid item xs={3} >
            <Enquiry classes={classes} boat={boat} />
        </Grid>
        <Grid item xs={3} >
            <PhotoButton
              classes={classes} boat={boat} 
              onCancel={photoCancelled}
              onDone={photoDone}
            />
        </Grid>
        <Grid item xs={3} >
            <EditButton classes={classes} boat={boat} />
        </Grid>
      </Grid>
    </Paper>
  );
};
