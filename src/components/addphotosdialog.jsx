import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import Photodrop from "./photodrop";

export default function AddPhotosDialog({ boat, onClose, onCancel, open }) {
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState(user && user.email);
  const [copyright, setCopyright] = useState(''); // user && user.name);


  const onDrop = (p) => {
    setPictures(p);
  };

  const onUpload = () => {
    onClose(
      copyright,
      email,
      pictures
    );
  };

  const ready = () => {
    if (pictures.length === 0) return false;
    if (!email) return false;
    if (!copyright) return false;
    return true;
  };

  const onEmail = (e) => {
    setEmail(e.target.value);
  };

  const onCopyright = (e) => {
    setCopyright(e.target.value);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <Paper sx={{ padding: '10px' }}  >
        <Stack spacing={2}>
          <Typography variant="h5">
            Add pictures for {boat.name} ({boat.oga_no})
          </Typography>
          <Photodrop onDrop={onDrop} />
          <TextField
            value={copyright}
            required={true}
            type="text"
            label="Copyright Owner"
            onChange={onCopyright}
          />
          <TextField
            value={email}
            required={true}
            label="Your Email"
            type="email"
            onChange={onEmail}
          />
          <Stack direction='row' justifyContent='space-evenly'>
            <Button size="small" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              disabled={!ready()}
              size="small"
              color="primary"
              variant="contained"
              onClick={onUpload}
            >
              Upload
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Dialog>
  );
}

AddPhotosDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
