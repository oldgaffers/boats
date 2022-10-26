import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import useAxios from 'axios-hooks';
import UpdateBoatDialog from './UpdateBoatDialog';

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [{data, loading, error}, execute] = useAxios(
    {
      url: 'https://5cegnkuukaqp3y2xznxdfg75my0ciulc.lambda-url.eu-west-1.on.aws/',
      method: 'POST'
    },
    { manual: true }
  )
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (loading) {
      console.log('loading');
    }
    if (error) {
      console.log(error.message);
    }
    if (data) {
      console.log(`successfully submitted changes`, data);
      setSnackBarOpen(true);
    }
  }, [data, loading, error]);

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      const postData = {
        event: {
          op: 'UPDATE', 
          data: { old: changes.old, new: changes.new }
        },
        email: changes.email,
      };
      execute({ data: postData });
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
    </div>
  );
}