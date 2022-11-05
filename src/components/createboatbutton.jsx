import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { boatf2m } from "../util/format";
import CreateBoatDialog from "./createboatdialog";
import { getFilterable, findFirstAbsent } from '../util/oganoutils';

function sendToAws(boat, create, email, fileList, copyright, uuid, onSuccess, onError) {
  getFilterable().then((response) => {
    const ogaNo = findFirstAbsent(response.data);
    boat.oga_no = ogaNo;
    console.log('sendToAws', boat, create, email, fileList, copyright, uuid);
    console.log('TODO pictures', fileList, copyright);
    const { name, oga_no, ...rest } = boat;
    const data = {
      name,
      oga_no,
      create,
      differences: Object.keys(rest).map((field) => ({ field, proposed: boat[field] })),
      originator: email,
      id: uuid,
    };
    axios.put(
      'https://5li1jytxma.execute-api.eu-west-1.amazonaws.com/default/public/edit_boat',
      data).then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        onError(error);
      });
  }).catch((e) => {
    console.log();
  });
}

function sendToPipedream(boatMetric, create, email, fileList, copyright, uuid, onSuccess, onError) {
  const formData = new FormData();
  if (fileList && fileList.length > 0) {
    for (let i = 0; i < fileList.length; i++) {
      formData.set(`file[${i}]`, fileList[i]);
    }
  }
  formData.set("boat", JSON.stringify(boatMetric));
  formData.set("create", JSON.stringify(create));
  formData.set("copyright", copyright);
  formData.set("email", email);
  formData.set("uuid", uuid);
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
  ).then(response => onSuccess(response)).catch(error => onError(error));
}

export default function CreateBoatButton({ onSubmit = () => { }, onCancel = () => { } }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    onCancel();
  };

  const handleSend = (values) => {
    setOpen(false);
    const { user, email, ddf, ...b } = values;
    const { new_design_class, new_designer, new_builder, ...boat } = b;
    const { fileList, copyright } = ddf;

    const create = {};
    if (new_design_class) {
      create.design_class = new_design_class;
    }
    if (new_designer) {
      create.designer = new_designer;
    }
    if (new_builder) {
      create.builder = new_builder;
    }
    const boatMetric = boatf2m(boat);
    const uuid = uuidv4();

    onSubmit({ boat: boatMetric, create, email, uuid });

    sendToAws(boatMetric, create, email, fileList, copyright, uuid,
      (response) => {
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
