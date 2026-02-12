import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import OwnershipForm from "./ddf/ownershipupdateform";
import Typography from "@mui/material/Typography";
import { clearNewValues, getPicklists, nextOgaNo, openPr } from '../util/api';
import HtmlEditor from './ddf/trix';
import { useAuth0 } from '@auth0/auth0-react';
import { prepareInitialValues, prepareModifiedValues } from '../../src/components/editboatwizardfunctions';
import defaultSchema from './ddf/editboat_schema';

function EditWiz({ boat, onCancel, onSubmit, schema=defaultSchema(!boat.name), pr }) {
  const [pickers, setPickers] = useState();
  const { user } = useAuth0();

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => {
        setPickers(r)
      }).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  const handleSubmit = (_, formApi) => {

    const state = formApi.getState()

    // N.B. the values from the values parameter can be incomplete.
    // the values in the state seem correct

    const mv = prepareModifiedValues(state.values, boat, pickers);

    clearNewValues().then(() => {
      console.log('Cleared new picklist values');
    }).catch((e) => console.log(e));
  
    onSubmit(mv.newItems, mv.boat, mv.email );

  }

  return <FormRenderer
    componentMapper={{
      ...componentMapper,
      html: HtmlEditor,
      'ownership-form': OwnershipForm,
    }}
    FormTemplate={(props) => (
      <FormTemplate {...props} showFormControls={false} />
    )}
    schema={schema}
    onSubmit={handleSubmit}
    onCancel={onCancel}
    initialValues={prepareInitialValues(boat, user, pr)}
    subscription={{ values: true }}
  />;
}

function EditBoatWizardDialog({ boat, open, onCancel, onSubmit, schema, pr }) {
  const [ogaNo, setOgaNo] = useState(boat.oga_no);

  useEffect(() => {
    if (!ogaNo) {
      nextOgaNo()
      .then(n) => setOgaNo(n))
      .catch((e) => console.log(e));
    }
  }, [ogaNo]);

  if (!ogaNo) {return <CircularProgress />; }

  const title = boat?.name ? `Update ${boat.name} (${ogaNo})` : `Add New Boat with OGA No ${ogaNo}`;
  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >{title}</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <EditWiz
          onCancel={onCancel}
          onSubmit={onSubmit}
          boat={{...boat, oga_no: ogaNo}}
          schema={schema}
          pr={pr}
        />
      </LocalizationProvider>
    </Dialog>
  );
}

export default function EditBoatWizard({ boat, open, onCancel, onSubmit, schema }) {

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
    return <EditBoatWizardDialog boat={data} open={open} onCancel={onCancel} onSubmit={onSubmit} schema={schema} pr={pr} />;
  }
  if (open) {
    return <CircularProgress />;
  }
  return '';
}
