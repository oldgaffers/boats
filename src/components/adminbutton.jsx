import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import AdminDialog from './admindialog';
import { gql, useMutation } from '@apollo/client';

const UPDATE_BOAT = gql`mutation updateBoat($id: uuid!, $change: boat_set_input) {
  update_boat_by_pk(pk_columns: {id: $id}, _set: $change) {
      id
  }
}`;

export default function AdminButton({ classes, boat }) {
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [updateBoat, updateBoatResult] = useMutation(UPDATE_BOAT);

  useEffect(() => {
    const { data, loading, error, called } = updateBoatResult;
    if ((!error) && (!loading) && called && updateInProgress) {
      const u = data.update_boat_by_pk;
      console.log('successfully updated a boat', u);
      setSnackBarOpen(true);
      setUpdateInProgress(false);
    }
  }, [updateBoatResult, updateInProgress]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    console.log('handleClose', changes);
    setOpen(false);
    if (changes) {
     console.log('admin post'); 
     setUpdateInProgress(true);
     updateBoat({ variables: { id: boat.id, change: { ownerships: changes.boat.ownerships } } });
    }
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  }

  return (
    <div>
      <Button className={classes.button} size="small"
            endIcon={<EditIcon/>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            Admin Menu
      </Button>
      <AdminDialog boat={boat} onClose={handleClose} open={open} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Record updated."
        severity="success"
      />
    </div>
  );
}