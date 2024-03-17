import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import { postBoatData } from '../util/api';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

function EndOwnershipDialog({
  name, open,
  onCancel, onClose,
}) {
  const [text, setText] = useState();
  const [year, setYear] = useState();

  return (<Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Change of Ownership for {name}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Thanks for letting us know
      </DialogContentText>
      <TextField
        onChange={(e) => setYear(e.target.value)}
        autoFocus
        margin="dense"
        label="Last Year Owned"
        type="number"
        value={new Date().getFullYear()}
        fullWidth
      />
      <TextField
        onChange={(e) => setText(e.target.value)}
        margin="dense"
        label="What happened to the boat?"
        type="text"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button
        endIcon={<SendIcon />}
        onClick={() => onClose(text, year)}
        color="primary"
      >
        Send
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default function EndOwnership({ boat, owned, user }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  let errorText = '';

  const handleClose = (text, year) => {
    setOpen(false);
    // console.log('handleClose', text, year, owned, boat.ownerships);
    const ownerships = boat.ownerships.map((o) => {
      const { current, ...rest } = o;
      if (current && o.id === owned.id) {
        return { ...rest, end: Number(year) }
      }
      return o;
    });
    const for_sales = boat.for_sales || [];
    for_sales.push({
      seller_gold_id: owned.id,
      seller_member: owned.member,
      summary: text,
    });
    const changes = { new: { ...boat, ownerships,  for_sales, }};
    if (year) {
      postBoatData({ email: user.email, new: changes.new })
        .then((response) => {
          if (response.ok) {
            setSnackBarOpen(true);
          } else {
            errorText = response.statusText;
            setErrorSnackBarOpen(true);  
          }
        })
        .catch((error) => {
          // console.log("post", error);
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
      <Button size="small"
        endIcon={<DeleteIcon />}
        variant="contained"
        color="success" onClick={() => setOpen(true)}>
        not mine
      </Button>
      <EndOwnershipDialog
        name={boat.name}
        open={open}
        onCancel={() => setOpen(false)}
        onClose={handleClose}
      />
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