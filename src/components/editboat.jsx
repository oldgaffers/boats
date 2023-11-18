import React, { useContext, useEffect, useState } from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import Wizard from '@data-driven-forms/common/wizard';
import selectNext from '@data-driven-forms/common/wizard/select-next';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from '@data-driven-forms/mui-component-mapper/component-mapper';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import HullForm from "./HullForm";
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { getPicklists } from '../util/api';
import { schema } from './editboat_schema';
import { currentSaleRecord, SaleRecord } from '../util/sale_record';
import HtmlEditor from './tinymce';
import { newPicklistItems } from './createboatbutton';

const WizardInternal = (props) => {
  const {
    prevSteps, formOptions, currentStep, handlePrev, onKeyDown, handleNext, activeStepIndex } = useContext(WizardContext);
  const steps = formOptions.schema.fields.find(
    ({ name, component }) => name === 'boat' && component === 'wizard'
  ).fields.map((f) => f.name);
  const toVisit = steps.filter((step) => !prevSteps.includes(step));
  const nextActivityStep = (toVisit.length > 0) ? toVisit[0] : 'done-step';

  const state = formOptions.getState();
  // console.log(state);
  const submitDisabled = !state.valid || !state.dirty;

  return (
    <Stack
      onKeyDown={onKeyDown}
      sx={{ width: '100%', position: 'bottom', flexGrow: 1 }}
    >
      {currentStep.title}
      {formOptions.renderForm(currentStep.fields)}
      <FormSpy>
        {() => (
          <Box sx={{ borderTop: "0.5em", display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <Box>
              <Button
                variant="contained"
                onClick={handlePrev} disabled={activeStepIndex === 0}
              >
                Back
              </Button>
            </Box>
            <Box>
              {(currentStep.shortcut || !currentStep.nextStep) && (
                <Button
                  variant="contained"
                  disabled={submitDisabled}
                  onClick={() => formOptions.handleSubmit()}
                >
                  Submit
                </Button>
              )}
            </Box>
            <Box>
              <Button
                variant="outlined"
                onClick={formOptions.onCancel}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              {(currentStep.nextStep || nextActivityStep) && (
                <Button
                  variant="contained"
                  disabled={!formOptions.getState().valid}
                  onClick={() => handleNext(selectNext(
                    currentStep.nextStep || nextActivityStep, formOptions.getState))}
                >
                  {currentStep.nextStep && 'Continue'}
                  {!currentStep.nextStep && 'More'}
                </Button>)}
            </Box>
          </Box>
        )}
      </FormSpy>
    </Stack>
  );
};

const WrappedWizard = (props) => <Wizard Wizard={WizardInternal} {...props} />;

const FormTemplateCb = (props) => <FormTemplate {...props} showFormControls={false} />;

function owns(boat, user) {
  const id = user?.['https://oga.org.uk/id'];
  if (id) {
    return boat.ownerships.filter((o) => o?.id === id).length > 0;
  }
  return false;
}

export default function EditBoat({ onCancel, onSave, boat, user }) {
  const [pickers, setPickers] = useState();

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => setPickers(r)).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  const roles = user?.['https://oga.org.uk/roles'] || [];

  const isOwner = owns(boat, user);

  const canBuySell = (roles.includes('member') && isOwner) || roles.includes('editor');
  const forSale = boat.selling_status === 'for_sale';

  const state = {
    ...boatm2f(boat),
    ddf: { activity: "descriptions", email: user && user.email, canBuySell },
  };

  const handleSubmit = (values) => {
    const { email, ddf, ...result } = values;
    const np = newPicklistItems(result);
    const updates = boatf2m(np.boat);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = { ...ohd, ...nhd };
    if (ohd.thcf && nhd.thcf && Math.abs(nhd.thcf - ohd.thcf) > 0.01) {
      updates.handicap_data.checked = false;
    }
    if (ohd.solent?.thcf && nhd.solent?.thcf && Math.abs(nhd.solent.thcf - ohd.solent.thcf) > 0.01) {
      updates.handicap_data.checked = false;
    }
    console.log(updates);
    if (ddf.update_sale === 'unsell') {
      updates.selling_status = 'not_for_sale';
    }
    if (ddf.sale_price) { // sold!
      updates.selling_status = 'not_for_sale'; // could be 'sold'
      const fs = currentSaleRecord(boat);
      if (fs) {
        const pfs = boat.for_sales.filter((f) => f.created_at !== fs.created_at);
        fs.sold = ddf.date_sold;
        fs.asking_price = ddf.sale_price;
        fs.summary = ddf.summary;
        updates.for_sales = [{ ...fs }, ...pfs];
      } else {
        // console.log("no current sales record - this shouldn't happen");
      }
    }
    if (ddf.confirm_for_sale) {
      const current = boat.ownerships.find((o) => o.current);
      const fs = new SaleRecord(ddf.price, ddf.sales_text, current);
      const pfs = boat.for_sales || [];
      const for_sales = [{ ...fs }, ...pfs];
      if (for_sales.length > 0) {
        updates.for_sales = for_sales;
      } else {
        delete updates.for_sales;
      }
      updates.selling_status = 'for_sale';
    }
    if (updates.construction_method?.trim() === '') {
      delete updates.construction_method;
    }
    if (!updates.year_is_approximate) {
      delete updates.year_is_approximate;
    }
    const before = boatDefined(boat);
    const updatedBoat = { ...before, ...updates };
    const { newItems } = np;
    // console.log('BOAT', updates, newItems);
    onSave({ old: before, new: updatedBoat, email: email || ddf.email, newItems });
  };

  return (
    <Box sx={{ height: '600px', margin: '1em', marginTop: '2em' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <FormRenderer
          schema={schema(pickers, canBuySell, forSale)}
          componentMapper={{
            ...componentMapper,
            html: HtmlEditor,
            'hull-form': HullForm,
            wizard: WrappedWizard,
          }}
          FormTemplate={FormTemplateCb}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          initialValues={state}
          clearedValue=' '
        />
      </LocalizationProvider>
    </Box>
  );
};

EditBoat.displayName = 'Edit Boat Data';
