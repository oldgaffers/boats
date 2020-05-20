import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_ENQUIRY = gql`
  mutation AddEnquiry($id: uuid!, $email: String!, $type: enquiry_type_enum!) {
    insert_enquiry(objects: { boat: $id, email: $email, type: $type }) {
      returning {
        id
      }
    }
  }
`;

const DELETE_ENQUIRY = gql`
  mutation DeleteEnquiry($id: uuid!) {
    delete_enquiry(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export default function Enquiry({
  boat,
  classes,
  buttons = [
    { label: 'Make contact with the owner', key: 'general' },
    { label: 'Add pictures / text', key: 'addinfo' },
    { label: 'Request a handicap', key: 'handicap' },
  ],
  label = 'enter an email and click one of the options below if you want to be contacted about this boat',
}) {
  const [email, setEmail] = useState();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [recallSnackBarOpen, setRecallSnackBarOpen] = useState(false);
  const [addEnquiry, result] = useMutation(ADD_ENQUIRY);
  const [deleteEnquiry] = useMutation(DELETE_ENQUIRY);

  function recallEnquiry() {
    setSnackBarOpen(false);
    const id = result.data.insert_enquiry.returning[0].id;
    console.log(id);
    deleteEnquiry({ variables: { id } });
    setRecallSnackBarOpen(true);
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  function handleRecallSnackBarClose() {
    setRecallSnackBarOpen(false);
  }

  function handleEmail(event) {
    if (event.target.value) {
      if (event.target.value.trim() !== '' && event.target.checkValidity()) {
        setEmail(event.target.value);
        return;
      }
    }
    setEmail(undefined);
  }

  function handleClick(event, key) {
    const { id, name, oga_no } = boat;
    addEnquiry({ variables: { type: key, id, name, oga_no, email } });
    setSnackBarOpen(true);
  }

  return (
    <Grid container direction="column">
      <Grid container direction="row" alignItems="flex-end">
        <Grid item xs={10}>
          <Typography>{label}</Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="flex-end">
        <Grid item xs={2}>
          <TextField
            onChange={handleEmail}
            fullWidth={true}
            type="email"
            id="sender-email"
            label="your email"
          />
        </Grid>
        <Grid item xs={8}>
          {buttons.map((button) => (
            <Button
              size="small"
              key={button.key}
              variant="contained"
              color="primary"
              disabled={!email}
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={(e) => handleClick(e, button.key)}
            >
              {button.label}
            </Button>
          ))}
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Enquiry Sent"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={recallEnquiry}>
              RECALL
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackBarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={recallSnackBarOpen}
        autoHideDuration={2000}
        onClose={handleRecallSnackBarClose}
        message="It never happened"
      />
    </Grid>
  );
}
