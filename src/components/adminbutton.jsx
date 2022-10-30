import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import AdminDialog from './admindialog';

export default function AdminButton({ classes, boat }) {
  // const [updateInProgress, setUpdateInProgress] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    console.log('handleClose', changes);
    setOpen(false);
    if (changes) {
     console.log('admin post'); 
    //setUpdateInProgress(true);
     //updateBoat();
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