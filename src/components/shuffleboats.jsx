import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import { shuffleBoats } from '../util/api';

export default function ShuffleBoatsButton() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClick = () => {
    shuffleBoats()
        .then(() => setSnackBarOpen())
        .catch(() => console.log('error asking for a shuffle'));
  };

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Shuffle Boats
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        message="Shuffle requested, please be patient."
        severity="success"
      />
    </div>
  );
}
