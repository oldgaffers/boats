import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import AdminDialog from './admindialog';

export default function AdminButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    console.log('handleClose', changes);
    setOpen(false);
    if (changes) {
      /*
      axios.post(
        'https://ae69efba7038dcdfe87ce1c3479d2976.m.pipedream.net',
        { ...changes, uuid: uuidv4() },
      ).then(response => {
        console.log('post', response);
        setSnackBarOpen(true);
      }).catch(error => {
        console.log('post', error);
        // TODO snackbar from response.data
      });
      */
     console.log('admin post');      
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
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </div>
  );
}