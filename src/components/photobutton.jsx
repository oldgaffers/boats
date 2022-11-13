import React, { useState } from "react";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Snackbar from "@mui/material/Snackbar";
import UpdatePhotoDialog from './updatephotodialog';
import { postPhotos } from "./postphotos";

export default function PhotoButton({ classes, boat, onDone, onCancel }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (values, fileList) => {
    setOpen(false);
      postPhotos(values, fileList)
      .then((r) => {
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
