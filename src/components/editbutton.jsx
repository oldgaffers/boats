import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { postBoatData } from '../util/api';
import EditBoatWizard from './editboatwizard';
import { boatf2m, boatm2f } from '../util/format';
import { boatdiff } from './editboatwizardfunctions';
import { formatters } from 'jsondiffpatch';

export default function EditButton({ boat, label = 'I have edits for this boat' }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarText, setSnackBarText] = useState("Thanks, we'll get back to you.");
  const [snackBarSeverity, setSnackBarSeverity] = useState('success');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (newItems, updated, email) => {
    setOpen(false);
    // console.log('SUBMIT', changes, newItems, updated);
    const rounded = boatf2m(boatm2f(boat)); // to exclude changes due to rounding
    const changes = formatters.jsonpatch.format(boatdiff(rounded, updated));

    postBoatData({ email, changes, newItems, new: updated })
      .then((response) => {
        if (response.ok) {
          // console.log('submitted');
          setSnackBarText("Thanks, we'll get back to you.");
          setSnackBarSeverity('success');
          setSnackBarOpen(true);
        } else {
          console.log("post", response.status, response.statusText);
          response.text.then(text => {
            setSnackBarText(text);
            setSnackBarSeverity('error');
            setSnackBarOpen(true);
          });
        }
      })
      .catch((error) => {
        // console.log("post", error);
        setSnackBarText(error.message);
        setSnackBarSeverity('error');
        setSnackBarOpen(true);
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
      <EditBoatWizard boat={boat} open={open} onCancel={handleCancel} onSubmit={handleSubmit} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={() => { console.log('ok'); setSnackBarOpen(false) }}
        message={snackBarText}
        severity={snackBarSeverity}
      />
    </div>
  );
}