import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Box, Checkbox, Dialog, DialogActions, DialogContentText, DialogTitle, FormControlLabel, Snackbar } from "@mui/material";
import { useAuth0 } from '@auth0/auth0-react';
import { postScopedData } from '../util/api';

function SetHandicapCheckedDialog({ boat, user={}, onClose, open }) {
  const [popoverText, setPopoverText] = useState('');
  const [dimensions, setDimensions] = useState(false);
  const [sails, setSails] = useState(false);
  const [measurements, setMeasurements] = useState(false);
  const [updated, setUpdated] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const postBoatExtraData = async (cd) => {
    const token = await getAccessTokenSilently();
    const response = await postScopedData('public', 'crewing', cd, token);
    if (response.ok) {
      return true;
    }
    throw response;
  };

  function setchecked() {
    postBoatExtraData({ key: { oga_no: boat.oga_no }, show_handicap: true })
      .then((response) => {
        if (response.ok) {
          setPopoverText("OK, that should happen soon");
          onClose();
        } else {
          setPopoverText(response.statusText);
          onClose();
        }
      })
      .catch((error) => {
        // console.log("post", error);
        setPopoverText(error.message);
        onClose();
      });
  }

  const id = user?.['https://oga.org.uk/id'];
  const owned = boat.ownerships.find((o) => o.id === id && o.current);

  if (owned === undefined && ! (user['https://oga.org.uk/roles'] ||[]).includes('editor')) {
    return <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box padding={2}>
        <DialogTitle id="form-dialog-title">Confirm Handicap Data For {boat.name || ''}</DialogTitle>
        <DialogContentText>
          We don't have you registered as an owner of this boat.
          Please click cancel and contact the boat register editors.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog >;
  }
  return <>
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box padding={2}>
        <DialogTitle id="form-dialog-title">Confirm Handicap Data For {boat.name || ''}</DialogTitle>
        <DialogContentText>Tick all the boxes to enable the submit button</DialogContentText>
        <FormControlLabel
          control={
            <Checkbox checked={dimensions} onChange={(_, checked) => setDimensions(checked)} />
          }
          label="I've checked the boat's dimensions on this page"
        />
        <FormControlLabel
          control={
            <Checkbox checked={sails} onChange={(_, checked) => setSails(checked)} />
          }
          label="I've checked that all sails are present and their dimensions correct"
        />
        <FormControlLabel
          control={
            <Checkbox checked={measurements} onChange={(_, checked) => setMeasurements(checked)} />
          }
          label="I've measured the boat or sails where any dimensions were uncertain"
        />
        <FormControlLabel
          control={
            <Checkbox checked={updated} onChange={(_, checked) => setUpdated(checked)} />
          }
          label="I've updated the Boat Register using the I HAVE EDITS form where necessary"
        />
        <DialogContentText>
          If any data might be incorrect use the cancel button
          and click the CHECK HANDICAP button again when you are ready.
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={setchecked} color="primary"
            disabled={!(measurements && sails && dimensions && updated)}
          >
            I confirm the boat register data are correct
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
    <Snackbar
      open={popoverText !== ''}
      autoHideDuration={3000}
      onClose={() => setPopoverText('')}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      message={popoverText}
    />
  </>;
}

export default function SetHandicapCheckedButton({ boat, user }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  if (!user) {
    return '';
  }

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Check Handicap
      </Button>
      <SetHandicapCheckedDialog boat={boat} user={user}
        onClose={handleClose} onCancel={() => setOpen(false)} open={open}
      />
    </>
  );
}
