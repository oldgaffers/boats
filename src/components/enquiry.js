import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Icon from '@material-ui/core/Icon';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_ENQUIRY = gql`
  mutation AddEnquiry(
      $id: uuid!, 
      $boat_name: String!, 
      $oga_no: Int!, 
      $email: String!, 
      $text: String!, 
      $type: enquiry_type_enum!) {
    insert_enquiry(objects: { 
      boat: $id, 
      boat_name: $boat_name, 
      oga_no: $oga_no, 
      email: $email, 
      text: $text,
      type: $type,
      }) {
      returning {
        id
      }
    }
  }
`;

/*
const DELETE_ENQUIRY = gql`
  mutation DeleteEnquiry($id: uuid!) {
    delete_enquiry(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
*/

export default function Enquiry({ boat, classes }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [addEnquiry, result] = useMutation(ADD_ENQUIRY);

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
            endIcon={<Icon>send</Icon>}
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
                autoFocus
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
