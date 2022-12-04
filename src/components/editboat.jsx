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
import {
  summaryForm, descriptionsForm,
  registrationForm, constructionForm,
  yachtHullStep, dinghyHullStep
} from "./ddf/SubForms";
import { steps as handicap_steps } from "./Handicap";
import HullForm from "./HullForm";
import { HtmlEditor } from "./ddf/RTE";
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { useGetPicklists } from './boatregisterposts';

export const CLEARED_VALUE = '[remove]';

const schema = (pickers, canBuySell, forSale) => {
  const activities = [
    { label: "Edit the short and full descriptions", value: "descriptions" },
    { label: "Edit MSSI, sail number, etc.", value: "registrations" },
    { label: "Edit Design & Build", value: "construction" },
    { label: "Edit Dimensions", value: "dimensions" },
    { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
    { label: "Edit other fields", value: "summary" },
    { label: "Add or update current or previous owners", value: "own" },
  ];
  if (canBuySell) {
    if (forSale) {
      activities.push({ label: 'Change Price', value: 'price' });
      activities.push({ label: 'Set sold', value: 'sold' });
      activities.push({ label: 'Set not for sale', value: 'unsell' });
    } else {
      activities.push({ label: 'Put up for sale', value: 'sell' });
    }
  }
  return {
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
            // fields: [ownershipUpdateForm],
            fields: [
              {
                component: 'plain-text',
                name: 'ddf.ownerships_label',
                label: 'You can add, remove and edit ownership records on this page.'
                  + ' If you are listed as a current owner and this is no-longer true add an end year and uncheck the box.'
                  + ' Your changes will be send to the editors who will update the boat\'s record'
              },
              {
                component: 'field-array',
                name: "ownerships",
                label: "Known Owners",
                fields: [
                  { name: 'name', label: 'Name', component: "text-field" },
                  { name: 'start', label: 'Start', component: "text-field" },
                  { name: 'end', label: 'End', component: "text-field" },
                  { name: 'share', label: 'Share (64ths)', component: "text-field" },
                  { name: 'current', label: 'Current', component: 'checkbox' },
                ],
              },
            ]
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
            nextStep: ({ values }) => {
              console.log('PROPS', values.ddf);
              if (values?.ddf?.canBuySell) {
                switch (values.selling_status) {
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
                    name: "ddf.price",
                    label: "Price (pounds)",
                    type: "number",
                    dataType: 'float',
                    isRequired: true,
                    validate: [{ type: 'required' }],
                  },
                  {
                    component: "html",
                    title: "Sales Text",
                    name: "ddf.sales_text",
                    controls: ["bold", "italic"],
                    maxLength: 500,
                    isRequired: true,
                    validate: [{ type: 'required' }],
                  },
                  {
                    component: 'checkbox',
                    label: 'I want to sell this boat',
                    name: 'ddf.confirm_for_sale',
                    helperText: 'please confirm you want to put this boat up for sale',
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
  }
};

const WizardInternal = (props) => {
  const {
    prevSteps, formOptions, currentStep, handlePrev, onKeyDown, handleNext, activeStepIndex } = useContext(WizardContext);
  const steps = formOptions.schema.fields.find(
    ( { name, component }) => name === 'boat' && component === 'wizard'
  ).fields.map((f) => f.name);
  const toVisit = steps.filter((step) => !prevSteps.includes(step));
  const nextActivityStep = (toVisit.length > 0) ? toVisit[0] : 'done-step';
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
    </Box>
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
  const { data, error, loading } = useGetPicklists();
  if (loading || !data) return <p>Loading...</p>
  if (error) {
    return (<div>
      Sorry, we had a problem getting the data to browse the register
    </div>);
  }

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
    const updates = boatf2m(result);
    // console.log('BOAT', updates, result);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = { ...ohd, ...nhd };
    if (ddf.confirm_for_sale) {
      const fs = {
        asking_price: ddf.price,
        created_at: new Date().toISOString(),
        flexibility: 'normal',
        offered: new Date().toISOString().split('T')[0],
        sales_text: ddf.sales_text,
      };
      const current = boat.ownerships.filter((o) => o.current);
      console.log('CC', current);
      if (current.length > 0) {
        fs.seller_gold_id = current[0].id;
        fs.seller_member = current[0].member;
      }
      const pfs = boat.for_sales || [];
      updates.for_sales = [fs, ...pfs];
      updates.selling_status = 'for_sale';
    }
    const before = boatDefined(boat);
    const updatedBoat = { ...before, ...updates };
    onSave({ old: before, new: updatedBoat, email });
  };

  const pickers = data;

  return (
    <Box sx={{ height: '600px', margin: '1em', marginTop: '2em' }}>
      <FormRenderer
        schema={schema(pickers, canBuySell, forSale)}
        componentMapper={{
          checkbox: CheckBox,
          'field-array': FieldArray,
          html: HtmlEditor,
          "hull-form": HullForm,
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
