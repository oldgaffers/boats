import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth0 } from "@auth0/auth0-react";
import { postPhotos } from "./postphotos";
import { createPhotoAlbum, getAlbumKey, postBoatData } from '../util/api';
import Photodrop from "./photodrop";
import { CircularProgress } from "@mui/material";

export function useGetAlbumKey(boat) {
  const [albumKey, setAlbumKey] = useState(boat.image_key || null);
  useEffect(() => {
    const get = async () => {
      const r = await getAlbumKey(boat.name, boat.oga_no);
      if (r) {
          // console.log('Found existing album', r);
          setAlbumKey(r.albumKey);
      } else {
          console.log('No existing album');
      }
    };
    if (albumKey === null && boat.oga_no) {
      get();
    }
  }, [boat]);
  return albumKey;
}

export default function AddPhotosDialog({ boat, onClose, onCancel, open }) {
  // console.log('AddPhotosDialog', boat, open, onClose, onCancel);
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState((user && user.email) || '');
  const [copyright, setCopyright] = useState(''); // user && user.name);
  const [progress, setProgress] = useState(0);
  const existingAlbumKey = useGetAlbumKey(boat);

  const onDrop = (p) => {
    setPictures(p);
  };

  const onUpload = async () => {
    let albumKey = null;
    if (existingAlbumKey) {
      albumKey = existingAlbumKey;
    } else {
        const response = await createPhotoAlbum(boat.name, boat.oga_no);
        if (response.ok) {
          albumKey = (await response.json()).albumKey;
        } else {
          console.log(response.statusText);
        }
    }
    await postPhotos(copyright, email, albumKey, pictures, setProgress);
    if (!boat.image_key) {
      boat.image_key = albumKey;
      const response = await postBoatData({ new: boat, email })
      if (!response.ok) {
        console.log(response.statusText);
      }
    }
    onClose();
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
            <CircularProgress variant="determinate" value={progress} />
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
