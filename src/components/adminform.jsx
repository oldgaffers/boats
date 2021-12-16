import React from "react";
import FormRenderer, {  componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import {
  componentMapper,
  FormTemplate,
} from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider } from "@material-ui/core/styles";
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";
import { theme, HtmlEditor } from "./ddf/RTE";

export const schema = () => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "boat",
        fields: [
          {
            name: "activity-step",
            nextStep: ({ values }) => `${values.ddf.activity}-step`,
            fields: [
              {
                name: "activity",
                component: componentTypes.SUB_FORM,
                title: "Admin Options",
                description: "Choose one of the options and then click CONTINUE.",
                fields: [
                  {
                    component: componentTypes.RADIO,
                    name: "ddf.activity",
                    label: "What would you like to do?",
                    options: [
                      { label: 'feature', value: 'feature'},
                      { label: 'set gallery', value: 'gallery'},
                      { label: 'set owner', value: 'own'},
                      { label: 'set for-sale', value: 'sell'},
                      { label: 'set sold', value: 'sold'},
                    ],
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
            name: "feature-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.feature",
                label: "sorry, not yet",
              }
          ],
          },          
          {
            name: "gallery-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.gallery",
                label: "sorry, not yet",
              }
          ],
          },          
          {
            name: "own-step",
            nextStep: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.own",
                label: "sorry, not yet",
              }
          ],
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
            name: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better.",
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

export default function AdminForm({ classes, onCancel, onSave, boat }) {
  const state = { 
    ddf: { activity: "feature" },
  };

  const handleSubmit = (values) => {
    onSave(values);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <FormRenderer
        schema={schema()}
        componentMapper={{
          ...componentMapper,
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
