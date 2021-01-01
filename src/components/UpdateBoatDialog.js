import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Activity from './Activity';
import Descriptions from './Descriptions';
import Rig from './Rig';
import Handicap from './Handicap';
import Ownership from './Ownership';
import Everything from './Everything';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: 0, // theme.spacing(3),
    marginBottom: 0, // theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: 0, // theme.spacing(6),
      marginBottom: 0, // theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://oga.org.uk/">
        The members of the OGA
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function getActivity(boat, activity, handleClose, handleStart, classes) {
  console.log('getActivity', boat);
  switch(activity) {
    case -1: return (<Activity classes={classes} onCancel={handleClose} onStart={handleStart} />);
    case 0: return (<Descriptions classes={classes} short={boat.short_description} full={boat.full_description} />);
    case 1: return (<Rig classes={classes} />);
    case 2: return (<Handicap classes={classes} />);
    case 3: return (<Ownership classes={classes} />);
    case 4: return (<Everything classes={classes} />);
    default: return null;
  }
}

export default function UpdateBoatDialog({ boat, onClose, open }) {

  const classes = useStyles();
  const [activity, setActivity] = useState(-1);

  const handleClose = () => {
    onClose();
  };

  const handleStart = (index) => {
    setActivity(index);
  };

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Dialog onClose={handleClose} aria-labelledby="updateboat-dialog-title" open={open}>
          <DialogTitle id="updateboat-dialog-title">Update Boat</DialogTitle>
          {getActivity(boat, activity, handleClose, handleStart, classes)}
        </Dialog>
        <Copyright />
      </main>
    </>
  );
}

UpdateBoatDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
