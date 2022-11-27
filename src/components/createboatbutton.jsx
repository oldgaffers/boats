import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { boatf2m } from "../util/format";
import CreateBoatDialog from "./createboatdialog";
import { postPhotos } from "./postphotos";
import { createPhotoAlbum, postBoatData } from './boatregisterposts';
import { v4 as uuidv4 } from 'uuid';

async function sendToAws(boat, email, fileList, copyright) {
  const albumKey = await createPhotoAlbum(boat.name, boat.oga_no);
  // console.log('albumKey', albumKey);
  if (fileList?.length > 0) {
    await postPhotos({ copyright, email, albumKey }, fileList);
  }
  // console.log('files', fileList?.length || 0);
  await postBoatData({ email, new: { ...boat, image_key: albumKey } });
  // console.log('created boat record');
}

export default function CreateBoatButton() {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSend = (values) => {
    setOpen(false);
    const { user, email, ddf, ...b } = values;
    const { new_design_class, new_designer, new_builder, ...boat } = b;
    const { fileList, copyright } = ddf;

    if (new_design_class) {
      boat.design_class = { name: new_design_class, id: uuidv4() };
    }
    if (new_designer) {
      boat.designer = { name: new_designer, id: uuidv4() } ;
    }
    if (new_builder) {
      boat.builder = { name: new_builder, id: uuidv4() };
    }
    const boatMetric = boatf2m(boat);

    sendToAws(boatMetric, email, fileList, copyright)
    .then((response) => {
        console.log(response);
        setSnackBarOpen(true);
      },
      (error) => {
        console.log('post', error);
        // TODO snackbar from response.data      
      },
    );
  }

  const snackBarClose = () => {
    setSnackBarOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color='primary'
        onClick={() => setOpen(true)}
      >Add a Boat</Button>
      <CreateBoatDialog
        open={open}
        onCancel={handleCancel}
        onSubmit={handleSend}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={snackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </>
  );
}
