import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';
import { gql, useMutation } from "@apollo/client";
import UpdateBoatDialog from './UpdateBoatDialog';

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
            return change.old[key] === change.new[key];
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
  return fields.map((field) => ({ field, current: change.old[field], proposed: change.new[field]}));
}

const UPDATE_BOAT = gql`mutation insertUpdate(
  $uuid: uuid!,
  $originator: String!, 
  $boat: uuid!, 
  $field: String!, 
  $current: String!, 
  $proposed: String!) {
  insert_boat_pending_updates_one(
    object: {
      uuid: $uuid,
      boat: $boat,
      current: $current,
      field: $field,
      originator: $originator,
      proposed: $proposed
    }
  ) {
    id
    uuid
  }
}`;

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [addChangeRequest, result] = useMutation(UPDATE_BOAT);
  console.log('mutation', result);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      const d = differences(changes);
      console.log('D', d);
      d.forEach((c) => {
        switch (typeof c.current) {
          case 'string':
            break;
          case 'object':
          case 'number':
            c.current = JSON.stringify(c.current);
            break;
          case 'undefined':
            c.current = '';
            break;
          default:            
        }
        console.log('C', c);
        addChangeRequest({
          variables: { 
            boat: boat.id,
            originator: changes.email, 
            uuid: uuidv4(),
            ...c,
           },
        });  
      });
      setSnackBarOpen(true);
    }
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  }

  return (
    <div>
      <Button className={classes.button} size="small"
            endIcon={<EditIcon/>}
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
    </div>
  );
}