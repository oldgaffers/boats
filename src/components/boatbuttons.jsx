import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import PhotoButton from './photobutton';
import EditButton from './editbutton';
import AdminButton from './adminbutton';
import Enquiry from './enquiry';

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

export default function BoatButtons({ boat, ownerships, user /* location */ }) {

  const roles = user?.['https://oga.org.uk/roles'] || [];

  const theme = useTheme();
  const classes = useStyles(theme);

  const photoCancelled = () => {
    console.log('cancel');
  }

  const photoDone = () => {
    // console.log('done');
  }

  /*
  const state = getState();
  let main_page = `${location.origin}/boat_register/`;
  if (location.pathname.includes('test')) {
    main_page = `${main_page}test_`;
  }
  if (state.view === 'sell') {
    main_page = `${main_page}boats_for_sale`;
  } else if (state.view === 'small') {
    main_page = `${main_page}small_boats`;
  } else {
    main_page = `${main_page}browse_the_register`;
  }
  */

  return (
    <Paper>
        <Grid container direction='row' alignItems='flex-end' justifyContent='space-evenly'>
        <Grid item xs={'auto'}>
          <Button size="small"
              color='primary'
              variant="contained"
            className={classes.button}
            // eslint-disable-next-line no-restricted-globals
            onClick={() => history.back()}
          >See more boats</Button>
        </Grid>
        <Grid item xs={'auto'} >
            <Enquiry classes={classes} boat={boat} />
        </Grid>
        <Grid item xs={'auto'} >
            <PhotoButton
              classes={classes} boat={boat} user={user}
              onCancel={photoCancelled}
              onDone={photoDone}
              color='secondary'
            />
        </Grid>
        <Grid item xs={'auto'} >
            <EditButton classes={classes} boat={boat} user={user} color='secondary'/>
        </Grid>
        {roles.includes('editor')
          ? (<Grid item xs={'auto'} ><AdminButton classes={classes} boat={boat} user={user} color='secondary'/></Grid>)
          : ''
        }
        </Grid>
    </Paper>
  );
};
