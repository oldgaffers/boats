import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Snackbar from "@mui/material/Snackbar";
import UpdatePhotoDialog from './updatephotodialog';

export default function PhotoButton({ classes, boat, onDone, onCancel }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (values, fileList) => {
    setOpen(false);
    if (fileList && fileList.length>0) {
      const formData = new FormData();
      if(fileList.length === 1) {
        formData.set("file", fileList[0]);
      } else {
        for(let i=0; i<fileList.length; i++) {
          formData.set(`file${i}`, fileList[i]);
        }
      }
      formData.set("oga_no", values.oga_no);
      formData.set("name", values.name);
      formData.set("albumKey", values.albumKey);
      formData.set("copyright", values.copyright);
      formData.set("email", values.email);
      axios
        .post(
          "https://7919d72bf588df2749fb8c6ed8289d51.m.pipedream.net",
          //"https://shielded-caverns-41302.herokuapp.com/api",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            params: {
              pipedream_upload_body: 1,
            },
          }
        )
        .then((response) => {
          setSnackBarOpen(true);
        })
        .catch((error) => {
          console.log("post", error);
          // TODO snackbar from response.data
        });
    } else {
      onCancel();
    }
  };

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
