import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
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
        endIcon={<Icon>send</Icon>}
        variant="contained"
        color="primary" onClick={handlePhotoFormOpen}>
        I have pictures of this boat
      </Button>
      <PhotoForm classes={classes} boat={boat} open={photoFormOpen} onClose={photoFormClose} />
    </>
);
}
