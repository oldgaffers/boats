import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import OGA60 from "./oga60interest";

export default function OGA60Dialog({ onClose, open }) {
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClose = () => {
    setSnackBarOpen(true);
  }

  const handleCancel = () => {
      onClose();
  }

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
    onClose();
  }

  return (
    <>
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            maxWidth={'lg'}
            onClose={onClose}
        >
        <Grid container spacing={1}>
            <Grid item xs={12}>&nbsp;</Grid>
                <Grid item xs={1}>&nbsp;</Grid>
                <Grid item xs={10}><OGA60 onClose={handleClose} onCancel={handleCancel} /></Grid>
                <Grid item xs={1}>&nbsp;</Grid>
                <Grid item xs={12}>&nbsp;</Grid>
            </Grid>
        </Dialog>
        <Snackbar
                sx={{backgroundColor: 'green'}}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={handleSnackBarClose}
                message="Thanks for your interest. You should receive an email to say we have your details."
                severity="success"
            />
    </>
  );
}
