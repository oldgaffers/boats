import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { boatf2m } from "../util/format";
import CreateBoatDialog from "./createboatdialog";
// const CreateBoatDialog = React.lazy(() => import("./createboatdialog"));

export default function CreateBoatButton({ onSubmit=() => {}, onCancel=() => {} }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    onCancel();
  };

  const handleSend = (values) => {
    const { user, email, ddf, ...b } = values;
    const { new_design_class, new_designer, new_builder, ...boat} = b;
    const { fileList, copyright } = ddf;
    setOpen(false);
    const formData = new FormData();
    if (fileList && fileList.length>0) {
      for(let i=0; i<fileList.length; i++) {
        formData.set(`file[${i}]`, fileList[i]);
      }
    }
    const create = {};
    if(new_design_class) {
      create.design_class = new_design_class;
    }
    if(new_designer) {
      create.designer = new_designer;
    }
    if(new_builder) {
      create.builder = new_builder;
    }
    formData.set("boat", JSON.stringify(boatf2m(boat)));
    formData.set("create", JSON.stringify(create));
    formData.set("copyright", copyright);
    formData.set("email", email);
    formData.set("uuid", uuidv4());
    axios.post(
      'https://ac861c76e041d1b288fba6a2f1d52bdb.m.pipedream.net',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          pipedream_upload_body: 1,
        },
      },
    ).then(response => {
      console.log(response);
      setSnackBarOpen(true);
      onSubmit(boat);
    }).catch(error => {
      console.log('post', error);
      // TODO snackbar from response.data
    });      
  };

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