import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import PhotoForm from './photoform';

export default function UploadPhotos({ boat, classes }) {
  const [photoFormOpen, setPhotoFormOpen] = useState(false);

  const handlePhotoFormOpen = () => {
    setPhotoFormOpen(true);
  };

  const photoFormClose = (value) => {
    setPhotoFormOpen(false);
  };

  return (
    <>
      <Button className={classes.button} size="small"
        endIcon={<SendIcon/>}
        variant="contained"
        color="primary" onClick={handlePhotoFormOpen}>
        Add pictures of this boat
      </Button>
      <PhotoForm classes={classes} boat={boat} open={photoFormOpen} onClose={photoFormClose} />
    </>
);
}
