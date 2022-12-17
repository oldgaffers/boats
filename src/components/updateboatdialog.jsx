import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import EditBoat from './editboat';

export default function UpdateBoatDialog({ boat, user, onClose, open }) {

  const handleCancel = () => {
    onClose();
  }

  const handleSave = (changes) => { 
    onClose(changes);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <EditBoat
      onCancel={handleCancel} onSave={handleSave}
      boat={boat} user={user}
      />
    </Dialog>
  );
}

UpdateBoatDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
