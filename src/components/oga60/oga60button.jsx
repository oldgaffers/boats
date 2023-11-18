import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import OGA60Dialog from "./oga60dialog";

export default function OGA60Button() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth0();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // console.log('dialog closed')
    setOpen(false);
  };

  return (
    <div>
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
    </div>
  );
}
