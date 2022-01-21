import React, { useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';
import { gql, useMutation } from "@apollo/client";
import UpdateBoatDialog from './UpdateBoatDialog';

const UPDATE_BOAT = gql`
mutation MyMutation(
  $boat: uuid = ""
  $originator: String = "", 
  $data: jsonb = "", 
  $uuid: uuid = ""
) {
insert_boat_pending_updates_one(object: {
  boat: $boat,
  data: $data, 
  originator: $originator, 
  uuid: $uuid
})`;

export default function EditButton({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [addChangeRequest, result] = useMutation(UPDATE_BOAT);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (changes) => {
    setOpen(false);
    if (changes) {
      addChangeRequest({
        variables: { 
          boat: boat.id,
          originator: changes.email, 
          data: changes, 
          uuid: uuidv4()
         },
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