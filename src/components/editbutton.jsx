import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import UpdateBoatDialog from './updateboatdialog';
import { CLEARED_VALUE } from './editboat';
import { postBoatData } from './boatregisterposts';

const changedKeys = (change) => {
  const oldKeys = Object.keys(change.old);
  return Object.keys(change.new).filter((key) => {
    if (oldKeys.includes(key)) {
        if (Array.isArray(change.old[key])) {
            if (change.old[key].length !== change.new[key].length) {
                return true;
            }
            if (change.old[key].length === 0) {
                return false;
            }
            if (change.old[key].every((val, index) => val === change.new[key][index])) {
              return false;
            }
            return true;
        } else if (typeof change.old[key] === 'object') {
          return JSON.stringify(change.old[key]) !== JSON.stringify(change.new[key]); // TODO nested
        } else if (change.old[key] === change.new[key]) {
            return false;
        }
    }
    return true;
  });
}

const differences = (change) => {
  const fields = changedKeys(change);
  return fields.map((field) => {
    const proposed = (change.new[field] === CLEARED_VALUE) ? undefined : change.new[field];
    return {field, current: change.old[field], proposed};
  });
}

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);

  let errorText = '';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      console.log(changes);
      const d = differences(changes);
      postBoatData(boat.name, boat.oga_no, d, changes.email)
      .then(() => {
          setSnackBarOpen(true);
        })
        .catch((error) => {
          console.log("post", error);
          errorText = error;
          setErrorSnackBarOpen(true);
        });
    }
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  }

  return (
    <div>
      <Button className={classes.button} size="small"
        endIcon={<EditIcon />}
        variant="contained"
        color="primary" onClick={handleClickOpen}>
        I have edits for this boat
      </Button>
      <UpdateBoatDialog boat={boat} onClose={handleClose} open={open} />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={errorSnackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message={errorText}
        severity="error"
      />
      </div>
  );
}