import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormRenderer, {  componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";
import HullForm from "./HullForm";
import { rigForm } from "./Rig";
import { steps as handicap_steps } from "./Handicap";
import { boatm2f, boatf2m, boatDefined } from "../util/format";
import { dimensionsForm } from "./Dimensions";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { usePicklists } from "../util/picklists";
import { theme, HtmlEditor } from "./ddf/RTE";
import { 
  cardForm, summaryForm, descriptionsForm, LocationForm, 
  RegistrationForm, constructionForm,
  yachtHullStep, dinghyHullStep } from "./ddf/SubForms";

const activities = [
  { label: "Edit the fields used on the boat's card", value: "card" },
  { label: "Edit the summary", value: "summary" },
  { label: "Edit the short and full descriptions", value: "descriptions" },
  { label: "Edit Location & Registration", value: "locations" },
  { label: "Edit Design & Construction", value: "construction" },
  { label: "Edit Hull & Dimensions", value: "dimensions" },
  { label: "Edit Rig & Sails (or get a handicap)", value: "rig" },
];

const editorActivities = [
  ...activities,
  { label: 'set for-sale', value: 'sell'},
  { label: 'set sold', value: 'sold'},
];

const activityForm = (roles) => { 
  return {
    name: "activity",
    component: componentTypes.SUB_FORM,
    title: "Update Boat",
    description: "Choose one of the options and then click CONTINUE. "
      +"Once we have your proposed changes we'll review them and contact you if we have any questions",
    fields: [
      {
        component: componentTypes.RADIO,
        name: "ddf.activity",
        label: "What would you like to do?",
        options: roles.includes('editor')?editorActivities:activities,
        RadioProps: {
          icon: <BoatAnchoredIcon color="primary" />,
          checkedIcon: <BoatIcon color="primary" />,
        },
      },
    ],
  };
};

export const schema = (pickers, roles) => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            name: "activity-step",
            nextStep: ({ values }) => `${values.ddf.activity}-step`,
            fields: [activityForm(roles)],
          },
          {
            name: "sell-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.sell",
                label: "sorry, not yet",
              }
          ],
          },
          {
            name: "sold-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.sold",
                label: "sorry, not yet",
              }
          ],
          },
          {
            name: "card-step",
            nextStep: "done-step",
            fields: [cardForm(pickers)],
          },
          {
            name: "summary-step",
            nextStep: "references-step",
            fields: [summaryForm(pickers)],
          },
          {
            name: "references-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.FIELD_ARRAY,
                name: "reference",
                label: "References in Gaffers Log, etc.",
                fields: [{ component: "text-field" }],
              },
            ],
          },
          {
            name: "descriptions-step",
            nextStep: "done-step",
            fields: [descriptionsForm],
          },
          {
            name: "locations-step",
            nextStep: "registrations-step",
            fields: [LocationForm],
          },
          {
            name: "registrations-step",
            nextStep: "done-step",
            fields: [RegistrationForm],
          },
          {
            name: "construction-step",
            nextStep: "done-step",
            fields: [constructionForm(pickers)],
          },
          {
            name: "dimensions-step",
            nextStep: ({ values }) => (values.generic_type === 'Dinghy') ? 'dinghy-hull-step' : 'yacht-hull-step',
            fields: [dimensionsForm],
          },
          yachtHullStep("done-step"),
          dinghyHullStep("done-step"),
          {
            name: "rig-step",
            nextStep: "handicap-step",
            fields: [rigForm(pickers)]
          },
          ...handicap_steps,
          {
            name: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better. The editor's will review your suggestions. An email address will let us discuss with you any queries we might have.",
              },
              {
                component: componentTypes.TEXT_FIELD,
                name: "email",
                label: "email",
                isRequired: true,
                validate: [
                  { type: validatorTypes.REQUIRED },
                  {
                    type: validatorTypes.PATTERN,
                    pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                  }
                ]
              },
            ],
          },
        ],
      },
    ],
  };
};

export default function EditBoat({ classes, onCancel, onSave, boat }) {
  const { loading, error, data } = usePicklists();
  const { user, isAuthenticated } = useAuth0();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(can't get picklists)</p>;
  console.log('editboat auth', isAuthenticated, JSON.stringify(user));
  let roles = [];
  if (isAuthenticated && user['https://oga.org.uk/roles']) {
    roles = user['https://oga.org.uk/roles'];
  }
  const pickers = data;

  const state = { 
    ...boatm2f(boat), 
    ddf: { activity: "descriptions" },
    email: user && user.email,
  };

  const handleSubmit = (values) => {
    const { email, ddf, ...result } = values;
    const updates = boatf2m(result);
    // the following is because sail data might be skipped in the form
    const ohd = boat.handicap_data;
    const nhd = updates.handicap_data;
    updates.handicap_data = {...ohd, ...nhd};
    const before = boatDefined(boat);
    const updatedBoat = { ...before, ...updates};
    console.log('boat to save', updatedBoat);
    onSave({old: before, new: updatedBoat, email});
  };

  return (
    <MuiThemeProvider theme={theme}>
      <FormRenderer
        schema={schema(pickers, roles)}
        componentMapper={{
          ...componentMapper,
          "hull-form": HullForm,
          html: HtmlEditor,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
      />
    </MuiThemeProvider>
  );
}
