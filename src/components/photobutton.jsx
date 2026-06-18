import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddPhotosDialog from './addphotosdialog';
import { createPhotoAlbum, getAlbumKey, postBoatData } from '../util/api';

async function sortOutMissingAlbum(boat) {
  // console.log('No existing album key for boat', boat.oga_no);
  let albumKey = null;
  let note = null;
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
        note = `Photos uploaded to existing album with different boat name ${c.name}; please check`;
      }
    }
  }
  if (albumKey) {
    const nb = { ...boat, image_key: albumKey, note };
    const response = await postBoatData({ new: nb, email: 'boatregister@oga.org.uk' });
    if (!response.ok) {
      console.log('problem updating boat register with new album key', response.statusText);
    }
    return albumKey;
  }
  console.log('Problem creating album, upload photos to pending area');
  const r = await getAlbumKey('uploaded', '-');
  albumKey = r.albumKey;
  // console.log('got pending album key', JSON.stringify(r));
  const nb = { ...boat, note: 'Photos uploaded to pending folder' };
  const response = await postBoatData({ new: nb, email: 'boatregister@oga.org.uk' });
  if (!response.ok) {
    console.log('problem adding note to boat', response.statusText);
  }
  return albumKey;
}

function makeKeywords(boat) {
  const kw = new Set(boat.previous_names || []);
  kw.add(boat.name);
  if (boat.generic_type) {
    kw.add(boat.generic_type);
  }
  if (boat.design_class) {
    kw.add(boat.design_class);
  }
  return [...kw].join(';');
}

export default function PhotoButton({ boat, onDone }) {
  const [open, setOpen] = useState(false);
  const [albumKey, setAlbumKey] = useState(boat.image_key);

  useEffect(() => {
    if (!albumKey) {
      sortOutMissingAlbum(boat)
      .then((r) => {
        setAlbumKey(r);
      });
    }
  }, [boat, albumKey]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  if (!albumKey) {
    return (<CircularProgress />);
  }

  return (
    <div>
      <Button
        size="small"
        endIcon={<PhotoLibraryIcon />}
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Add pictures of this boat
      </Button>
      <AddPhotosDialog
        title={`${boat.name} {${boat.oga_no}`}
        albumKey={albumKey}
        keywords={makeKeywords(boat)}
        onClose={handleClose} onCancel={() => setOpen(false)} open={open} 
      />
    </div>
  );
}
