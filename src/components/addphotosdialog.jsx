import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import { postPhotos } from "./postphotos";
import Photodrop from "./photodrop";

/*
1) the copyright owner retains ownership of the image
> 2) you are the copyright owner, or you have obtained permission from the copyright owner for us to use the image as described below
> 3) You grant the OGA a worldwide, non-exclusive, royalty-free, sublicensable, and transferable licence to host, store, reproduce, distribute, modify, and display the image on OGA and third party platforms such as social media outlets
> 4) You grant permission for the OGA and OGA Areas and Sections to print the image in non-commercial publications, for example in Gaffers Log, brochures and event flyers, in support of the OGA's purposes.
*/
export default function AddPhotosDialog({ title, albumKey, keywords, onClose, onCancel, open }) {
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState((user && user.email) || '');
  const [copyright, setCopyright] = useState(''); // user && user.name);
  const [progress, setProgress] = useState(0);
  const [uploadButtonPressed, setUploadButtonPressed] = useState(false);

  const onDrop = (p) => {
    setPictures(p);
  };

  const handleClose = () => {
    setPictures([]);
    setProgress(0);
    setUploadButtonPressed(false);
    onClose();
  }
  
  const handleCancel = () => {
    setPictures([]);
    setProgress(0);
    setUploadButtonPressed(false);
    onCancel();
  }

  const onUpload = () => {
    setUploadButtonPressed(true);
    postPhotos(copyright, email, keywords, albumKey, pictures, setProgress)
    .then(r => {
      r.forEach((res, idx) => {
        console.log(res.status, 'Uploaded', pictures[idx].name);
      });
    })
    .catch((r) => {
      console.error('error on upload', r);
    });
  };

  const disableUpload = () => {
    if (uploadButtonPressed) return true;
    if (pictures.length === 0) return true;
    if (!email) return true;
    if (!copyright) return true;
    return false;
  }

  const onEmail = (e) => {
    setEmail(e.target.value);
  };

  const onCopyright = (e) => {
    setCopyright(e.target.value);
  };

  const percent = Math.round(progress);

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <Paper sx={{ padding: '10px' }}  >
        <Stack spacing={2}>
          <Typography variant="h5">
            Add pictures for {title}
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
            <Button
              disabled={disableUpload()}
              size="small"
              color="primary"
              variant="contained"
              onClick={onUpload}
            >
              Upload
            </Button>
            <Box sx={{ width: '4em', textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{percent}%</Typography>
            </Box>
            {(progress < 100) ?
              <Button size="small" variant="outlined" onClick={handleCancel}>
                Cancel
              </Button> :
              <Button size="small" variant="contained" onClick={handleClose}>
                Close
              </Button>
            }
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
