import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import UpdatePhotoDialog from './UpdatePhotoDialog';

export default function PhotoButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (values, fileList) => {
    setOpen(false);
    console.log(fileList);
    if (fileList[0]) {
      const formData = new FormData();
    formData.append('file',fileList[0]);
    formData.append('oga_no', values.oga_no);
    formData.append('name', values.name);
    formData.append('albumKey', values.albumKey);
    formData.append('copyright', values.copyright);
    formData.append('email', values.email);
      axios.post(
        'https://7919d72bf588df2749fb8c6ed8289d51.m.pipedream.net',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
         },
          params: {
            pipedream_upload_body: 1
          }
        },
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
            endIcon={<PhotoLibraryIcon/>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
        Add pictures of this boat
      </Button>
      <UpdatePhotoDialog boat={boat} onClose={handleClose} open={open} />
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