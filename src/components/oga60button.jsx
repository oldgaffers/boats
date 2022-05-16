import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import OGA60Dialog from "./oga60dialog";
import LoginButton from "./loginbutton";

export default function OGA60Button() {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { isAuthenticated } = useAuth0();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
      console.log('dialog closed')
    setOpen(false);
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  return (
    <div>
      <LoginButton label='Login' avatar={false} />
      &nbsp;
      <Button
        disabled={!isAuthenticated}
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        I'm interested in coming
      </Button>
      <OGA60Dialog onClose={handleClose} open={open} />
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
