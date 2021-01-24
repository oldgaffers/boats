import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Activity from './Activity';
import Descriptions from './Descriptions';
import Rig from './Rig';
import Handicap from './Handicap';
import Ownership from './Ownership';
import Everything from './Everything';
import { usePicklists } from '../util/picklists';
import EditBoat from './EditBoat';

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
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  editor: {
    minwidth: 500,
    margin: theme.spacing(1),
    padding: 0,
    border: 'none',
    boxShadow: 'none'
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

function getActivity({ pickers, boat, activity, handleClose, handleStart, handleCancel, classes }) {

  const handleSaveDescriptions = (short, full) => {
    handleClose({ ...boat, short_description: short, full_description: full });
  }

  const handleSaveRig = (boatChanges) => {
    handleClose({ ...boat, ...boatChanges });
  }
  switch(activity) {
    case -1: return (<Activity classes={classes} onCancel={handleCancel} onStart={handleStart} />);
    case 0: return (<Descriptions classes={classes} onCancel={handleCancel} onSave={handleSaveDescriptions} short={boat.short_description} full={boat.full_description} />);
    case 1: return (<Rig classes={classes} onCancel={handleCancel} onSave={handleSaveRig} boat={boat} pickers={pickers} />);
    case 2: return (<Handicap classes={classes} />);
    case 3: return (<Ownership classes={classes} />);
    case 4: return (<Everything classes={classes} />);
    default: return null;
  }
}

export default function UpdateBoatDialog({ boat, onClose, open }) {
  const classes = useStyles();
  const { loading, error, data } = usePicklists();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(can't get picklists)</p>);

  const pickers = data;

  const handleCancel = () => {
    onClose();
  }

  const handleSave = (changes) => {    
    onClose(changes);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <EditBoat classes={classes} onCancel={handleCancel} onSave={handleSave} boat={boat} pickers={pickers}/>
  </Dialog>
  );
}

export function OldDialog({ boat, onClose, open }) {

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [activity, setActivity] = useState(-1);

  const handleCancel = () => {
    onClose();
  }

  const handleEmailChange = (e) => {
    if(e.target.reportValidity()) {
      console.log('email', e.target);
      setEmail(e.target.value);  
    } else {
      console.log('invalid email');
    }
  };

  const handleClose = (changes) => {    
    console.log(changes);
    onClose(changes);
  };

  const handleStart = (index) => {
    setActivity(index);
  };

  return (
  <Dialog onClose={handleClose} aria-labelledby="updateboat-dialog-title" open={open}>
    <DialogTitle id="updateboat-dialog-title">Update Boat</DialogTitle>
      <DialogActions>
      <Grid container direction='column' display="flex" justifyContent="flex-end">
        <Grid m={1}>
      <TextField
          error={email === ''}
          onChange={handleEmailChange}
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
      />
      </Grid>
      <Grid m={1}>
      {getActivity({ pickers, boat, activity, handleClose, handleStart, handleCancel, classes })}
      </Grid>
      <Grid m={1}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      </Grid>
      </Grid>
    </DialogActions>
  </Dialog>
  );
}


UpdateBoatDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
