import { useEffect, useState } from "react";
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
  }, [boat, albumKey]);
  return albumKey;
}

export function useGetExistingOrNewAlbumKey(boat, email) {
  const existingAlbumKey = useGetAlbumKey(boat);
  if (existingAlbumKey) {
    return existingAlbumKey;
  }
  createPhotoAlbum(boat.name, boat.oga_no).then(async (response) => {
    if (response.ok) {
      boat.image_key = (await response.json()).albumKey;
      const response2 = await postBoatData({ new: boat, email })
      if (!response2.ok) {
        console.log('problem updating boat register with new album key', response.statusText);
      }
      return boat.image_key;
    }
  });
  return null;
}

export default function AddPhotosDialog({ boat, onClose, onCancel, open }) {
  // console.log('AddPhotosDialog', boat, open, onClose, onCancel);
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState((user && user.email) || '');
  const [copyright, setCopyright] = useState(''); // user && user.name);
  const [progress, setProgress] = useState(0);
  const albumKey = useGetExistingOrNewAlbumKey(boat, email);

  if (open && !albumKey) {
    console.log("can't get album key...");
    return "No album to upload to.";
  }

  const onDrop = (p) => {
    setPictures(p);
  };

  const handleClose = () => {
    setPictures([]);
    setProgress(0);
    onClose();
  }

  const onUpload = async () => {
      const r = await postPhotos(copyright, email, albumKey, pictures, setProgress);
      r.forEach((res, idx) => {
        console.log(res.status, 'Uploaded', pictures[idx].name);
      });
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
              disabled={!ready()}
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
              <Button size="small" variant="outlined" onClick={handleClose}>
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
