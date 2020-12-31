import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import BoatDetail from './boatdetail';
import UploadPhotos from './uploadphotos';
// import EditButton from './editbutton';
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

export const BoatWrapper = ({ boat, pickers, link, home, absolute }) => {

  const classes = useStyles();
  return (
    <Paper>
        <Container maxWidth="lg" className={classes.container}>
            <BoatDetail classes={classes} boat={boat} site={absolute} />
            <Paper>
              <Grid container direction="row" alignItems="flex-end">
                <Grid item xs={1.5}>
                  <Button size="small"
                  variant="contained"
                  className={classes.button}
                  component={link}
                  to={home}
                  >See more boats</Button>
                </Grid>
                <Grid item xs={3} >
                  <Enquiry classes={classes} boat={boat} />
                </Grid>
                <Grid item xs={3} >
                  <UploadPhotos classes={classes} boat={boat} />
                </Grid>
                {
                <Grid item xs={3} >
                  {/*<EditButton classes={classes} boat={boat} pickers={pickers}/>*/}
                </Grid>
                }
              </Grid>
            </Paper>
        </Container>
     </Paper>
  );
};
