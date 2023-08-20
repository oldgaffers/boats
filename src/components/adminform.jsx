import React, { useState, useEffect } from "react";
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import componentMapper from "@data-driven-forms/mui-component-mapper/component-mapper";
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import TextField from '@data-driven-forms/mui-component-mapper/text-field';
import BoatIcon from "./boaticon";
import BoatAnchoredIcon from "./boatanchoredicon";

const FieldListener = (props) => {
  const [field, setField] = useState();
  const { getState, change } = useFormApi();
  const modified = getState().modified;

  // console.log(getFieldState(field).value);
  if (field === 'some non-existing field') {
    change(field.replace('member', 'id'), 'something');
  }

  useEffect(() => {
    const f = Object.keys(modified).find((key) => modified[key]);
    if (f) {
      // console.log('CHANGE', f);
      setField(f);
    }
  }, [modified]);

  return (<TextField {...props}/>);
};

const FieldListenerWrapper = (props) => <FormSpy subcription={{ values: true }}>{() => <FieldListener {...props} />}</FormSpy>;

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
            name: "done-step",
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: "ddf.we_are_done",
                label:
                  "Thanks for helping make the register better.",
              },
            ],
          },
        ],
      },
    ],
  };
};

export default function AdminForm({ onCancel, onSave, boat }) {

  const state = { 
    ddf: { activity: "feature" },
    boat,
  };

  const handleSubmit = (values) => {
    onSave({ boat: values.boat });
  };

  return (
      <FormRenderer
        schema={schema()}
        componentMapper={{
          ...componentMapper,
          'field-listener': FieldListenerWrapper,
        }}
        FormTemplate={(props) => (
          <FormTemplate {...props} showFormControls={false} />
        )}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        initialValues={state}
        subcription={{ modified: true }}
      />
  );
}
