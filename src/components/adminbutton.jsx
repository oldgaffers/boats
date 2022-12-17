import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ConstructionIcon from "@mui/icons-material/Construction";
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import SnackBar from '@mui/material/Snackbar';
import { postBoatData } from './boatregisterposts';

function AdminDialog({ boat, user, onClose, open }) {
  const [popoverText, setPopoverText] = useState('');

  function feature() {
    postBoatData({ email: user.email, new: {} })
      .then(() => {
        setPopoverText("OK, that should happen soon");
      })
      .catch((error) => {
        console.log("post", error);
        setPopoverText(error.message);
      });
  }

  function setGallery() {
    postBoatData({ email: user.email, new: {} })
      .then(() => {
        setPopoverText("OK, lookout for a PR");
      })
      .catch((error) => {
        console.log("post", error);
        setPopoverText(error.message);
      });
  }

  return <>
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Update {boat.name || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          <Stack alignContent='end' spacing='1em'>
            <Button
              variant='contained'
              endIcon={<AutoAwesomeIcon />}
              onClick={() => feature()}
              color="primary"
            >
              Feature
            </Button>
            <Button
              variant='contained'
              endIcon={<ConstructionIcon />}
              onClick={() => setGallery()}
              color="primary"
            >
              Set Gallery
            </Button>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <SnackBar
      open={popoverText !== ''}
      autoHideDuration={3000}
      onClose={() => setPopoverText('')}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      message={popoverText}
    />
  </>;
}

export default function AdminButton({ classes, boat, user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={classes.button} size="small"
        endIcon={<EditIcon />}
        variant="contained"
        color="primary" onClick={() => setOpen(true)}>
        Admin Menu
      </Button>
      <AdminDialog boat={boat} user={user} onClose={() => setOpen(false)} open={open} />
    </>
  );
}