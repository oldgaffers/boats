import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import UpdateBoatDialog from './UpdateBoatDialog';

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      axios.post(
        'https://ae69efba7038dcdfe87ce1c3479d2976.m.pipedream.net',
        { old: boat, new: changes, uuid: uuidv4() },
      ).then(response => {
        console.log('post', response);
        setSnackBarOpen(true);
      }).catch(error => {
        console.log('post', error);
        // TODO snackbar from response.data
      });      
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
    </div>
  );
}