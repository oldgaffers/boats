import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import UpdateBoatDialog from './UpdateBoatDialog';

export default function EditButton({ classes, boat }) {
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
            endIcon={<SendIcon/>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            I have edits for this boat
      </Button>
      <UpdateBoatDialog boat={boat} onClose={handleClose} open={open} />
    </div>
  );
}