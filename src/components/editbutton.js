import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Send from '@material-ui/icons/Send';
import EditBoat from './editboat';

export default function EditButton({ classes, key, disabled, boat, pickers }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button className={classes.button} size="small"
            endIcon={<Send/>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            I have edits for this boat
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
	PaperProps={{ style: { minHeight: '50vh', minWidth: '50vw' }}}
      >
        <DialogTitle id="form-dialog-title">Edit {boat.name} ({boat.oga_no})</DialogTitle>
        <EditBoat boat={boat} pickers={pickers} onClose={handleClose} />
      </Dialog>
    </>
  );
}
