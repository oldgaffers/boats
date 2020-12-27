import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Send from '@material-ui/icons/Send';

function addEnquiry(args) {
  console.log('addEnquiry', JSON.stringify(args));
}

export default function Enquiry({ boat, classes }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEmailChange = (e) => {
    if(e.target.reportValidity()) {
      console.log('email', e.target);
      setEmail(e.target.value);  
    } else {
      console.log('invalid email');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }
  const handleSend = () => {
    const { id, name, oga_no } = boat;
    addEnquiry({ variables: { type: 'general', id, boat_name: name, oga_no, email, text } });
    setOpen(false);
    setSnackBarOpen(true);
  };

  return (
        <form noValidate autoComplete="off">
          <Button className={classes.button} size="small"
            endIcon={<Send/>}
            variant="contained"
            color="primary" onClick={handleClickOpen}>
            Contact us about this boat
          </Button>
          <Dialog top open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Contact Us</DialogTitle>
            <DialogContent>
              <DialogContentText variant="subtitle2">
                Have some information or a question about <i>{boat.name}</i> ({boat.oga_no})?<p></p>
                We'd love to hear from you.<p></p>Please enter your email address here and tell us how we can help.
              </DialogContentText>
              <TextField
                error={email === ''}
                onChange={handleEmailChange}
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
              />
              <TextField
                onChange={handleTextChange}
                margin="dense"
                label="About your enquiry"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSend} color="primary" disabled={email === ''}>
                Send
              </Button>
            </DialogActions>
          </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </form>
  );
}
