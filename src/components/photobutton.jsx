import React, { useState } from "react";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddPhotosDialog from './addphotosdialog';

export default function PhotoButton({ boat, onDone }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Button
        size="small"
        endIcon={<PhotoLibraryIcon />}
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Add pictures of this boat
      </Button>
      <AddPhotosDialog boat={boat}
        onClose={handleClose} onCancel={() => setOpen(false)} open={open} 
      />
    </div>
  );
}
