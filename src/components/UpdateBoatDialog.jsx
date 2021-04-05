import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  editor: {
    minwidth: 500,
    minHeight: 500,
    margin: 10,
    padding: 10,
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

export default function UpdateBoatDialog({ boat, onClose, open }) {
  const classes = useStyles();

  const handleCancel = () => {
    onClose();
  }

  const handleSave = (changes) => { 
    onClose(changes);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <EditBoat classes={classes} onCancel={handleCancel} onSave={handleSave} boat={boat}/>
    </Dialog>
  );
}

UpdateBoatDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
