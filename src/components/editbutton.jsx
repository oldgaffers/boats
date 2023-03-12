import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { postBoatData } from './boatregisterposts';
import EditBoatWizard from './editboatwizard';

export default function EditButton({ boat, user }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);

  let errorText = '';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (editedBoat) => {
    setOpen(false);
    console.log('before', JSON.stringify(boat));
    console.log('after', JSON.stringify(editedBoat));
    const changes = undefined;
    if (changes) {
      postBoatData({ email: changes.email, new: changes.new, newItems: changes.newItems })
      .then(() => {
          setSnackBarOpen(true);
        })
        .catch((error) => {
          // console.log("post", error);
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
      <Button size="small"
        endIcon={<EditIcon />}
        variant="contained"
        color="primary" onClick={handleClickOpen}>
        I have edits for this boat
      </Button>
      <EditBoatWizard boat={boat} user={user} open={open} onCancel={handleCancel} onSubmit={handleSubmit} />
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