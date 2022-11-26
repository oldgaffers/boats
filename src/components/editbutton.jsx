import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import UpdateBoatDialog from './updateboatdialog';
import { postBoatData } from './boatregisterposts';

export default function EditButton({ classes, boat, ownerships }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);

  let errorText = '';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      postBoatData({ email: changes.email, new: changes.new })
      .then(() => {
          setSnackBarOpen(true);
        })
        .catch((error) => {
          console.log("post", error);
          errorText = error;
          setErrorSnackBarOpen(true);
        });
    }
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  }

  return (
    <div>
      <Button className={classes.button} size="small"
        endIcon={<EditIcon />}
        variant="contained"
        color="primary" onClick={handleClickOpen}>
        I have edits for this boat
      </Button>
      <UpdateBoatDialog boat={boat} onClose={handleClose} open={open} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={errorSnackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message={errorText}
        severity="error"
      />
      </div>
  );
}