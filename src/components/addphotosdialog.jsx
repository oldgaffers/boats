import React, { useEffect, useState } from "react";
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
import { createPhotoAlbum, getAlbumKey, postBoatData } from '../util/api';
import Photodrop from "./photodrop";

async function sortOutMissingAlbum(boat, email) {
  // console.log('No existing album key for boat', boat.oga_no);
  let albumKey = null;
  const rak = await getAlbumKey(boat.name, boat.oga_no);
  if (rak) {
    console.log('got album key from SmugMug, not in github', JSON.stringify(rak));
    albumKey = rak.albumKey;
  } else {
    // console.log('No existing album found');
    const rcpa = await createPhotoAlbum(boat.name, boat.oga_no);
    // console.log('create new album', rcpa.status, rcpa.statusText);
    if (rcpa.ok) {
      const j = await rcpa.json();
      albumKey = j.albumKey;
    } else {
      console.log('problem creating album', rcpa.status, rcpa.statusText);
      const c = await rcpa.json();
      console.log('Response text:', JSON.stringify(c));
      if (c.albumKey) {
        alert("A photo album for this OGA number exists but boat name is different.\n\nThis shouldn't happen.\n\nWe will upload your pictures and the editors will sort it out.");
        albumKey = c.albumKey;
        boat.note = 'Photos uploaded to existing album with different boat name ${c.name}; please check';
      }
    }
  }
  if (albumKey) {
    boat.image_key = albumKey;
  } else {
    console.log('Problem creating album, upload photos to pending area');
    const r = await getAlbumKey('uploaded', '-');
    albumKey = r.albumKey;
    // console.log('got pending album key', JSON.stringify(r));
    boat.note = 'Photos pending assignment to album by OGA admin';
  }
  const response = await postBoatData({ new: boat, email })
  if (!response.ok) {
    console.log('problem updating boat register with new album key', response.statusText);
  }
  return albumKey;
}

export default function AddPhotosDialog({ boat, onClose, onCancel, open }) {
  // console.log('AddPhotosDialog', boat, open, onClose, onCancel);
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState((user && user.email) || '');
  const [copyright, setCopyright] = useState(''); // user && user.name);
  const [progress, setProgress] = useState(0);

  const onDrop = (p) => {
    setPictures(p);
  };

  const handleClose = () => {
    setPictures([]);
    setProgress(0);
    onClose();
  }

  const onUpload = async () => {
    let albumKey = boat.image_key;
    if (albumKey) {
      // console.log('Using existing album key', albumKey);
    } else {
      albumKey = await sortOutMissingAlbum(boat, email);
    }
    console.log('Uploading to album key', albumKey);
    if (albumKey) {
      const r = await postPhotos(copyright, email, albumKey, pictures, setProgress);
      r.forEach((res, idx) => {
        console.log(res.status, 'Uploaded', pictures[idx].name);
      });
    }
  };

  const disableUpload = () => {
    if (pictures.length === 0) return true;
    if (!email) return true;
    if (!copyright) return true;
    if (progress > 0) return true;
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
              <Button size="small" variant="outlined" onClick={onCancel}>
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
