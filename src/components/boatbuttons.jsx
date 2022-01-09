import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// import PhotoButton from './photobutton';
const PhotoButton = React.lazy(() => import('./photobutton'));
// import EditButton from './editbutton';
const EditButton = React.lazy(() => import('./editbutton'));
// import AdminButton from './adminbutton';
const AdminButton = React.lazy(() => import('./adminbutton'));
// import Enquiry from './enquiry';
const Enquiry = React.lazy(() => import('./Enquiry'));

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

export default function BoatButtons({ boat, location }) {
  const { user, isAuthenticated } = useAuth0();
  let roles = [];
  if (isAuthenticated) {
      roles = user['https://oga.org.uk/roles'] || [];
  }
  if(document.referrer.includes('localhost')) { roles.push('editor')}

  const theme = useTheme();
  const classes = useStyles(theme);

  const photoCancelled = () => {
    console.log('cancel');
  }

  const photoDone = () => {
    console.log('done');
  }

  const state = JSON.parse(sessionStorage.getItem("BOAT_BROWSE_STATE")||'{"view":"app"}');
  console.log('view', state.view);
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

  return (
    <Paper>
        <Grid container direction='row' alignItems='flex-end' justifyContent='space-evenly'>
        <Grid item xs={'auto'}>
          <Button size="small"
            variant="contained"
            className={classes.button}
            component={'a'}
            href={main_page}
          >See more boats</Button>
        </Grid>
        <Grid item xs={'auto'} >
            <Enquiry classes={classes} boat={boat} />
        </Grid>
        <Grid item xs={'auto'} >
            <PhotoButton
              classes={classes} boat={boat} 
              onCancel={photoCancelled}
              onDone={photoDone}
            />
        </Grid>
        <Grid item xs={'auto'} >
            <EditButton classes={classes} boat={boat} />
        </Grid>
        {roles.includes('editor')
          ? (<Grid item xs={'auto'} ><AdminButton classes={classes} boat={boat} /></Grid>)
          : ''
        }
      </Grid>
    </Paper>
  );
};
