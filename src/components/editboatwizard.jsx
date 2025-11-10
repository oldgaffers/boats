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
import OwnershipForm from "./ownershipupdateform";
import Typography from "@mui/material/Typography";
import { getPicklists, nextOgaNo, openPr } from '../util/api';
import HtmlEditor from './ddf/trix';
import { useAuth0 } from '@auth0/auth0-react';
import { prepareInitialValues, prepareModifiedValues } from '../../src/components/editboatwizardfunctions';
import defaultSchema from './ddf/editboat_schema';

function EditWiz({ boat, onCancel, onSubmit, schema, pr }) {
  const [pickers, setPickers] = useState();
  const [data, setData] = useState(boat);
  const { user } = useAuth0();

  useEffect(() => {
    if (!data.oga_no) {
      nextOgaNo().then((no) => {
        setData({ ...data, oga_no: no });
      }).catch((e) => console.log(e));
    }
  }, [data, boat]);

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => {
        setPickers(r)
      }).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  const activeSchema = schema || defaultSchema(!data.name);

  const handleSubmit = (_, formApi) => {

    const state = formApi.getState()

    // N.B. the values from the values parameter can be incomplete.
    // the values in the state seem correct

    const { newItems, email, boat } = prepareModifiedValues(state.values, data, pickers);

    onSubmit(
      newItems,
      boat,
      email,
    );

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
    schema={activeSchema}
    onSubmit={handleSubmit}
    onCancel={onCancel}
    initialValues={prepareInitialValues(data, user, pr)}
    subscription={{ values: true }}
  />;
}

function EditBoatWizardDialog({ boat, open, onCancel, onSubmit, schema, pr }) {

  const title = boat.name ? `Update ${boat.name} (${boat.oga_no})` : 'Add New Boat';
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
          boat={boat}
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
