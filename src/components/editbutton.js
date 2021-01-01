import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
//import Dialog from '@material-ui/core/Dialog';
//import DialogTitle from '@material-ui/core/DialogTitle';
//import EditBoat from './forms/editboat';
import UpdateBoatDialog from './UpdateBoatDialog';

export default function EditButton({ classes, key, disabled, boat }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button className={classes.button} size="small"
            endIcon={<Icon>send</Icon>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            I have edits for this boat
      </Button>
      <UpdateBoatDialog boat={boat} onClose={handleClose} open={open} />
      {/*
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
      fullWidth maxWidth="200px" style={{minHeight: "50vh", maxHeight: "60vh" }}
      >
      <DialogTitle id="form-dialog-title">Edit {boat.name} ({boat.oga_no})</DialogTitle>
        <EditBoat boat={boat} onClose={handleClose} />
      </Dialog>
      */}
    </div>
  );
}