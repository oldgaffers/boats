import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import AdminForm from './adminform';

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

export default function AdminDialog({ boat, onClose, open }) {
  const classes = useStyles();

  const handleCancel = () => {
    onClose();
  }

  const handleSave = (changes) => { 
    onClose(changes);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <AdminForm classes={classes} onCancel={handleCancel} onSave={handleSave} boat={boat}/>
    </Dialog>
  );
}

AdminDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
