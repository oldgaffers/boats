import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';
import { gql, useMutation } from "@apollo/client";
import UpdateBoatDialog from './UpdateBoatDialog';
import { CLEARED_VALUE } from './editboat';

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
  return fields.map((field) => {
    const proposed = (change.new[field] === CLEARED_VALUE) ? undefined : change.new[field];
    return { field, current: change.old[field], proposed};
  });
}

const PROPOSE_UPDATES = gql`mutation propose_updates(
  $objects: [boat_pending_updates_insert_input!]!) {
  insert_boat_pending_updates(objects: $objects) {
    affected_rows
  }
}`;

function asString(c) {
  switch (typeof c) {
    case 'string':
      return c;
    case 'object':
    case 'number':
      return JSON.stringify(c);
    case 'undefined':
      return '';
    default:
      return c;
  }  
}

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [addChangeRequests, addChangeRequestsResult] = useMutation(PROPOSE_UPDATES);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const { data, loading, error, called } = addChangeRequestsResult;
    if (called) {
      if (loading) {
        // console.log('still loading');
      } else {
        if (error) {
          console.log('error submitting a change', error);
        } else {
          if (complete) {
            // console.log('complete');
          } else {
            console.log(`successfully submitted ${data.insert_boat_pending_updates.affected_rows} changes`);
            setSnackBarOpen(true);
            setComplete(true);
          }
        }  
      }
    } else {      
      // console.log('idle');
    }
  }, [addChangeRequestsResult, complete]);

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      const d = differences(changes);
      // console.log('differences', d);
      setComplete(false);
      addChangeRequests({ variables: { objects: d.map((c) => ({
        boat: boat.id,
        originator: changes.email, 
        uuid: uuidv4(),
        field: c.field,
        current: asString(c.current),
        proposed: asString(c.proposed),
      }))}});
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