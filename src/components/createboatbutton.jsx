import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { boatf2m } from "../util/format";
import CreateBoatDialog from "./createboatdialog";
import { postPhotos } from "./postphotos";
import { createPhotoAlbum, postBoatData, nextOgaNo } from './boatregisterposts';
import { v4 as uuidv4 } from 'uuid';

export async function createBoat(boat, email, fileList, copyright, newItems) {
  if (!boat.oga_no) {
    boat.oga_no = await nextOgaNo();
  }
  console.log('sendToAws', boat);
  const albumKey = await createPhotoAlbum(boat.name, boat.oga_no);
  console.log('albumKey', albumKey);
  if (fileList?.length > 0) {
    await postPhotos({ copyright, email, albumKey }, fileList);
  }
  // console.log('files', fileList?.length || 0);
  await postBoatData({ email, new: { ...boat, image_key: albumKey, newItems } });
  // console.log('created boat record');
}

export function newPicklistItems(b) {
  const { new_design_class, new_designer, new_builder, ...boat } = b;
  const newItems = {};
  if (new_design_class) {
    newItems.design_class = { name: new_design_class, id: uuidv4() };
    boat.design_class = newItems.design_class.id;
  }
  if (new_designer) {
    newItems.designer = { name: new_designer, id: uuidv4() } ;
    boat.designer = newItems.designer.id;
  }
  if (new_builder) {
    newItems.builder = { name: new_builder, id: uuidv4() };
    boat.builder = newItems.builder.id;
  }
  return { boat, newItems };
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
    const { fileList, copyright } = ddf;

    const { boat, newItems } = newPicklistItems(b);

    const boatMetric = boatf2m(boat);

    createBoat(boatMetric, email, fileList, copyright, newItems)
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
