import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { postBoatData } from '../util/api';
import EditBoatWizard from './editboatwizard';
// const EditBoatWizard = React.lazy(()=> import("./editboatwizard"));

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

  const handleSubmit = (changes, newItems, updated, email) => {
    setOpen(false);
    console.log('SUBMIT', changes, newItems, updated);
    postBoatData({ email, changes, newItems, new: updated })
      .then((response) => {
        if (response.ok) {
          console.log('submitted');
          setSnackBarOpen(true);
        } else {
          console.log("post", response.statusText);
          errorText = response.statusText;
          setErrorSnackBarOpen(true);
        }
      })
      .catch((error) => {
        console.log("post", error);
        errorText = error.message;
        setErrorSnackBarOpen(true);
      });
  };

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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={() => { console.log('ok'); setSnackBarOpen(false) }}
        message={"Thanks, we'll get back to you."}
        severity="success"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorSnackBarOpen}
        autoHideDuration={2000}
        onClose={() => { console.log('bad'); setErrorSnackBarOpen(false) }}
        message={errorText}
        severity="error"
      />
    </div>
  );
}