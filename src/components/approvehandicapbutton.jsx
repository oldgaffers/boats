import React, { useState } from "react";
import Button from "@mui/material/Button";
import RoleRestricted from './rolerestrictedcomponent';
import { postBoatData } from "./boatregisterposts";
import { Dialog, DialogActions, DialogTitle, Snackbar } from "@mui/material";

function ApproveHandicapDialog({ boat, user, onClose, open }) {
    const [popoverText, setPopoverText] = useState('');
  
    function approve() {
      postBoatData({ email: user.email, new: { oga_no: boat.oga_no }, changes: { handicap_data: { approved: true }} })
        .then(() => {
          setPopoverText("OK, that should happen soon");
          onClose();
        })
        .catch((error) => {
          // console.log("post", error);
          setPopoverText(error.message);
          onClose();
        });
    }

    return <>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Approve Handicap For {boat.name || ''}</DialogTitle>
        <DialogActions>
          <Button onClick={approve} color="primary">
            Approve
          </Button>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
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
  
export default function ApproveHandicapButton({ boat, user }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <RoleRestricted role='handicap authoriser'>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Approve Handicap
      </Button>
      <ApproveHandicapDialog boat={boat} user={user}
        onClose={handleClose} onCancel={() => setOpen(false)} open={open} 
      />
    </RoleRestricted>
  );
}
