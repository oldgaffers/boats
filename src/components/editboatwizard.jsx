import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import { openPr } from '../util/api';
import BoatWizard from "./boatwizardclaude";

function EditBoatWizardDialog({ boat, open, onCancel, onSubmit, pr }) {

  const title = boat.name ? `Update ${boat.name} (${boat.oga_no})` : 'Add New Boat';
  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <BoatWizard
          onCancel={onCancel}
          onSubmit={onSubmit}
          boat={boat}
          pr={pr}
          title={title}
        />
      </LocalizationProvider>
    </Dialog>
  );
}
export default function EditBoatWizard({ boat, open, onCancel, onSubmit }) {

  const [data, setData] = useState();
  const [pr, setPr] = useState(false);

  useEffect(() => {
    if (!open) {
      setData(undefined);
    } else if (!data) {
      openPr(boat.oga_no).then((modified) => { 
        if (modified) {
          setData(modified);
          setPr(true);
        } else {
          setData(boat);
        }
      });
    }
    }, [open, data, boat]);
  if (data) {
    return <EditBoatWizardDialog boat={data} open={open} onCancel={onCancel} onSubmit={onSubmit} pr={pr} />;
  }
  if (open) {
    return <CircularProgress />;
  }
  return '';
}

