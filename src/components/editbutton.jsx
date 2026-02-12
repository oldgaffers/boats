import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { createPhotoAlbum, postBoatData } from '../util/api';
import EditBoatWizard from './editboatwizard';
import { boatf2m, boatm2f } from '../util/format';
import { boatdiff } from './editboatwizardfunctions';
import { formatters } from 'jsondiffpatch';

async function checkAlbum(boat) {
   if (boat.image_key) {
     return boat;
   }
   const r = await createPhotoAlbum(boat.name, no);
   if (r.ok) {
      const j = await r.json();
      return {...boat, image_key: j.albumKey };
   } else {
      console.log('problem creating album for new boat', r.status, r.statusText);
      const j = await r.json();
      if (j.albumKey) {
         return {...boat, image_key: j.albumKey };
      }
   }
}

export default function EditButton({ boat, label = 'I have edits for this boat' }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarText, setSnackBarText] = useState("Thanks, we'll get back to you.");
  const [snackBarSeverity, setSnackBarSeverity] = useState('success');

  async function submitBoatEdits(email, changes, newItems, updated) {
    try {
      const boat = await checkAlbum(updated);
      const response = await postBoatData({ email, changes, newItems, new: boat });
      if (response.ok) {
        // console.log('submitted');
        setSnackBarText("Thanks, we'll get back to you.");
        setSnackBarSeverity('success');
      } else {
        // console.log("post", response.status, response.statusText);
        const text = await response.text();
        setSnackBarText(text);
        setSnackBarSeverity('error');
      }
      setSnackBarOpen(true);
    } catch (error) {
      // console.log("post", error);
      setSnackBarText(`Something went wrong: ${error.message}`);
      setSnackBarSeverity('error');
      setSnackBarOpen(true);
    };
  }
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
    submitBoatEdits(email, changes, newItems, updated).then(() => {
      console.log('done');
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
        autoHideDuration={7000}
        onClose={() => { console.log('ok'); setSnackBarOpen(false) }}
        message={snackBarText}
        severity={snackBarSeverity}
      />
    </div>
  );
}