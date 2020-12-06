import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import EditBoat from './editboat';

export default function EditDialog({ className, key, disabled, children, boat, email }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button 
        size="small"
        key={key}
        variant="contained"
        color="primary"
        disabled={disabled}
        className={className}
        endIcon={<Icon>send</Icon>}
        onClick={handleClickOpen}
      >
        I have edits for this boat
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
      fullWidth maxWidth="200px" style={{minHeight: "50vh", maxHeight: "60vh" }}
      >
        <DialogTitle id="form-dialog-title">Edit {boat.name} ({boat.oga_no})</DialogTitle>
        <EditBoat boat={boat} email={email} onClose={handleClose} />
      </Dialog>
    </div>
  );
}