import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { postBoatData } from '../util/api';

export default function MergeButton({ update, label = 'Merge builders' }) {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);

  let errorText = '';

  const handleClickOpen = () => {
    postBoatData(update)
      .then((response) => {
        if (response.ok) {
          setSnackBarOpen(true);
        } else {
          errorText = response.statusText;
          setErrorSnackBarOpen(true);
        }
      })
      .catch((error) => {
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
        {label}
      </Button>
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