import React, { useContext } from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import Wizard from '@data-driven-forms/common/wizard';
import selectNext from '@data-driven-forms/common/wizard/select-next';

import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import CheckBox from '@data-driven-forms/mui-component-mapper/checkbox';
import Radio from '@data-driven-forms/mui-component-mapper/radio';
import Select from '@data-driven-forms/mui-component-mapper/select';
import TextField from '@data-driven-forms/mui-component-mapper/text-field';
import FieldArray from '@data-driven-forms/mui-component-mapper/field-array';
import PlainText from '@data-driven-forms/mui-component-mapper/plain-text';
import SubForm from '@data-driven-forms/mui-component-mapper/sub-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { dimensionsForm } from "./Dimensions";
import { rigForm } from "./Rig";
import OwnershipForm, { ownershipUpdateForm } from "./ownershipupdateform";
import {
  summaryForm, descriptionsForm,
  registrationForm, constructionForm,
  yachtHullStep, dinghyHullStep
} from "./ddf/SubForms";
import { steps as handicap_steps } from "./Handicap";
import HullForm from "./HullForm";
import { HtmlEditor } from "./ddf/RTE";

import { useAxios } from 'use-axios-client';
import { useAuth0 } from "@auth0/auth0-react";
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { boatRegisterHome } from '../util/constants';

const activities = [
  { label: "Edit the short and full descriptions", value: "descriptions" },
  { label: "Edit MSSI, sail number, etc.", value: "registrations" },
  { label: "Edit Design & Build", value: "construction" },
  { label: "Edit Dimensions", value: "dimensions" },
  { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
  { label: "Edit other fields", value: "summary" },
  { label: "Add or update current or previous owners", value: "own" },
];

export const CLEARED_VALUE = '[remove]';

const schema = (pickers) => ({
  fields: [
    {
      component: 'wizard',
      name: 'boat',
      fields: [
        {
          name: "activity-step",
          nextStep: ({ values }) => `${values?.ddf?.activity || 'descriptions'}-step`,
          fields: [
            {
              name: "activity",
              component: 'sub-form',
              title: "Update Boat",
              description: "Choose one of the options and then click CONTINUE. "
                + " After each section you will be able to submit or carry on. "
                + "Once we have your proposed changes we'll review them and contact you "
                + "if we have any questions",
              fields: [
                {
                  component: 'text-field',
                  name: "ddf.canBuySell",
                  label: "can buy/sell",
                  hideField: true,
                },
                {
                  component: 'text-field',
                  name: "selling_status",
                  label: "selling_status",
                  hideField: true,
                },
                {
                  component: 'text-field',
                  name: "ddf.email",
                  label: "email",
                  hideField: true,
                },
                {
                  component: 'text-field',
                  name: "email",
                  label: "your email",
                  condition: { when: 'ddf.email', isEmpty: true },
                  resolveProps: (props, { meta, input }, formOptions) => {
                    const s = formOptions.getState();
                    if (s.values?.ddf?.email) {
                      return {
                        isHidden: true,
                      };
                    }
                    return {
                      isRequired: true,
                      validate: [
                        { type: validatorTypes.REQUIRED },
                        {
                          type: validatorTypes.PATTERN,
                          pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        }
                      ]    
                    }
                  },
                },
                {
                  component: 'radio',
                  name: "ddf.activity",
                  label: "What would you like to do first?",
                  options: activities,
                  initialValue: 'descriptions',
                  isRequired: true,
                  validate: [{ type: 'required' }],
                  RadioProps: {
                    icon: <BoatAnchoredIcon color="primary" />,
                    checkedIcon: <BoatIcon color="primary" />,
                  },
                },
              ],
            },
          ],
        },
        {
          name: "descriptions-step",
          component: 'sub-form',
          shortcut: true,
          nextStep: "registrations-step",
          fields: [descriptionsForm],
        },
        {
          name: "registrations-step",
          component: 'sub-form',
          shortcut: true,
          nextStep: "construction-step",
          fields: [registrationForm],
        },
        {
          name: "construction-step",
          component: 'sub-form',
          shortcut: true,
          nextStep: "dimensions-step",
          fields: [constructionForm(pickers)],
        },
        {
          name: "dimensions-step",
          component: 'sub-form',
          nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'yacht-hull-step',
          fields: [dimensionsForm],
        },
        yachtHullStep("rig-step"),
        dinghyHullStep("rig-step"),
        {
          name: "rig-step",
          component: 'sub-form',
          shortcut: true,
          nextStep: "handicap-step",
          fields: [rigForm(pickers)]
        },
        ...handicap_steps('own-step'),    
        {
          name: "own-step",
          component: 'sub-form',
          nextStep: "summary-step",
          fields: [ownershipUpdateForm],
        },
        {
          name: "summary-step",
          component: 'sub-form',
          nextStep: "references-step",
          fields: [summaryForm(pickers)],
        },
        {
          name: "references-step",
          component: 'sub-form',
          nextStep: (values) => {
            if (values?.ddf?.canBuySell) {
              switch (values.selling_status){
                case 'for_sale':
                  return 'price-step';
                case 'not_for_sale':
                  return 'sell-step';
                default:
                  return 'done-step';
              }
            } else {
              return 'done-step';
            }
          },
          fields: [
            {
              component: 'field-array',
              name: "reference",
              label: "References in Gaffers Log, etc.",
              fields: [{ component: "text-field" }],
            },
          ],
        },    
        {
          name: "sell-step",
          component: 'sub-form',
          nextStep: "done-step",
          fields: [
            {
              title: "Put Boat For Sale",
              name: "sell",
              component: 'sub-form',
              fields: [
                {
                  component: 'text-field',
                  name: "price",
                  label: "Price (pounds)",
                  type: "number",
                  dataType: 'float',
                  isRequired: true,
                  validate: [{ type: 'required' }],
                },
                {
                  component: "html",
                  title: "Sales Text",
                  name: "sales_text",
                  controls: ["bold", "italic"],
                  maxLength: 500,
                  isRequired: true,
                  validate: [{ type: 'required' }],
                },
              ],
            }
          ],
        },
        {
          name: "price-step",
          component: 'sub-form',
          nextStep: "done-step",
          fields: [
            {
              component: 'plain-text',
              name: "ddf.sell",
              label: "sorry, not yet",
            }
          ],
        },
        {
          name: "unsell-step",
          component: 'sub-form',
          nextStep: "sold-step",
          fields: [
            {
              component: 'plain-text',
              name: "ddf.sell",
              label: "sorry, not yet",
            }
          ],
        },
        {
          name: "sold-step",
          component: 'sub-form',
          nextStep: "done-step",
          fields: [
            {
              component: 'plain-text',
              name: "ddf.sell",
              label: "sorry, not yet",
            }
          ],
        },
        {
          name: "done-step",
          component: 'sub-form',
          fields: [
            {
              name: "ddf.we_are_done",
              component: 'plain-text',
              label:
                "Thanks for helping make the register better. The editor's will review your suggestions.",
            },
          ],
        },
      ],
    },
  ],
});

const WizardInternal = (props) => {
  const {
    prevSteps, formOptions, currentStep, handlePrev, onKeyDown, handleNext, activeStepIndex } = useContext(WizardContext);
  const visited = prevSteps.map((s) => s.replace('-step', ''));
  const toVisit = activities
    .map((a) => a.value)
    .filter((a) => !visited.includes(a));
  const nextActivityStep = (toVisit.length>0) ? `${toVisit[0]}-step` : 'done-step';
  return (
    <Box onKeyDown={onKeyDown} sx={{ width: '100%', position: 'bottom', flexGrow: 1 }}>
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
                  disabled={!formOptions.getState().valid} onClick={() => formOptions.handleSubmit()}
                >
                  Submit
                </Button>
              )}
            </Box>
            <Box>
              <Button
                variant="contained"
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
    </Box>
  );
};

const WrappedWizard = (props) => <Wizard Wizard={WizardInternal} {...props} />;

const FormTemplateCb = (props) => <FormTemplate {...props} showFormControls={false} />;

export default function EditBoat({ onCancel, onSave, boat }) {
  // const [values, setValues] = useState();
  const { user, isAuthenticated } = useAuth0();
  const { data, error, loading } = useAxios(`${boatRegisterHome}/boatregister/pickers.json`);
  if (loading || !data) return <p>Loading...</p>
  if (error) {
    return (<div>
      Sorry, we had a problem getting the data to browse the register
    </div>);
  }
  let roles = [];
  if (isAuthenticated && user) {
    if (user['https://oga.org.uk/roles']) {
      roles = user['https://oga.org.uk/roles'];
    }
  }

  const isOwner = false; // TODO
  const forSale = boat.selling_status === 'for_sale';

  const canBuySell = (roles.includes('member') && isOwner) || roles.includes('editor');

  const state = {
    ...boatm2f(boat),
    ddf: { activity: "descriptions", email: user && user.email, canBuySell },
  };

  // onSubmit={(values) => setValues(values)}

  const handleSubmit = (values) => {
    const { email, ddf, ...result } = values;
    const updates = boatf2m(result);
    // console.log('BOAT', updates, result);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = { ...ohd, ...nhd };
    const before = boatDefined(boat);
    const updatedBoat = { ...before, ...updates };
    onSave({ old: before, new: updatedBoat, email });
  };


  const options = [...activities];

  if (canBuySell) {
    if (forSale) {
      options.push({ label: 'Change Price', value: 'price' });
      options.push({ label: 'Set sold', value: 'sold' });
      options.push({ label: 'Set not for sale', value: 'unsell' });
    } else {
      options.push({ label: 'Put up for sale', value: 'sell' });
    }
  }

  const pickers = data;

  return (
    <Box sx={{ width: '90vh', height: '500px', margin: '1em', marginTop: '2em' }}>
      <FormRenderer
        schema={schema(pickers)}
        componentMapper={{
          checkbox: CheckBox,
          'field-array': FieldArray,
          html: HtmlEditor,
          "hull-form": HullForm,
          "ownership-form": OwnershipForm,
          'plain-text': PlainText,
          radio: Radio,
          select: Select,
          'sub-form': SubForm,
          'text-field': TextField,
          wizard: WrappedWizard,
        }}
        FormTemplate={FormTemplateCb}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
        clearedValue={CLEARED_VALUE}
      />
    </Box>
  );
};

EditBoat.displayName = 'Edit Boat Data';
