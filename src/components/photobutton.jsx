import React, { useState } from "react";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Snackbar from "@mui/material/Snackbar";
import UpdatePhotoDialog from './updatephotodialog';
import { postPhotos } from "./postphotos";
import { createPhotoAlbum, postBoatData } from "./boatregisterposts";

async function upload(boat, copyright, email, pictures) {
  const { image_key, name, oga_no } = boat;
  let albumKey;
  if (image_key) {
    albumKey = image_key;
  } else {
    albumKey = await createPhotoAlbum(oga_no);
  }
  await postPhotos({ copyright, email, name, oga_no, albumKey }, pictures);
  if (!boat.image_key) {
    boat.image_key = albumKey;
    await postBoatData({ new: boat, email })
  }
}

export default function PhotoButton({ classes, boat, onDone }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (copyright, email, pictures) => {
    setOpen(false);
    upload(boat, copyright, email, pictures)
      .then(() => {
        setSnackBarOpen(true);
      }).catch((error) => {
        console.log("post", error);
        // TODO snackbar from response.data
      });
  }

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
    onDone();
  };
  return (
    <div>
      <Button
        size="small"
        endIcon={<PhotoLibraryIcon />}
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Add pictures of this boat
      </Button>
      <UpdatePhotoDialog classes={classes} boat={boat} onClose={handleClose} open={open} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </div>
  );
}
